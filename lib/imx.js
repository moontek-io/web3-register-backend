const { ethers, Wallet } = require('ethers');
const { ImmutableXClient } = require('@imtbl/imx-sdk');

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.s
 * @param privateKey - Ethereum wallet private key
 * @param gasLimit - maximum amount of Gas that a user is willing to pay for performing this action or confirming a transaction (a minimum of 21,000)
 * @param gasPrice - price of Gas (Gas Price) is the amount of Gwei that the user is willing to spend on each unit of Gas
 */
async function getClient(network, privateKey, gasLimit, gasPrice) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
  const signer = privateKey ? new Wallet(privateKey).connect(provider) : undefined;
  return await ImmutableXClient.build({
    publicApiUrl: network == 'mainnet' ? process.env.MAINNET_ENV_URL : process.env.ROPSTEN_ENV_URL,
    signer,
    starkContractAddress:
      network == 'mainnet'
        ? process.env.MAINNET_STARK_CONTRACT_ADDRESS
        : process.env.ROPSTEN_STARK_CONTRACT_ADDRESS,
    registrationContractAddress:
      network == 'mainnet'
        ? process.env.MAINNET_REGISTRATION_CONTRACT_ADDRESS
        : process.env.ROPSTEN_REGISTRATION_CONTRACT_ADDRESS,
    gasLimit: gasLimit ? gasLimit : undefined,
    gasPrice: gasPrice ? gasPrice : undefined,
  });
}

module.exports = {
  getClient,
};
