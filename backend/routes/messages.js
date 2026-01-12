const express = require('express');
const {
    sendMessage,
    getMessages,
    getMessage,
    updateMessageStatus,
    deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', sendMessage);
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessage);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
