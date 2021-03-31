const { MessageEmbed } = require('discord.js');
const logger = require('../providers/WinstonPlugin');
const { stripIndents } = require('common-tags');
const { autoLog } = require('../handlers/bootLoader'); 
const { 
  enableLogger, 
  logChannels, 
} = autoLog;

module.exports = function modLogger(action, message, client) {
	switch (action) {
    case 'ban':
      // log ban here.
      break;
    case 'kick':
      // log kick here.
      break;
  };
};