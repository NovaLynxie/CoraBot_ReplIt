// ================== PROCESS.ENV =====================
require('dotenv').config() // load .env as early as possible
// ================= LOGGING MODULE ===================
const logger = require('./cora/providers/WinstonPlugin');
const {version} = require('./package.json');
logger.info(`CoraBot v${version}`)
// ================= START BOT CODE ===================
const { CommandoClient, /*SQLiteProvider*/ } = require('discord.js-commando');
const { Structures } = require('discord.js');
// ------------------- Bot's Modules ------------------
const fs = require('fs');
// Requiring bot's own modules here for usage.
logger.info('Initialising bot systems...')
// Boot.js used to handle bot startup and config loader.
const {config, assets} = require('./cora/handlers/bootLoader.js');
const {activities} = assets;
const {prefix, debug, botToken, ownerID} = config
// Load bot handlers here before bot starts.
logger.info('Connecting modules to main core...');
const crashReporter = require('./cora/handlers/crashReporter.js');
logger.debug('Loaded crashReporter functions from crashReporter.js');
const autoRespond = require('./cora/modules/autoResponder.js');
logger.debug('Loaded autoRespond functions from autoResponder.js');
const autoModerator = require('./cora/modules/autoModerator.js');
logger.debug('Loaded autoModerator functions from autoModerator.js')
logger.info('Modules connected and initialized!')
// ------------------- Bot's Modules ------------------
require('./cora/dashboard/dashsrv'); // spin up built-in server
//const Dashboard = require("discord-bot-dashboard"); //Currently unused.
const path = require('path'); // Loads path library for code file to use file directories.

Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        constructor(bot, data){
            super(bot, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                radioDispatcher: null,
                volume: 1
            };
        }
    }
    return MusicGuild;
});

const client = new CommandoClient({
    commandPrefix: prefix,
    owner: ownerID,
    invite: '',
});
const eventFiles = fs.readdirSync('./cora/events').filter(file => file.endsWith('.js'));

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['admin', 'Admin'],
    ['core', 'Core'],
    //['econ', 'Economy'], // Disabled - Missing storage method.
    ['image','Images'],
    ['info', 'Information'],
    ['misc', 'Miscellaneous'],
    ['music', 'Music'], // Experimental! - May have some unexpected errors.
    //['social', 'Social'], // Disabled - Does not have any commands.
    ['support', 'Support'],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
      unknownCommand: false,
      help: false,
  })
  .registerCommandsIn(
      path.join(__dirname, './cora/commands')
      //path.join(__dirname, './cora_modules/commands')
  );

for (const file of eventFiles) {
	const event = require(`./cora/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

process.on('unhandledRejection', error => {
    //console.log(`Uncaught Promise Rejection Detected! ${error}`)
    logger.warn(`Uncaught Promise Rejection Exception thrown!`)
    logger.error(`Caused by: ${error}`)
    if (debug == true) {
      logger.debug(error.stack)
    }
});
process.on('uncaughtException', error => {
    crashReporter(error);
    logger.error(`Bot crashed! Check the logs directory for crash report!`); // Error thrown and logged to console window.
});


client.on('guildMemberUpdate', (oldMember, newMember) => {
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0) {
        logger.info(`Role ${removedRoles.map(r=>r.name)} removed from ${oldMember.displayName}.`)
    };
    const addedRoles = newMember.roles.cache.filter(role=>!oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        logger.info(`Role ${addedRoles.map(r=>r.name)} added to ${oldMember.displayName}.`)
    };
});

logger.info(`Connecting to Discord...`);
client.login(botToken).then(
  logger.info(`Waiting for ready event...`)
).catch(err => {
    logger.error('Bot token is INVALID! Login aborted.')
    logger.error('Please check the bot token in config vars and restart the bot.')
    logger.error(err);
});