const discordBot = require('./discord-bot');
const pino = require('./pino');

module.exports = {
  discordBot,
  pino,
  logger: pino,
};
