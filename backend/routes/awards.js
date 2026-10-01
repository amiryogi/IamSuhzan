const express = require("express");
const {
  getAwards,
  getAward,
  createAward,
  updateAward,
  deleteAward,
} = require("../controllers/awardController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

const adminOnly = [protect, authorize("admin")];

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getAwards);
router.get("/:id", getAward);

// Protected routes
router.post("/", adminOnly, createAward);
router.put("/:id", adminOnly, updateAward);
router.delete("/:id", adminOnly, deleteAward);

module.exports = router;
