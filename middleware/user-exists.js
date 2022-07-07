const { error } = require('../functions');
const { knex } = require('../db');

module.exports = async (req, res, next) => {
  const { email } = req.body;

  const identity = await knex('identities').first('*').where('email', '=', email);
  if (identity) {
    throw error(409, 'Account already exists');
  }

  next();
};
