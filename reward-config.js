/**
 * * point to be credited to the user as they perform below actions.
 * 1. on_new_account: New user registers the platform
 * 2. on_email_verification: User verifies their email
 * 3. on_referral_signup: New user registers through referral code
 * 4. on_discord_connection: User connects to discord
 */
module.exports.credit = {
  on_new_account: 5,
  on_email_verification: 10,
  on_discord_connection: 5,
  on_referral_signup: 20,
};

/**
 * number of nft to be credited to the user as they perform redeem action.
 */

module.exports.redeemPointsConfig = {
  redeem_nft: 20,
};
