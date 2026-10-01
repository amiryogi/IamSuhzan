const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    sendMessage,
    getMessages,
    getMessage,
    updateMessageStatus,
    deleteMessage,
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

const router = express.Router();

// Limit contact form spam: 5 messages per hour per IP
const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many messages sent. Please try again later.' },
});

router.post('/', messageLimiter, sendMessage);
router.get('/', adminOnly, getMessages);
router.get('/:id', adminOnly, getMessage);
router.put('/:id', adminOnly, updateMessageStatus);
router.delete('/:id', adminOnly, deleteMessage);

module.exports = router;
