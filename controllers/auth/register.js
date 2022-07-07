const jwt = require('jsonwebtoken');
const { error, referralCode } = require('../../functions');
const { knex } = require('../../db');
const { userSchema } = require('../../schemas');

module.exports = async (req, res) => {
  const payload = req.body;

  await userSchema.validate(payload).catch(() => {
    throw error(400, 'Missing required params');
  });

  const { wallet_address, referral_code } = payload;

  var userId = null;
  const user = await knex('user_master').first('*').where('wallet_address', '=', wallet_address);
  if (!user) {
    payload.referral_code = await referralCode.generate();
    payload.reward_point = 0;
    payload.active_step = 'join-discord';

    const newUser = await knex('user_master').insert(payload).returning('id');
    if (!newUser) throw error(401, 'Resource not found');
    userId = newUser[0];
    await referralCode.onCreateAccount({ id: userId, reward_point: 0 }); // While registration user will always have 0 reward_point.
    if(referral_code) await referralCode.onReferralSignup(userId, referral_code);
  } 
  else{
    userId = user.id;
  }


  // the JWT public data payload
  const jwtPayload = { me: userId };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });

  return res.status(200).json({ token, message: 'Authentication successful' });
};
