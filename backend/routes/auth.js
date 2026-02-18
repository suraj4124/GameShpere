const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, authController.getMe);

// @route   POST api/auth/logout
// @desc    Logout user / clear cookie
// @access  Private
router.post('/logout', auth, authController.logout);

module.exports = router;
