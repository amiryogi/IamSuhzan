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
const { protect, authorize, optionalAuth } = require("../middleware/auth");

const adminOnly = [protect, authorize("admin")];

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getAllPhotography);
router.get("/latest", getLatestPhotography);
router.get("/categories", getCategories);
router.get("/:id", getPhotography);

// Protected routes (Admin only)
router.post("/", adminOnly, createPhotography);
router.put("/:id", adminOnly, updatePhotography);
router.delete("/:id", adminOnly, deletePhotography);

module.exports = router;
