const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  width: Number,
  height: Number,
  format: String,
  thumbnailUrl: String,
});

const ArtworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    medium: {
      type: String,
      enum: [
        'oil',
        'acrylic',
        'watercolor',
        'charcoal',
        'pencil',
        'pastel',
        'mixed-media',
        'digital',
        'other',
      ],
      default: 'oil',
    },
    surface: {
      type: String,
      enum: ['canvas', 'paper', 'wood', 'board', 'digital', 'other'],
      default: 'canvas',
    },
    dimensions: {
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['inches', 'cm', 'pixels'],
        default: 'inches',
      },
    },
    year: {
      type: Number,
    },
    price: {
      type: Number,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    isForSale: {
      type: Boolean,
      default: false,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    media: [MediaSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    // For competition entries
    competition: {
      name: String,
      year: Number,
      award: String,
      position: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug from title
ArtworkSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    // Add timestamp to ensure uniqueness
    this.slug = `${this.slug}-${Date.now().toString(36)}`;
  }
});

// Index for searching
ArtworkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Artwork', ArtworkSchema);
