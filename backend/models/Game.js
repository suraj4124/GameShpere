const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    skillLevel: {
        type: String, // Beginner, Intermediate, Pro, All Levels
        enum: ['Beginner', 'Intermediate', 'Pro', 'All Levels'],
        default: 'All Levels'
    },
    maxPlayers: {
        type: Number,
        required: true
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    entryFee: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['open', 'full', 'completed'],
        default: 'open'
    }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
