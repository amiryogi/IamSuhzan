const Photography = require("../models/Photography");
const cloudinary = require("../config/cloudinary");

// @desc    Get all photography works
// @route   GET /api/photography
// @access  Public
exports.getAllPhotography = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // If not authenticated, only return active items
    if (!req.user) {
      query.isActive = true;
    } else if (active !== undefined) {
      query.isActive = active === "true";
    }

    const photos = await Photography.find(query).sort("-createdAt");

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get latest photography works (for home page)
// @route   GET /api/photography/latest
// @access  Public
exports.getLatestPhotography = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const photos = await Photography.find({ isActive: true })
      .sort("-createdAt")
      .limit(limit);

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single photography work
// @route   GET /api/photography/:id
// @access  Public
exports.getPhotography = async (req, res, next) => {
  try {
    const photo = await Photography.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photography work not found",
      });
    }

    res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create photography work
// @route   POST /api/photography
// @access  Private (Admin only)
exports.createPhotography = async (req, res, next) => {
  try {
    const photo = await Photography.create(req.body);

    res.status(201).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update photography work
// @route   PUT /api/photography/:id
// @access  Private (Admin only)
exports.updatePhotography = async (req, res, next) => {
  try {
    let photo = await Photography.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photography work not found",
      });
    }

    // If image is being changed, delete old image from Cloudinary
    if (
      req.body.imageUrl &&
      req.body.imageUrl !== photo.imageUrl &&
      photo.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(photo.imagePublicId);
      } catch (cloudinaryErr) {
        console.error(
          "Failed to delete old image from Cloudinary:",
          cloudinaryErr
        );
      }
    }

    photo = await Photography.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: photo,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete photography work
// @route   DELETE /api/photography/:id
// @access  Private (Admin only)
exports.deletePhotography = async (req, res, next) => {
  try {
    const photo = await Photography.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photography work not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (photo.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(photo.imagePublicId);
      } catch (cloudinaryErr) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryErr);
      }
    }

    await photo.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get unique categories
// @route   GET /api/photography/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Photography.distinct("category", {
      isActive: true,
      category: { $ne: null, $ne: "" },
    });

    res.status(200).json({
      success: true,
      data: categories.filter(Boolean),
    });
  } catch (err) {
    next(err);
  }
};
