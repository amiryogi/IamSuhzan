const express = require('express');
const {
  getArtworks,
  getFeaturedArtworks,
  getArtwork,
  getArtworkBySlug,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getArtworkStats,
} = require('../controllers/artworkController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getArtworks);
router.get('/featured', getFeaturedArtworks);
router.get('/stats', protect, getArtworkStats);
router.get('/slug/:slug', getArtworkBySlug);
router.get('/:id', getArtwork);

// Protected routes
router.post('/', protect, createArtwork);
router.put('/:id', protect, updateArtwork);
router.delete('/:id', protect, deleteArtwork);

module.exports = router;
