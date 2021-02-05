const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents } = require('common-tags');
const mcsutil = require('minecraft-server-util');
const logger = require('../../providers/WinstonPlugin');

module.exports = class MCSrvInfoCommand extends Command {
  constructor(client) {
    super(client, {
        name: 'mcinfo', //May conflict with built-in if enabled. 
        aliases: ['mc','mcserver'],
        group: 'info',
        memberName: 'mcinfo',
        description: 'Displays information about a minecraft server from its IP and PORT.',
        details: stripIndents`
          Displays basic information about a minecraft server from provided server ip and port. 
          This command supports requests to **java edition** servers **only**!
          Any requests to other servers from bedrock, mcpe, or unsupported editions **will fail**.`,
        guildOnly: false,
        args: [
          {
            key: 'ip',
            prompt: 'mcinfo.command.prompt_message.ip',
            type: 'string'
            /*validate: ip => { // HOST IP Checks (WIP)
              ip.match(/[0-9a-zA-z.][^!<>]gi/)
            }*/
          },
          {
            key: 'port',
            prompt: 'mcinfo.command.prompt_message.port',
            type: 'integer',
            default: 25565 // defaults to 25565 if none is provided
          },
        ]
    });
  }
  async run(message, {ip, port}) {
    logger.debug(`ip=${ip}; port=${port};`);
    function hostValidator(ip) {
      if (ip == 'localhost') {
        logger.warn('Ignoring localhost as this would send request to local network of bot and most likely fail.');
        message.reply(`I can't accept localhost requests! That would send those requests into my host's mainframe!`);
        return;
      }
    }
    async function b64ToFile(b64data) {
      logger.debug('Parsing base64 string into file.')
      let b64str = b64data.split(';base64,').pop()
      fs.writeFile('./cora/cache/mcsrvutil/mcsrvlogo.png', b64str, {encoding:'base64'}, function(err) {
        if (err) return logger.error(err)
        logger.debug('Successfully wrote data to file!')
      })
    }
    try {
      mcsutil.status(ip, {port:port ? port : 25565}).then(async (res) => {
        logger.debug(`Recieving data from mc.status() into 'res'`);
        let motd = res.description.descriptionText.replace(/\u00A7[0-9A-FK-OR]/ig,'')
        const mcEmbed = new MessageEmbed()
          .setColor('#926F4F')
          .setTitle('Minecraft Server Information')
          .addFields(
            {name:'Server IP', value: res.host, inline:true},
            {name:'Server Port', value: res.port, inline:true},
            {name:'Players Online/Maximum', value: `${res.onlinePlayers}/${res.maxPlayers}`, inline:true},
            {name:'Server Description', value: motd}
          )
          .setFooter('Powered by Minecraft Server Util.')
        //message.channel.send({files: [mcImg], embed: mcEmbed});
        message.channel.send(mcEmbed);
      }).catch ((err) => {
        const errEmbed = new MessageEmbed()
          .setColor('#926F4F')
          .setTitle('Minecraft Server Information')
          .setDescription(stripIndents`
            Hmm... well this is awkward... :sweat:
            The requested server ip address did not return any valid response, the request timed out or an error occured while processing the request.
            Possible Causes:
            > 1. It might be offline, server ip is invalid or the request has timed out.
            > 2. An error occured while processing the data to the embed.
            If the server ip you entered is valid and server is responding, contact my owner for help.`)
          .setFooter('Powered by Minecraft Server Util.')
        message.channel.send(errEmbed);
        if (err) {
          logger.error('An error occured while processing the request!')
          logger.error(err);
          logger.debug(err.stack);
          logger.warn('Any incoming data may have been discarded.')
        }
      });
    } catch (error) {
      logger.error('Error occured while processing request!');
      logger.error(error ? !undefined : 'Unknown error.');
      logger.warn('All incoming promise responses may have been discarded.');
      message.channel.send('An error occured while processing your request. Please try again.')
    };
  }
}