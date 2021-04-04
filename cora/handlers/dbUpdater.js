const logger = require('../providers/WinstonPlugin');
const ReplitDB = require("@replit/database");
const SQLiteDB = require('better-sqlite3');
const {database} = require('../handlers/bootLoader');
const {storage, settings} = database;

let db, runtime;
if (storage === "replit") {
  db = new ReplitDB();
} else
if (storage === "sqlite" ) {
  db = new SQLiteDB('./data/websrv.sqlite');
  initSqliteDB();
};

function initSqliteDB() {
  const table = db.prepare("SELECT data(*) FROM sqlite_master WHERE type='table' AND name = 'webdata';").get();
  if (!table['data(*)']) {
    // Create table if it does not exist.
    db.prepare("CREATE TABLE webdata (id TEXT PRIMARY KEY, uptime INTEGER, guilds INTEGER, members INTEGER, allch INTEGER, txtch INTEGER, vch INTEGER);").run();
  }
  // Generate prepare statements to get and set relevant data where needed.
  //runtime.getData = db.prepare("SELECT * FROM webdata WHERE uptime = ? AND members = ? AND guilds = ? AND allch = ? AND txtch = ? AND vch = ?")
  runtime.getData = db.prepare("SELECT * FROM webdata")
  runtime.setData = db.prepare("INSERT OR REPLACE INTO webdata (uptime, members, guilds, allch, txtch, vch) VALUES (@uptime, @members, @guilds, @allch, @txtch, @vch)")
  /*
  runtime.getUptime = db.prepare("SELECT * FROM webdata WHERE uptime = ?")
  runtime.setUptime = db.prepare("INSERT OR REPLACE INTO webdata (uptime) VALUES (@uptime);");
  runtime.getMembers = db.prepare("SELECT * FROM webdata WHERE members = ?")
  runtime.setMembers = db.prepare("INSERT OR REPLACE INTO webdata (members) VALUES (@members);");
  runtime.getGuilds = db.prepare("SELECT * FROM webdata WHERE guilds = ?")
  runtime.setGuilds = db.prepare("INSERT OR REPLACE INTO webdata (guilds) VALUES (@guilds);");
  runtime.getAllCh = db.prepare("SELECT * FROM webdata WHERE allch = ?")
  runtime.setAllCh = db.prepare("INSERT OR REPLACE INTO webdata (allch) VALUES (@allch);");
  runtime.getTxtCh = db.prepare("SELECT * FROM webdata WHERE txtch = ?")
  runtime.setTxtCh = db.prepare("INSERT OR REPLACE INTO webdata (txtch) VALUES (@txtch);");
  runtime.getVCh = db.prepare("SELECT * FROM webdata WHERE vch = ?")
  runtime.setVCh = db.prepare("INSERT OR REPLACE INTO webdata (vch) VALUES (@vch);");
  */
}

function sqlitedbUpdate(uptime, guilds, members, allch, txtch, vch) {
  let data = runtime.getData.get();
  if (!data) {
    data = {
      uptime: uptime,
      guilds: guilds,
      members: members,
      allch: allch,
      txtch: txhch,
      vch: vch
  }
  runtime.setData.run(score);
  //let data = runtime.getData.get(uptime, guilds, members, allch, txtch, vch)
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
  //logger.debug('completed successfully!');
}