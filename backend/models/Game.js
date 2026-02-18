const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a game title']
    },
    sport: {
        type: String,
        required: [true, 'Please add a sport'],
        enum: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Swimming', 'Badminton', 'Other']
    },
    organizer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String, // You might want to combine date/time or keep separate. 
        // Keeping generic string for flexibility or ISO date logic in controller
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    skillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Pro', 'All Levels'],
        default: 'All Levels'
    },
    maxPlayers: {
        type: Number,
        required: [true, 'Please add max players limit']
    },
    players: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        enum: ['open', 'full', 'completed'],
        default: 'open'
    },
    entryFee: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Helper to check for full status
// This logic usually sits in controller before save, but we can add incomplete middleware or just rely on controller. 
// User request said: "If players.length >= maxPlayers -> status becomes full."
// We'll handle this in the controller or a pre-save hook where players are modified.

module.exports = mongoose.model('Game', GameSchema);
