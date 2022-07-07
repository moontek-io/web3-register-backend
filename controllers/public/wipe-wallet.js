const { knex } = require('../../db');

module.exports = async (req, res) => {
  try {
    var { walletId } = req.params || {};
    if (!walletId) return res.status(500).json({ status: false, message: 'wallet id is required' });

    walletId = walletId.toLowerCase();

    const user = await knex('user_master')
      .select(['id'])
      .where('wallet_address', '=', walletId)
      .andWhere('eth_network', '=', 'ropsten')
      .first();
    if (!user) return res.status(200).json({ status: true, message: 'No account found!' });

    await knex('user_master').where('wallet_address', walletId).delete();
    await knex('reward_history').where('user_id', user.id).delete();

    res.status(200).json({ status: true, message: 'success' });
  } catch (error) {
    res.status(500).json({ status: false, message: error?.message });
  }
};
