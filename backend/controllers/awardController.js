const Award = require("../models/Award");
const cloudinary = require("../config/cloudinary");

// @desc    Get all awards (active only for public, all for admin)
// @route   GET /api/awards
// @access  Public
exports.getAwards = async (req, res, next) => {
  try {
    let query = {};

    // If not authenticated, only return active awards
    if (!req.user) {
      query.isActive = true;
    }

    const awards = await Award.find(query).sort("-year order");

    res.status(200).json({
      success: true,
      count: awards.length,
      data: awards,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single award
// @route   GET /api/awards/:id
// @access  Public
exports.getAward = async (req, res, next) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    res.status(200).json({
      success: true,
      data: award,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create award
// @route   POST /api/awards
// @access  Private
exports.createAward = async (req, res, next) => {
  try {
    // Get the highest order number and add 1
    const lastAward = await Award.findOne().sort("-order");
    const order = lastAward ? lastAward.order + 1 : 0;

    const award = await Award.create({
      ...req.body,
      order: req.body.order !== undefined ? req.body.order : order,
    });

    res.status(201).json({
      success: true,
      data: award,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update award
// @route   PUT /api/awards/:id
// @access  Private
exports.updateAward = async (req, res, next) => {
  try {
    let award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    // If image is being changed, delete old image from Cloudinary
    if (
      req.body.imageUrl &&
      req.body.imageUrl !== award.imageUrl &&
      award.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(award.imagePublicId);
      } catch (cloudinaryErr) {
        console.error(
          "Failed to delete old image from Cloudinary:",
          cloudinaryErr
        );
      }
    }

    award = await Award.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: award,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete award
// @route   DELETE /api/awards/:id
// @access  Private
exports.deleteAward = async (req, res, next) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (award.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(award.imagePublicId);
      } catch (cloudinaryErr) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryErr);
      }
    }

    await award.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
