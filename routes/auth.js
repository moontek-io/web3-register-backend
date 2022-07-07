const { authenticate, } = require('../middleware');
const { Auth, } = require('../controllers');

const express = require('express');
const router = express.Router();
module.exports = router;

router.post('/register', Auth.register);
router.post('/send-verification-email', authenticate, Auth.sendVerificationEmail);
router.post('/verify-email', Auth.verifyEmail);
