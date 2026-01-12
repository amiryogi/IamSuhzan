const mongoose = require("mongoose");

const PhotographySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please add an image URL"],
    },
    imagePublicId: {
      type: String,
      // Cloudinary public ID for deletion
    },
    category: {
      type: String,
      trim: true,
      maxlength: [100, "Category cannot be more than 100 characters"],
    },
    dateTaken: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
PhotographySchema.index({ isActive: 1, createdAt: -1 });
PhotographySchema.index({ category: 1 });

module.exports = mongoose.model("Photography", PhotographySchema);
