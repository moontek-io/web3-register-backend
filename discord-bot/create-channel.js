/* eslint-disable no-console */
const { Permissions } = require('discord.js');

module.exports = async function (member) {
    try {
        let everyoneRole = member.guild.roles.cache.find(r => r.name === '@everyone');
        const channel = await member.guild.channels.create('unlock-channel', {
            type: 'GUILD_TEXT',
            reason: 'must be something',
            permissionOverwrites: [
                {
                    id: everyoneRole.id,
                    deny: [Permissions.ALL]
                },
                {
                    id: process.env.DISCORD_BOT_ID,
                    allow: [Permissions.ALL]
                },
                {
                    id: member.user.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY]
                },
            ],
        });
        return channel;
    } catch (error) {
        console.log('error while createChannel', error);
        return false
    }
}
