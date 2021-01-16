// ================= LOGGING MODULE ===================
const logger = require('./cora_modules/providers/WinstonPlugin');
// ================= WEB-RES SERVER ===================
// Simple resolver server for status responses only.
/*
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('CoraBot: Response 200 - ONLINE!')
});
app.listen(port, () => logger.info(`CoraBot app listening to http://localhost:${port}`));
*/
// ================= BOTDASH SERVER ===================
// Dashboard interface for the discord bot. (WIP)
require('./cora_modules/dashboard/server'); 
// May use alternative options if problems arise.
// ================= START BOT CODE ===================
const { CommandoClient, /*SQLiteProvider*/ } = require('discord.js-commando');
const { Structures } = require('discord.js');
// ------------------- Bot's Modules ------------------
// Requiring bot's own modules here for usage.
logger.info('Loading additional bot function modules...')
const crashReporter = require('./cora_modules/handlers/crashReporter.js');
logger.debug('Loaded crashReporter functions from crashReporter.js');
const autoRespond = require('./cora_modules/handlers/autoRespond.js');
logger.debug('Loaded autoRespond functions from autoRespond.js');
// ------------------- Bot's Modules ------------------

// Boot.js used to handle bot startup and config loader.
const {config, dashboard} = require('./boot.js');
const {prefix, debug, botToken, ownerID, activities} = config;
const path = require('path'); // Loads path library for code file to use file directories.

// Load up the module for the dashboard.
const Dashboard = require("discord-bot-dashboard"); 
// Dashboard using development branch version as current npm version is broken at this time. May break unexpectedly!

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

/* DEPRECIATED! Use new dashboard loader.
const dashboard = new Dashboard(client, {
    port: 4000,
    clientSecret: process.env.clsecret,
    redirectURI: "https://CoraBotReplIt.mackynova.repl.co/auth/discord/callback"
    //redirectURI: "http://localhost:4000/auth/discord/callback"
});
*/

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Admin'],
        ['core', 'Core'],
        //['econ', 'Economy'], // Disabled - Missing storage method.
        ['image','Images'],
        ['info', 'Information'],
        ['misc', 'Miscellaneous'],
        //['music', 'Music'], // Disabled - Not available in this version.
        //['social', 'Social'], // Disabled - Does not have any commands.
        ['support', 'Support'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        unknownCommand: false,
        help: false,
    })
    .registerCommandsIn(
        path.join(__dirname, './cora_modules/commands')
    );

client.once('ready', () => {
    logger.info(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('with Commando');
});

client.on('ready', () => {
  
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities.length - 1) + 1);
    if (index >= 0 && index <= 1) {
      var statusType = 1 // 1 - Playing
    };
    if (index >= 2 && index <= 3) {
      var statusType = 2 // 2 - Listening
    };
    if (index >= 4 && index <= 5) {
      var statusType = 3 // 3 - Watching
    };
    client.user.setActivity(activities[index], {type: statusType});
  }, 300000);
})

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
        //console.log(`[Cora] Role ${removedRoles.map(r=>r.name)} removed from ${oldMember.displayName}.`)
        logger.info(`Role ${removedRoles.map(r=>r.name)} removed from ${oldMember.displayName}.`)
    };
    const addedRoles = newMember.roles.cache.filter(role=>!oldMember.roles.cache.has(role.id));
    if (addedRoles.size > 0) {
        //console.log(`[Cora] Role ${addedRoles.map(r=>r.name)} added to ${oldMember.displayName}.`)
        logger.info(`Role ${addedRoles.map(r=>r.name)} added to ${oldMember.displayName}.`)
    };
});
client.on('message', (message) => {
    if (message.author.bot) {
        logger.debug('Author is bot user. Ignoring messages sent by bot.')
        return;
    }
    if (message.content.includes(prefix)) {
        logger.debug('Prefix detected! Ignoring as command request.')
        return;
    }
    autoRespond(message);
});
client.on('error', error => {
    //console.error('[Error]', error)
    logger.error('Exception thrown by Bot Client!')
    logger.error(error.stack)
});

logger.info(`Connecting to Discord...`);
client.login(botToken).catch(err => {
    logger.error('Bot token is INVALID! Login aborted.')
    logger.error('Please check the bot token in config vars and restart the bot.')
    logger.error(err);

});

//module.exports = {client};