const express = require('express');
const {
    getMe,
    updateDetails
} = require('../controllers/user.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateDetails);

module.exports = router;
