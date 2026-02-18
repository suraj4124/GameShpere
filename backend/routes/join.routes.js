const express = require('express');
const {
    joinGame,
    getJoinRequests
} = require('../controllers/join.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/:gameId', protect, joinGame);
router.get('/requests/:gameId', protect, authorize('organizer'), getJoinRequests);

module.exports = router;
