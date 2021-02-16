const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageFlags } = require('discord.js');
const logger = require('../../providers/WinstonPlugin');
const { stripIndents } = require('common-tags');
const Animage = require('animage');

module.exports = class FurryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'animals',
            group: 'image',
            memberName: 'animals',
            description: 'Some cute animal images',
            examples: ['animals <option>'],
            args: [
                {
                    key: 'option',
                    prompt: 'animals.command.prompt.option',
                    default: '',
                    type: 'string'
                }
            ]
        });
    }
    async run(message, args) {
        const { option } = args;
        option=option.toLowerCase();
        // start of animal command option handler. 
        // animal command help
        if (option === 'help') {
            const helpEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('You confused? Here ya go!')
                .setDescription(stripIndents`
                    Here are the subcommands for the \`animal\` command.
                `)
                .addField(
                    {name:'Animal Options', value:'\`bird/birb, blep, cheeta, fox, lynx, wolf\`'}
                )
                .setThumbnail(this.client.user.avatarURL({format:"png"}))
                .setFooter('Bot created and maintained by NovaLynxie. Image provided by FurryBotAPI.', this.client.user.avatarURL({format:"png"}))
            return message.channel.send(helpEmbed);
        // animal options handler
        } if (option === 'dog') {
          logger.debug(`opthandler -> option=cat`)
          await animage.dog(message, true);
          return;
        } if (option === 'cat') {
          logger.debug(`opthandler -> option=${option}`)
          await animage.cat(message, true)
          return;
        } if (option === 'panda') {
          logger.debug(`opthandler -> option=${option}`)
          await animage.panda(message, true)
          return;
        } if (option === 'koala') {
          logger.debug(`opthandler -> option=${option}`)
          await animage.koala(message, true)
          return;
        } if (option === 'fox') {
          logger.debug(`opthandler -> option=${option}`)
          await animage.fox(message, true)
          return;
        } if (option === 'random') {
          logger.debug(`opthandler -> option=${option}`)
          await animage.random(message, true)
          return;
        } else {
            message.reply(stripIndents`
            I could not find that subcommand in this command's database.
            Please check your command input and try again.
            *Use \`p help animal\` for help with this command.*`)
        }
    }
};