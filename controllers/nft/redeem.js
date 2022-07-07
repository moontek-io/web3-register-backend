const { knex } = require('../../db');
const { error, referralCode } = require('../../functions');
const { getClient } = require('../../lib/imx');
const { redeemPointsConfig } = require('../../reward-config');

const { ETH_NETWORK, OWNER_PRIVATE_KEY, TOKEN_BLUE_PRINT, SMART_CONTRACT_ADDRESS } = process.env;

module.exports = async (req, res) => {
  try {
    const { me: userId } = req.user;
    const [user] = await knex('user_master').select('*').where('id', '=', userId);
    if (!user) {
      return res.status(500).json({ status: false, message: 'User not found' });
    }
    const { wallet_address } = user; // eth wallet public address which will receive the token

    if (user?.reward_point < redeemPointsConfig.redeem_nft)
      return res.status(419).json({ status: false, message: 'Not enough points to redeem.' });

    const minter = await getClient(ETH_NETWORK, OWNER_PRIVATE_KEY);

    const [token_master] = await knex('app_setting_master')
      .select('*')
      .where('setting_key', '=', 'token_id');

    if (!token_master) {
      throw new error(500, 'Please set token id in app setting table!');
    }

    const currentTokenId = token_master?.setting_value || 0;
    const tokenId = parseInt(currentTokenId) || 0;
    const newTokenId = tokenId + 1; // Increment token by 1;

    const mintResponse = await minter.mintV2([
      {
        users: [
          {
            etherKey: wallet_address.toLowerCase(),
            tokens: [{ id: `${newTokenId}`, blueprint: TOKEN_BLUE_PRINT }],
          },
        ],
        contractAddress: SMART_CONTRACT_ADDRESS,
      },
    ]);
    if (mintResponse && mintResponse?.results && mintResponse?.results?.length > 0) {
      const mintRecord = mintResponse?.results[0];
      const mintTokenId = mintRecord?.token_id;

      await knex('app_setting_master')
        .update({ setting_value: `${newTokenId}` })
        .where('id', '=', token_master.id);

      /**********************************************************************/
      // Store Record in Redeem history, by reducing points (Shivam)
      // transaction_type: debit, reward_type: claim_nft_{{mintTokenId}}
      /**********************************************************************/
      await knex('user_master').update({ active_step: 'invite-friends' }).where({ id: user.id });
      await referralCode.onRedeem(user, mintTokenId);

      res.status(200).json({
        status: true,
        message: 'NFT Redeem successful',
        tokenId: mintTokenId,
      });
    } else {
      console.log('Mint NFT Failed', mintResponse);
      throw new error(500, 'Mint NFT failed, please try again later!');
    }
  } catch (error) {
    console.log('Mint NFT Exception', error);
    res.status(500).json({ status: false, message: error?.message });
  }
};
