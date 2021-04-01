const logger = require('../providers/WinstonPlugin');
const ReplDatabase = require("@replit/database");
const db = new ReplDatabase();
const {database} = require('../handlers/bootLoader');
const {storage, settings} = database;

let db;
if (storage = "repl") {
  db = new ReplDatabase();
}

function repldbUpdate(uptime, guilds, members, allch, txtch, vch) {
  // repldb updater
  logger.debug('ran task update_repl_database')
  logger.verbose(`assigning uptime as ${uptime}`);
  await db.set("uptime", uptime);
  logger.verbose(`assigning guilds as ${guilds}`);
  await db.set("guilds", guilds);
  logger.verbose(`assigning users as ${members}`);
  await db.set("members", members);
  logger.verbose(`assigning channels as ${allch}`);
  await db.set("allChannels", allch);
  logger.verbose(`assigning channels as ${txtch}`);
  await db.set("textChannels", txtch);
  logger.verbose(`assigning channels as ${vch}`);
  await db.set("voiceChannels", vch);
};

function sqlitedbUpdate() {

};

module.exports = async function updateDB(client) {
  let botUptime = (client.uptime / 1000);
  let totalGuilds = client.guilds.cache.size;
  let totalMembers = client.users.cache.size;
  let allChannels = client.channels.cache.filter(ch=>ch.type!=='category').size;
  let voiceChannels = client.channels.cache.filter(ch=>ch.type==='voice').size;
  let textChannels = client.channels.cache.filter(ch=>ch.type==='text').size;
  // uptime parser
  let days = Math.floor(botUptime / 86400);
  botUptime %= 86400;
  let hours = Math.floor(botUptime / 3600);
  botUptime %= 3600;
  let minutes = Math.floor(botUptime / 60);
  //let seconds = Math.floor(botUptime % 60);
  let totalUptime = `${days}d ${hours}h ${minutes}m`;
  if (storage === 'repl') {
    // update using replit if storage method is repl
    repldbUpdate(totalUptime, totalGuilds, totalMembers, allChannels, textChannels, voiceChannels);
  } else 
  if (storage === 'sqlite') {
    // update using sqlite if storage method is sqlite
  }
  
  repldbUpdate(uptime, guilds, members, allch, txtch, vch)
  logger.debug('ran task update_repl_database')
  logger.verbose(`assigning uptime as ${totalUptime}`);
  await db.set("uptime", totalUptime);
  logger.verbose(`assigning guilds as ${totalGuilds}`);
  await db.set("guilds", totalGuilds);
  logger.verbose(`assigning channels as ${allChannels}`);
  await db.set("allChannels", allChannels);
  logger.verbose(`assigning users as ${totalMembers}`);
  await db.set("members", totalMembers);
  logger.verbose(`assigning channels as ${voiceChannels}`);
  await db.set("voiceChannels", voiceChannels);
  logger.verbose(`assigning channels as ${textChannels}`);
  await db.set("textChannels", textChannels);
  //logger.debug('completed successfully!');
}