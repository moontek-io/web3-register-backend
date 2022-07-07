/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { Client, Intents } = require('discord.js');
const createChannel = require('./create-channel');
const welcomeMessage = require('./welcome-message');
const deleteChannel = require('./delete-channel');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
    // const guild = client.guilds.cache.get('976390656132005889');
});

client.on('guildMemberAdd', async member => {
    // console.log('member joined :: ',member.user);
    const channel = await createChannel(member);
    if (!channel) return false;
    await welcomeMessage(channel.id, member);
});


client.on('guildMemberRemove', async member => {
    // console.log('member leaved :: ',member.user);
    await deleteChannel(member);
});


client.on('message', (message) => {
    // console.log('message.author :: ',message);
    // if (message.type === 'GUILD_MEMBER_JOIN') createChannel(message);
})

module.exports.init = () => {
    client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => console.error('discord is offline', error));
}

/**
 * guild: id: '976390656132005889', name: 'imx',
 * category: id: '976434317523841085', name: '----- IMX ENTRANCE ---------',
 */