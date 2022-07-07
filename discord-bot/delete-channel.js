module.exports = async function (member) {
    try {
        member.guild.channels.cache.forEach((channel) => {
            if (channel.name !== 'unlock-channel') return false;
            if (channel.permissionOverwrites.cache.size <= 2) channel.delete('making room for new channels');
        });
    } catch (error) {
        console.log('error while createChannel', error);
        return false
    }
}
