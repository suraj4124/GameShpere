const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['player', 'organizer'],
        default: 'player'
    },
    sports: {
        type: [String],
        default: []
    },
    skillLevel: {
        type: String, // Beginner, Intermediate, Pro
        default: 'Beginner'
    },
    location: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
