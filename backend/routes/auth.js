const express = require('express');
const {
  register,
  login,
  getMe,
  getProfile,
  updateProfile,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/profile', getProfile);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
