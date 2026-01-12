const express = require("express");
const {
  getAllPhotography,
  getLatestPhotography,
  getPhotography,
  createPhotography,
  updatePhotography,
  deletePhotography,
  getCategories,
} = require("../controllers/photographyController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAllPhotography);
router.get("/latest", getLatestPhotography);
router.get("/categories", getCategories);
router.get("/:id", getPhotography);

// Protected routes (Admin only)
router.post("/", protect, createPhotography);
router.put("/:id", protect, updatePhotography);
router.delete("/:id", protect, deletePhotography);

module.exports = router;
