const HeroSlide = require("../models/HeroSlide");
const cloudinary = require("../config/cloudinary");

// @desc    Get all hero slides (active only for public, all for admin)
// @route   GET /api/hero-slides
// @access  Public
exports.getHeroSlides = async (req, res, next) => {
  try {
    let query = {};

    // If not authenticated, only return active slides
    if (!req.user) {
      query.isActive = true;
    }

    const slides = await HeroSlide.find(query).sort("order");

    res.status(200).json({
      success: true,
      count: slides.length,
      data: slides,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single hero slide
// @route   GET /api/hero-slides/:id
// @access  Public
exports.getHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create hero slide
// @route   POST /api/hero-slides
// @access  Private
exports.createHeroSlide = async (req, res, next) => {
  try {
    // Get the highest order number and add 1
    const lastSlide = await HeroSlide.findOne().sort("-order");
    const order = lastSlide ? lastSlide.order + 1 : 0;

    const slide = await HeroSlide.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : order,
    });

    res.status(201).json({
      success: true,
      data: slide,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update hero slide
// @route   PUT /api/hero-slides/:id
// @access  Private
exports.updateHeroSlide = async (req, res, next) => {
  try {
    let slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    // If image is being changed, delete old image from Cloudinary
    if (
      req.body.imageUrl &&
      req.body.imageUrl !== slide.imageUrl &&
      slide.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(slide.imagePublicId);
      } catch (cloudinaryErr) {
        console.error(
          "Failed to delete old image from Cloudinary:",
          cloudinaryErr
        );
      }
    }

    slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete hero slide
// @route   DELETE /api/hero-slides/:id
// @access  Private
exports.deleteHeroSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (slide.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(slide.imagePublicId);
      } catch (cloudinaryErr) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryErr);
      }
    }

    await slide.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reorder hero slides
// @route   PUT /api/hero-slides/reorder
// @access  Private
exports.reorderHeroSlides = async (req, res, next) => {
  try {
    const { slides } = req.body; // Array of { id, order }

    if (!slides || !Array.isArray(slides)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of slides with id and order",
      });
    }

    // Update each slide's order
    const updatePromises = slides.map(({ id, order }) =>
      HeroSlide.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    const updatedSlides = await HeroSlide.find().sort("order");

    res.status(200).json({
      success: true,
      data: updatedSlides,
    });
  } catch (err) {
    next(err);
  }
};
