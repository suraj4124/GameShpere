const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const gameController = require('../controllers/gameController');

// @route   POST api/games
// @desc    Create a new game
// @access  Private
router.post('/', auth, gameController.createGame);

// @route   GET api/games
// @desc    Get all games
// @access  Public
router.get('/', gameController.getGames);

// @route   GET api/games/:id
// @desc    Get game by ID
// @access  Public
router.get('/:id', gameController.getGame);

// @route   POST api/games/:id/join
// @desc    Join a game
// @access  Private
router.post('/:id/join', auth, gameController.joinGame);

module.exports = router;
