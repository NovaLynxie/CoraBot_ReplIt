// Main init handler for CoraBot.
// This is used to handle loading necessary configs before bot initialises.
// DO NOT MODIFY OR REMOVE THIS FILE!
const logger = require('./cora_modules/providers/WinstonPlugin');
const fs = require('fs');
// Config loader (TOML Localised File Handler)
const toml = require('toml'); // Enables parsing of *.toml files
const config = toml.parse(fs.readFileSync('./config.toml', function (err){
  logger.debug(`Error while reading file...`)
  logger.debug(err)
  logger.warn(`Is file missing or unreadable?`)
}));
// Load config data from config.toml file.
const { discordbot, dashboard } = config;
const { prefix, debug } = discordbot;
const { port } = dashboard; // Depreciated in favour of custom built-in dashboard.
logger.debug(`prefix = ${prefix} (${typeof prefix})`);
logger.debug(`debug = ${debug} (${typeof debug})`);
logger.debug(`enabled = null (null)`);
logger.debug(`port = ${port} (${typeof port})`);
logger.debug('Loaded config successfully!')
// Load bot secrets from process.env
const { botToken, ownerID } = process.env;
logger.debug(`Loaded process environment variables!`);
//
const { activities } = require('./cora_modules/assets/json/activities.json');
logger.debug('Loaded activities from activities.json');

// Finally export all variables for other code to access by requiring boot.js
module.exports.config = {prefix, debug, botToken, ownerID, activities};
//module.exports = {prefix, debug, botToken, ownerID, activities, dashboard};