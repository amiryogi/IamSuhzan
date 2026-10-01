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
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getArtworks);
router.get('/featured', getFeaturedArtworks);
router.get('/stats', adminOnly, getArtworkStats);
router.get('/slug/:slug', optionalAuth, getArtworkBySlug);
router.get('/:id', optionalAuth, getArtwork);

// Protected routes
router.post('/', adminOnly, createArtwork);
router.put('/:id', adminOnly, updateArtwork);
router.delete('/:id', adminOnly, deleteArtwork);

module.exports = router;
