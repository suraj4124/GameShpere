const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Game = require('../models/Game');

// @route   POST api/games
// @desc    Create a game
// @access  Private (Organizer/Player?)
// MVP: Any logged in user can create? Or only organizer? 
// Plan said "organizer", let's restrict or allow both for MVP simplicity. 
// UserSchema has role. Let's allowing "organizer" role or just all.
// Prompt says "Create Game (Organizer)".
router.post('/', auth, async (req, res) => {
    // Check role?
    // if (req.user.role !== 'organizer') return res.status(401).json({ msg: 'Not authorized' });

    const { sport, date, location, skillLevel, maxPlayers, entryFee, description } = req.body;

    try {
        const newGame = new Game({
            sport,
            organizer: req.user.id,
            date,
            location,
            skillLevel,
            maxPlayers,
            entryFee,
            description,
            players: [req.user.id] // Organizer joins automatically? Or separate? 
            // Usually organizer might not play. Let's NOT add organizer to players by default unless they join.
            // But "players" slot counter should probably include them if they play. 
            // Let's leave players empty initially or add separate logic.
            // Prompt says "Organizer creates a game".
        });

        const game = await newGame.save();
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/games
// @desc    Get all games
// @access  Public
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().sort({ date: 1 }).populate('organizer', 'name');
        res.json(games);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/games/:id
// @desc    Get game by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate('organizer', 'name').populate('players', 'name');
        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }
        res.json(game);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Game not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/games/:id/join
// @desc    Join a game
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ msg: 'Game not found' });

        // Check if full
        if (game.players.length >= game.maxPlayers) {
            return res.status(400).json({ msg: 'Game is full' });
        }

        // Check if already joined
        if (game.players.some(p => p.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Already joined' });
        }

        game.players.push(req.user.id);

        if (game.players.length >= game.maxPlayers) {
            game.status = 'full';
        }

        await game.save();
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
