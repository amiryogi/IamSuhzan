const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
exports.sendMessage = async (req, res, next) => {
    try {
        const message = await Message.create(req.body);

        res.status(201).json({
            success: true,
            data: message,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private/Admin
exports.getMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found',
            });
        }

        res.status(200).json({
            success: true,
            data: message,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update message status (read/unread)
// @route   PUT /api/messages/:id
// @access  Private/Admin
exports.updateMessageStatus = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: req.body.isRead },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found',
            });
        }

        res.status(200).json({
            success: true,
            data: message,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found',
            });
        }

        await message.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
