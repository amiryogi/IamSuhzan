const express = require('express');
const multer = require('multer');
const {
  uploadImage,
  uploadVideo,
  deleteFile,
  uploadMultiple,
} = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const anyFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const uploadImageMiddleware = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

const uploadVideoMiddleware = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).single('file');

const uploadMultipleMiddleware = multer({
  storage,
  fileFilter: anyFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).array('files', 10); // Max 10 files

router.post('/image', protect, uploadImageMiddleware, uploadImage);
router.post('/video', protect, uploadVideoMiddleware, uploadVideo);
router.post('/multiple', protect, uploadMultipleMiddleware, uploadMultiple);
router.delete('/', protect, deleteFile);

module.exports = router;
