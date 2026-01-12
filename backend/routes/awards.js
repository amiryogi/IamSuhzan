const express = require("express");
const {
  getAwards,
  getAward,
  createAward,
  updateAward,
  deleteAward,
} = require("../controllers/awardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getAwards);
router.get("/:id", getAward);

// Protected routes
router.post("/", protect, createAward);
router.put("/:id", protect, updateAward);
router.delete("/:id", protect, deleteAward);

module.exports = router;
