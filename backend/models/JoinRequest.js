const mongoose = require('mongoose');

const JoinRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.ObjectId,
        ref: 'Game',
        required: true
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent multiple requests for same game by same user
JoinRequestSchema.index({ game: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('JoinRequest', JoinRequestSchema);
