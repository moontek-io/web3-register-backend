const crypto = require('crypto');
const { knex } = require('../db');
const config = require('./../reward-config');


function ReferralCode() { }

ReferralCode.prototype.generate = async function (length = 8) {
    let uniqueCode = null;

    while (!uniqueCode) {
        const code = crypto
            .randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
        const exist = await knex('user_master').count('id as count').where('referral_code', '=', code);
        if (exist[0].count == 0) uniqueCode = code;
    }

    return uniqueCode;
}

ReferralCode.prototype.creditRewardPoint = async function (user, reward_type, reward_point) {
    const payload = {
        user_id: user.id,
        reward_type: reward_type,
        transaction_type: 'credit',
        reward_point: reward_point,
        opening_balance: user.reward_point,
        closing_balance: user.reward_point + reward_point,
    }

    await Promise.all([
        knex('reward_history').insert(payload),
        knex('user_master').where({ id: user.id }).increment('reward_point', reward_point)
    ]);
}

ReferralCode.prototype.onCreateAccount = async function (user) {
    try {
        const reward_point = parseInt(config.credit?.on_new_account || 0);
        if (!reward_point || !user?.id) return false;
        await this.creditRewardPoint(user, 'create-account', reward_point);
    } catch (e) {
        console.error(e);
    }
}

ReferralCode.prototype.onEmailVerification = async function (user) {
    try {
        const reward_point = parseInt(config.credit?.on_email_verification || 0);
        if (!reward_point || !user.id) return false;
        await this.creditRewardPoint(user, 'email-verification', reward_point);
    } catch (e) {
        console.error(e);
    }
}

ReferralCode.prototype.onDiscordConnection = async function (user) {
    try {
        const reward_point = parseInt(config.credit?.on_discord_connection || 0);
        if (!reward_point || !user.id) return false;
        await this.creditRewardPoint(user, 'discord-connect', reward_point);
    } catch (e) {
        console.error(e);
    }
}

ReferralCode.prototype.onReferralSignup = async function (referred_user_id, referral_code) {
    try {
        const reward_point = parseInt(config.credit?.on_referral_signup || 0);
        if (!reward_point || !referral_code) return false;

        const user = await knex('user_master').first('*').where('referral_code', '=', referral_code);
        if (!user) return false;

        await this.creditRewardPoint(user, `referral-signup#${referred_user_id}`, reward_point);
    } catch (e) {
        console.error(e);
    }
}

ReferralCode.prototype.onRedeem = async function (user, mintTokenId) {

    const reward_point = parseInt(config?.redeemPointsConfig?.redeem_nft || 0);
    if (!reward_point || !user.id) return false;

    const payload = {
        user_id: user.id,
        reward_type: `claim-nft#${mintTokenId}`,
        transaction_type: 'debit',
        reward_point: reward_point,
        opening_balance: user.reward_point,
        closing_balance: user.reward_point - reward_point,
    }

    await Promise.all([
        knex('reward_history').insert(payload),
        knex('user_master').where({ id: user.id }).decrement('reward_point', reward_point)
    ]);
}

module.exports = new ReferralCode();