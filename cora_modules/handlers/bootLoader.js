// Main init handler for CoraBot.
// This is used to handle loading necessary configs before bot initialises.
// DO NOT MODIFY OR REMOVE THIS FILE OTHERWISE THE BOT WILL NOT START!!!
require('dotenv').config() // load .env as early as possible
const logger = require('../providers/WinstonPlugin');
const fs = require('fs');
// Config loader (TOML Localised File Handler)
const toml = require('toml'); // Enables parsing of *.toml files
const config = toml.parse(fs.readFileSync('./config.toml', function (err){
  logger.debug(`Error while reading file...`)
  logger.debug(err)
  logger.warn(`Is file missing or unreadable?`)
}));
// Load config data from config.toml file.
//const { discordbot, dashboard } = config; 
//global dashboard setting depreciated, moved to discordbot.dashboard
const { version } = require('../../package.json');
const { discordbot } = config;
const { general, automod, dashboard, images } = discordbot;
const { clientName, yiffyApiKey } = images;
const { enableAutoMod, whitelistedChannels} = automod;
const { prefix, debug } = general;
const { port } = dashboard; // Depreciated in favour of custom built-in dashboard.
logger.debug(`prefix = ${prefix} (${typeof prefix})`);
logger.debug(`debug = ${debug} (${typeof debug})`);
logger.debug(`enabled = null (null)`);
logger.debug(`port = ${port} (${typeof port})`);
logger.debug('Loaded config successfully!');
function randomID(min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
};
if (!clientName||clientName==undefined) {
  logger.warn(`Variable 'clientName' was undefined or not provided, it might not have been set correctly.`);
  logger.warn('This may cause bot commands using it to fail or requests blocked if not defined.');
  var tempID = randomID(1000,9999);
  clientName = `botUser${tempID}`;
  logger.warn('Attempting to use a temporary client name for this session, this is not recommended!');
}
logger.debug(`Set clientName as ${clientName} for this session.`);
// Configure image user agents. 
var eImg = { // Required to use e621 and e926 modules.
  "creator":"NovaLynxie", // The bot's creator
  "name": `${clientName}`, // User defined in configuration file
  "version":`${version}`  // Version of the bot defined in package.json
};
// Yiffy UserAgent for CoraBot. Required otherwise it will fail to work correctly.
const myUserAgent = `CoraBot/${version} (https://github.com/NovaLynxie/CoraBot_ReplIt)`
// Load bot secrets from process.env if this fails use config vars.
var { botToken, yiffyApiKey, ownerID } = process.env;
logger.debug('Loaded process environment variables!');
// Load bot assets from folders as necessary.
logger.info('Loading bot assets...')
const { activities } = require('../assets/json/activities.json');
logger.debug('Loaded activities from activities.json');
const { responses } = require('../assets/json/responses.json');
logger.debug('Loaded responses from responses.json');
// Load bot handlers here before bot starts.
logger.info('Loading bot modules...');
const crashReporter = require('../handlers/crashReporter.js');
logger.debug('Loaded crashReporter functions from crashReporter.js');
const autoRespond = require('../modules/autoResponder.js');
const { User } = require('discord.js');
logger.debug('Loaded autoRespond functions from autoResponder.js');

// Finally export all variables for the bot to access by requiring bootLoader.js
module.exports.botConfig = {prefix, debug, botToken, ownerID, eImg, myUserAgent, yiffyApiKey, version}; // bot config
module.exports.autoMod = {enableAutoMod, whitelistedChannels}; // bot automod
module.exports.assets = {activities, responses}; // bot asset data
module.exports.handlers = {crashReporter, autoRespond}; // bot handlers