const {assets} = require('../handlers/bootLoader');
const {activities} = assets;
const logger = require('../providers/WinstonPlugin');
const updateDB = require('../handlers/dbUpdater.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    // Announce when client is connected and ready.
    logger.info(`Logged in as ${client.user.tag}!`);
    logger.data(`Bot User ID: ${client.user.id}`);
    updateDB(client); // Updates database on startup.
    client.user.setActivity('with Commando');

    // Setup interval timers to update status and database.
    setInterval(async () => {    
      // status updater
      logger.verbose("ran task update_status")
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
      logger.verbose(`Updated status to activity ${index} of ${activities.length-1}`)
    }, 300000);
    setInterval(async () => {
      // repldb updater - updates values every minute.
      await updateDB(client);
    }, 60000);
  },
};