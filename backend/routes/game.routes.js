const express = require('express');
const {
    getGames,
    getGame,
    createGame,
    updateGame,
    deleteGame
} = require('../controllers/game.controller');

const { joinGame } = require('../controllers/join.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router
    .route('/')
    .get(getGames)
    .post(protect, authorize('organizer', 'admin'), createGame);

router
    .route('/:id')
    .get(getGame)
    .put(protect, authorize('organizer', 'admin'), updateGame)
    .delete(protect, authorize('organizer', 'admin'), deleteGame);

router.route('/:gameId/join').post(protect, joinGame);

module.exports = router;
