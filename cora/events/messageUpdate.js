const dclogs = require('../modules/discordLogger');
const logger = require('../providers/WinstonPlugin');

module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage, client) {
		logger.verbose("event.messageDelete.trigger()")
    let event = 'messageUpdate', message = {oldMessage, newMessage};
    dclogs(event, message, client);
	},
};