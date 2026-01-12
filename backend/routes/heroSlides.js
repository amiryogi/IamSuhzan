const express = require("express");
const {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} = require("../controllers/heroSlideController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getHeroSlides);
router.get("/:id", getHeroSlide);

// Protected routes
router.post("/", protect, createHeroSlide);
router.put("/reorder", protect, reorderHeroSlides);
router.put("/:id", protect, updateHeroSlide);
router.delete("/:id", protect, deleteHeroSlide);

module.exports = router;
