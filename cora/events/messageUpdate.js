const botlogs = require('../modules/botLogger');
const logger = require('../providers/WinstonPlugin');

module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage, client) {
    logger.verbose("event.messageUpdate.trigger()");
    // check if author is bot and if content is the same, stop if it is.
    if (oldMessage.author.id === client.user.id) return;
    if (oldMessage.content === newMessage.content) return;
    let event = 'messageUpdate', message = {oldMessage, newMessage};
    botlogs(event, message, client);
	},
};