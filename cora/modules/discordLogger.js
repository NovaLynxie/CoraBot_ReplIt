const { MessageEmbed } = require('discord.js');
const logger = require('../providers/WinstonPlugin');
const { dcLogs } = require('../handlers/bootLoader');

function datetime() {
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  let year = date_ob.getFullYear();
  // current hours
  let hours = date_ob.getHours();
  // current minutes
  let minutes = date_ob.getMinutes();
  // current seconds
  let seconds = date_ob.getSeconds();
  // checks if seconds less than or equal to '9'
  if (seconds <= 9) {
    // formats seconds with 0 in front if true
    seconds = `0${seconds}`
  }
  var logdate = `${date}-${month}-${year}`
  var logtime = `${hours}:${minutes}:${seconds}`
  return logstamp = { logdate, logtime }
}

module.exports = function dcLogger() {
  this.client.on("messageDelete", function(message) {
    logger.info(`message was deleted -> ${message}`);
    var logEmbed = new MessageEmbed()
      .setTitle("Message Updated!")
      .setDesc("A message was updated in a channel.")
      .addFields(
        {
          name: "Old Message",
          value: oldMessage
        },
        {
          name: "New Message",
          value: newMessage
        }
      )
      .setColor(0x00AE86)
      .setTimestamp()
      .setFooter('Bot created and maintained by NovaLynxie. Image provided by CheweyBotAPI.', 
      this.client.user.displayAvatarURL({ format: 'png'}));
    message.channel.send(logEmbed);
  });
  this.client.on("messageUpdate", function(oldMessage, newMessage) {
    logger.info(`message was updated`)
    var logEmbed = new MessageEmbed()
      .setTitle("Message Updated!")
      .setDesc("A message was updated in a channel.")
      .addFields(
        {
          name: "Old Message",
          value: oldMessage
        },
        {
          name: "New Message",
          value: newMessage
        }
      )
      .setColor(0x00AE86)
      .setTimestamp()
      .setFooter('Bot created and maintained by NovaLynxie. Image provided by CheweyBotAPI.', 
      this.client.user.displayAvatarURL({ format: 'png'}));
    message.channel.send(logEmbed);
  });
}