const mongoose = require("mongoose");

const HeroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [500, "Subtitle cannot be more than 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    imagePublicId: {
      type: String,
      // Cloudinary public ID for deletion
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for ordering active slides
HeroSlideSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model("HeroSlide", HeroSlideSchema);
