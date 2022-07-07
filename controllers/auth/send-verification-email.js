const jwt = require('jsonwebtoken');
const { knex } = require('../../db');
const { otpGenerator, smtp } = require('../../functions');

module.exports = async (req, res) => {
  const { email } = req.query;

  /** Basic validations */
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  if (!req.user) return res.status(404).json({ message: 'User not found.' });

  /** Check user existence */
  const [user] = await knex('user_master').select('*').where('id', '=', req.user.me);
  if (!user) return res.status(400).json({ message: 'User not found.' });
  if (user.is_confirmed) return res.status(400).json({ message: 'Email is already verified.' });

  /** Generate token and related template to send email verification. */
  const verificationToken = jwt.sign({ me: user.id, email: email, token_type: 'account-verification' }, process.env.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256', });
  const otp = otpGenerator.generate(6);

   /** Check email duplication and add email if does not exist. */
   if (!user?.user_email_id) {
    const users = await knex('user_master').select('*').where('user_email_id', '=', email);
    if (users.length) return res.status(400).json({ message: 'Email is already registered.' });
    await knex('user_master').update({ user_email_id: email, otp }).where('id', '=', user.id).returning('id');
  } else if (user.user_email_id !== email) return res.status(400).json({ message: 'Invalid email provided.' });
  else await knex('user_master').update({ otp }).where('id', '=', user.id).returning('id');

  const template = smtp.getTemplate('verify-email.html', { email, otp });

  /** Send email. */
  smtp.send(email, 'Email Verification', template);

  return res.status(200).json({ token: verificationToken, message: 'Email verification sent.' });
};
