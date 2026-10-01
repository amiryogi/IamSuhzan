const express = require("express");
const {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} = require("../controllers/heroSlideController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

const adminOnly = [protect, authorize("admin")];

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getHeroSlides);
router.get("/:id", getHeroSlide);

// Protected routes
router.post("/", adminOnly, createHeroSlide);
router.put("/reorder", adminOnly, reorderHeroSlides);
router.put("/:id", adminOnly, updateHeroSlide);
router.delete("/:id", adminOnly, deleteHeroSlide);

module.exports = router;
