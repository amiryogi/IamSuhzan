const Artwork = require('../models/Artwork');
const cloudinary = require('../config/cloudinary');
const { wantsHidden } = require('../middleware/auth');

const isAdmin = (req) => req.user?.role === 'admin';

// Fields managed by the server that must never be set from a request body
const stripServerFields = (body) => {
  const { _id, slug, views, createdAt, updatedAt, ...rest } = body;
  return rest;
};

// Shared by the id and slug lookups: hide drafts from the public
// and only count views from visitors
const sendArtwork = async (artwork, req, res) => {
  if (!artwork || (artwork.status !== 'published' && !isAdmin(req))) {
    return res.status(404).json({
      success: false,
      message: 'Artwork not found',
    });
  }

  if (!isAdmin(req)) {
    await Artwork.updateOne({ _id: artwork._id }, { $inc: { views: 1 } });
    artwork.views += 1;
  }

  res.status(200).json({
    success: true,
    data: artwork,
  });
};

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
exports.getArtworks = async (req, res, next) => {
  try {
    let query;

    // Only these fields may be filtered on from the query string
    const filterFields = ['category', 'medium', 'surface', 'featured', 'isForSale', 'isSold', 'year', 'price'];
    const operators = ['gt', 'gte', 'lt', 'lte', 'in'];
    const filter = {};

    filterFields.forEach((field) => {
      const value = req.query[field];
      if (value === undefined) return;

      if (value !== null && typeof value === 'object') {
        // e.g. ?price[gte]=100 -> { price: { $gte: '100' } }
        const ops = {};
        Object.keys(value)
          .filter((op) => operators.includes(op))
          .forEach((op) => {
            ops[`$${op}`] = op === 'in' ? String(value[op]).split(',') : String(value[op]);
          });
        if (Object.keys(ops).length) filter[field] = ops;
      } else {
        filter[field] = String(value);
      }
    });

    // Drafts are only listed for the admin dashboard
    if (wantsHidden(req)) {
      if (['draft', 'published'].includes(req.query.status)) {
        filter.status = req.query.status;
      }
    } else {
      filter.status = 'published';
    }

    // Finding resource
    query = Artwork.find(filter).populate('category', 'name slug');

    // Search functionality
    if (req.query.search) {
      query = query.find({ $text: { $search: String(req.query.search) } });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 100);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Artwork.countDocuments(
      req.query.search ? { ...filter, $text: { $search: String(req.query.search) } } : filter
    );

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const artworks = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: artworks.length,
      total,
      pagination,
      data: artworks,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured artworks
// @route   GET /api/artworks/featured
// @access  Public
exports.getFeaturedArtworks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    
    const artworks = await Artwork.find({ 
      featured: true, 
      status: 'published' 
    })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: artworks.length,
      data: artworks,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
exports.getArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    await sendArtwork(artwork, req, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get artwork by slug
// @route   GET /api/artworks/slug/:slug
// @access  Public
exports.getArtworkBySlug = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOne({ slug: req.params.slug }).populate(
      'category',
      'name slug'
    );

    await sendArtwork(artwork, req, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new artwork
// @route   POST /api/artworks
// @access  Private
exports.createArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.create(stripServerFields(req.body));

    res.status(201).json({
      success: true,
      data: artwork,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private
exports.updateArtwork = async (req, res, next) => {
  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      });
    }

    artwork = await Artwork.findByIdAndUpdate(req.params.id, stripServerFields(req.body), {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: artwork,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private
exports.deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found',
      });
    }

    // Delete images from cloudinary
    if (artwork.media && artwork.media.length > 0) {
      for (const media of artwork.media) {
        if (media.publicId) {
          await cloudinary.uploader.destroy(media.publicId, {
            resource_type: media.type === 'video' ? 'video' : 'image',
          });
        }
      }
    }

    await artwork.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get artwork statistics
// @route   GET /api/artworks/stats
// @access  Private
exports.getArtworkStats = async (req, res, next) => {
  try {
    const stats = await Artwork.aggregate([
      {
        $group: {
          _id: null,
          totalArtworks: { $sum: 1 },
          totalViews: { $sum: '$views' },
          forSale: { $sum: { $cond: ['$isForSale', 1, 0] } },
          sold: { $sum: { $cond: ['$isSold', 1, 0] } },
          featured: { $sum: { $cond: ['$featured', 1, 0] } },
        },
      },
    ]);

    const byMedium = await Artwork.aggregate([
      {
        $group: {
          _id: '$medium',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const byCategory = await Artwork.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$categoryInfo.name',
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats[0],
        byMedium,
        byCategory,
      },
    });
  } catch (err) {
    next(err);
  }
};
