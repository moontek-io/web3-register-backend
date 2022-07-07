const { knex } = require('../../db');

module.exports = async (req, res) => {
  try {
    const [user] = await knex('user_master').select(['id', 'user_email_id', 'discord_member_id', 'wallet_address', 'eth_network', 'imx_token', 'reward_point', 'referral_code', 'active_step', 'is_confirmed']).where('id', '=', req.user.me);
    if(!user) return res.status(401).json({ status: false, error: 'Unauthorized' });
    res.status(200).json({ status: true, message: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error?.message });
  }
};
