const jwt = require('jsonwebtoken');

module.exports = async function (channelId, member) {
    const token = jwt.sign(member.user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1d',
        algorithm: 'HS256',
    });
    const channel = member.guild.channels.cache.get(channelId);
    channel.send(`Click on the link to activate the account. ${process.env.DISCORD_REDIRECT_URL}/${token}`);
}
