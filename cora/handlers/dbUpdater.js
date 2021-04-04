const logger = require('../providers/WinstonPlugin');
const ReplitDB = require("@replit/database");
const SQLiteDB = require('better-sqlite3');
const {database} = require('../handlers/bootLoader');
const {storage, settings} = database;

let db;
if (storage === "replit") {
  db = new ReplitDB();
} else
if (storage === "sqlite" ) {
  db = new SQLiteDB('./data/websrv.sqlite');
};

function sqlitedbUpdate(uptime, guilds, members, allch, txtch, vch) {
  const table = db.prepare("SELECT data(*) FROM sqlite_master WHERE type='table' AND name = 'webdata';").get();
  if (!table['data(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    db.prepare("CREATE TABLE webdata (id TEXT PRIMARY KEY, uptime INTEGER, guilds INTEGER, members INTEGER, allch INTEGER, txtch INTEGER, vch INTEGER);").run();
  }

  // And then we have two prepared statements to get and set the score data.
  client.getScore = db.prepare("SELECT * FROM webdata WHERE uptime = ?")
  client.setScore = db.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
}; 

function replitdbUpdate(uptime, guilds, members, allch, txtch, vch) {
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
    replitdbUpdate(totalUptime, totalGuilds, totalMembers, allChannels, textChannels, voiceChannels);
  } else 
  if (storage === 'sqlite') {
    // update using sqlite if storage method is sqlite
    sqlitedbUpdate(totalUptime, totalGuilds, totalMembers, allChannels, textChannels, voiceChannels);
  }
  
  replitdbUpdate(uptime, guilds, members, allch, txtch, vch)
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