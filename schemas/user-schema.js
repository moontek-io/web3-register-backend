const Yup = require('yup');

const schema = Yup.object({
  wallet_address: Yup.string().required(),
  eth_network: Yup.string().required(),
  imx_token: Yup.string().required()
});

module.exports = schema;
