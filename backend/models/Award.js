const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema(
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
    year: {
      type: Number,
      required: [true, "Please add a year"],
    },
    award: {
      type: String,
      trim: true,
      maxlength: [100, "Award name cannot be more than 100 characters"],
    },
    type: {
      type: String,
      enum: ["gold", "silver", "bronze", "featured", "other"],
      default: "other",
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
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

// Index for ordering and filtering
AwardSchema.index({ isActive: 1, year: -1, order: 1 });

module.exports = mongoose.model("Award", AwardSchema);
