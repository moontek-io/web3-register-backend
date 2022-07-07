const { authenticate  } = require('../middleware');
const { Discord  } = require('../controllers');

const express = require('express');
const router = express.Router();
module.exports = router;

router.post('/link-discord', authenticate, Discord.linkDiscord);
