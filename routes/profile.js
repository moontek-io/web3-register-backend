const { authenticate  } = require('../middleware');
const { Profile, NFT  } = require('../controllers');

const express = require('express');
const router = express.Router();
module.exports = router;

router.get('/get-profile', authenticate, Profile.getProfile);
router.post('/redeem-nft', authenticate, NFT.redeemNft);
