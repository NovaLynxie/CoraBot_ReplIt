const botlogs = require('../modules/botLogger');
const logger = require('../providers/WinstonPlugin');

module.exports = {
	name: 'messageDelete',
	execute(message, client) {
    if (message.author.id === client.user.id) {
      logger.debug("ignored message, message author is bot.")
      return;
    };
    logger.verbose("event.messageDelete.trigger()")
    let event = 'messageDelete';
    botlogs(event, message, client);
	},
};