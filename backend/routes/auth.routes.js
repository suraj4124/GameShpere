const express = require('express');
const {
    register,
    login,
    logout
} = require('../controllers/auth.controller');
const { getMe, updateDetails } = require('../controllers/user.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateDetails);

module.exports = router;
