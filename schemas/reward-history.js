const Yup = require('yup');

const schema = Yup.object({
  user_id: Yup.string().required(),
  reward_type: Yup.string().required(),
  transaction_type: Yup.string().required(),
  reward_point: Yup.string().required(),
  opening_balance: Yup.string().required(),
  closing_balance: Yup.string().required()
});

module.exports = schema;
