const jwt = require('jsonwebtoken');
const { knex } = require('../../db');
const { referralCode } = require('../../functions');

module.exports = async (req, res) => {
  const { verificationToken, otp } = req.body;

  /** error template */
  if (!verificationToken) return res.status(400).json({ status: false, message: 'Missing required params.', });
  if (!otp) return res.status(400).json({ status: false, message: 'Missing required params.', });
  /** token verification process */
  jwt.verify(verificationToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(409).json({ status: false, message: 'Token is invalid or expired.', });
    /** token validation */
    if (decoded.token_type !== 'account-verification') return res.status(409).json({ status: false, message: 'Token is invalid or expired.', });

    /** verifying user email*/
    const [user] = await knex('user_master').select('*').where('id', '=', decoded.me).returning('id');
    if (!user) return res.status(409).json({ status: false, message: 'Token is invalid or expired.', });

    if (user?.otp?.toString() !== otp?.toString()) return res.status(409).json({ status: false, message: 'Entered OTP is invalid.', });
    await knex('user_master').update({ is_confirmed: true, otp: null, active_step: 'claim-nft' }).where('id', '=', decoded.me).returning('id');

    await referralCode.onEmailVerification(user);

    /** success template */
    res.status(200).send({ message: 'Email verified.' });
  });
};
