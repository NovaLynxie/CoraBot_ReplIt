const dclogs = require('../modules/discordLogger');
const logger = require('../providers/WinstonPlugin');

module.exports = {
	name: 'messageDelete',
	execute(message, client) {
    logger.verbose("event.messageDelete.trigger()")
    let event = 'messageDelete';
    dclogs(event, message, client);
	},
};