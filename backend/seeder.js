const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Game = require('./models/Game');

const connectDB = require('./config/db');

// Connect to DB
connectDB();

// Read JSON files
// For now, I'll inline some data or read from a _data folder if we had one.
// Let's create dummy data inline for simplicity as requested "Seed script with sample users and games"

const users = [
    {
        name: 'Organizer One',
        email: 'organizer@test.com',
        password: 'password123',
        role: 'organizer',
        sports: ['Basketball', 'Football']
    },
    {
        name: 'Player One',
        email: 'player@test.com',
        password: 'password123',
        role: 'player',
        sports: ['Tennis']
    }
];

const games = [
    {
        title: 'Friday Night Hoops',
        sport: 'Basketball',
        // organizer will need to be ObjectId, handled in import
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Downtown Gym',
        description: 'Friendly 5v5 game',
        maxPlayers: 10,
        skillLevel: 'Intermediate'
    }
];

// Import into DB
const importData = async () => {
    try {
        // Create users first to get IDs
        await User.create(users);

        const organizer = await User.findOne({ email: 'organizer@test.com' });

        // Assign organizer to games
        const gamesWithOrganizer = games.map(game => ({
            ...game,
            organizer: organizer._id,
            players: [organizer._id]
        }));

        await Game.create(gamesWithOrganizer);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Game.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please specify -i (import) or -d (destroy)');
    process.exit();
}
