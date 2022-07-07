# Web3 Register Backend

Backend Server for IMX project.

## Prerequisite
-  [GIT](https://git-scm.com/)
-  [NODE.JS >= 16](https://nodejs.org/en)
-  [DATABASE](https://www.postgresql.org)
-  [DISCORD](https://discord.com)
-  [METAMASK](https://metamask.io/)

## Getting Started

Clone the repository.
```bash
git clone #GIT URL#
```

Install dependencies

```bash
npm ci
```

Copy the template environment variables

```bash
cp .env.template .env
```

Optional: Run migrations & seed

```bash
npx knex migrate:latest
npx knex seed:run
```

Start the local server

```bash
npm run dev
```

### API Endpoints

You can import the endpoints to your local postman using the file ```/docs/IMX.postman_collection.json``` provided in this repository.  

### How to add discord link service?
- Get discord bot token (https://discord.com/developers/applications)
- Get Channel ID.
- Get the redirection URL. (needed to redirect the link sent by bot to the user in the discord channel)
- Store a,b,c to the environment as defined in .env.example.
- Check below environment variable
  - DISCORD_CHANNEL_ID ([HOW TO GET ?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-))
  - DISCORD_REDIRECT_URL 
    - Used to redirect user after clicking activation link send in discord channel.
    - For Example frontend discord activation page url.
  - DISCORD_BOT_TOKEN ([HOW TO GET ?](https://discord.com/developers/applications))
  - DISCORD_BOT_ID ([HOW TO GET ?](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-))

###  How to configure SMTP service?
- Set SMTP_USER, SMTP_PASS, SMTP_FROM in the environment as defined in .env.example.
- Configure or change settings in `function/smtp.js` file. (currently supported only gmail service.) https://nodemailer.com/smtp/
- Check below environment variable
    - SMTP_USER ( Email Id from which emails will be sent. )
    - SMTP_PASS ( Password for the `SMTP_USER` email )
    - SMTP_FROM ( Email id visible as from email in every mail )
- To change the template changes are needed in below files.
    - email-templates/verify-email.html

### How to configure your NFT?
- You need to create your NFT contract on the Ethereum network by [IMX Script](https://github.com/danekshea/imxscripts/blob/master/src/examples%20-%20WIP/end-to-end-mint.ts).
- After creating NFT contract, you get an address of the smart contract.
- Set ETH_NETWORK, ETH_PROVIDER_URL, SMART_CONTRACT_ADDRESS, OWNER_PRIVATE_KEY, TOKEN_BLUE_PRINT in environment as defined in .env.example.
- Mint NFT is started from tokenId 2 & incremented by 1 after each mint, so if you want to change please go to app_setting_master table and change setting_key 'token_id' to your custom number.
- Minted NFT visible on [Ropsten Network](https://market.ropsten.immutable.com/) and [Ethereum Mainnet Network](https://market.immutable.com/)

### How to set reward point & redeem point using ```reward-config.js``` file.

    /* number of points credited to user account when they get registered. */
    credit.on_new_account

    /* number of points credited to user account when they verify their email address. */
    credit.on_email_verification

    /* number of points credited to user account when they connect their discord account. */
    credit.on_discord_connection

    /* number of points credited to user account when some one get registered using their referral link. */
    credit.on_referral_signup

    /* minimum number of points required to redeem. */
    credit.redeem_nft

