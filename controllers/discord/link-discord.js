const { knex } = require('../../db');
const jwt = require('jsonwebtoken');
const { referralCode } = require('../../functions');

/**
 * 
 * @param {discordToken} => { id, username, avatar} 
 */
module.exports = async (req, res) => {
  const payload = req.body;

  const { discordToken } = payload;
  if (!discordToken) return res.status(400).json({ message: 'Missing required params' });

  jwt.verify(discordToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: `Unauthorized ${err.name}`,
      });
    }

    const [user] = await knex('user_master').select('*').where('id', '=', req.user.me).returning('id');
    if (!user) return res.status(409).json({ status: false, message: 'Token is invalid or expired.', });

    await knex('user_master').update({discord_member_id: decoded.id, active_step: 'add-email' }).where('id', '=', req.user.me).returning('id');
    await referralCode.onDiscordConnection(user);

    res.status(200).json({ message: 'Discord Account Linked Successfully.' });
  });
};
