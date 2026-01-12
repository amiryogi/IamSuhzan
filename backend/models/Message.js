const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        subject: {
            type: String,
            required: [true, 'Please add a subject'],
            enum: ['commission', 'purchase', 'collaboration', 'exhibition', 'general'],
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
            maxlength: [5000, 'Message cannot be more than 5000 characters'],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Message', MessageSchema);
