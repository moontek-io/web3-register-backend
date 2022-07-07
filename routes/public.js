const { Public  } = require('../controllers');

const express = require('express');
const router = express.Router();
module.exports = router;

router.post('/wipe/:walletId', Public.wipeWallet);
