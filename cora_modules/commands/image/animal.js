const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageFlags } = require('discord.js');
const logger = require('../../providers/WinstonPlugin');
const { stripIndents } = require('common-tags');
const fetch = require('node-fetch');
//const yiff = require('yiff'); // Already handled by FurryBotAPI directly. May use to reduce number of modules required.
const FurryBotAPI = require('furrybotapi'); // Multiple categories are missing or return 404 errors. May replace with alternative module.
const furrybot = new FurryBotAPI();

module.exports = class FurryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'animal',
            group: 'image',
            memberName: 'animal',
            description: 'Some fun furry images using FurryBotAPI.',
            details: ` (Highly WIP, may change later due to the API being used has limitations at this time)
            This command provides a bunch of cute and adorable animal images powered by the FurryBotAPI.
            From our feathered birds, cute bleps, ~~to the wild animals such as foxes, cheetas, wolves and lynxes~~. 
            > NB: The following endpoints cheeta, wolf, fox and lynx options do not work and __WILL__ throw an error in the console!
            > This is due to missing categories on the API which cannot be fixed so will be replaced once a solution is found.
            Service provided by DonovanDMC (https://github.com/FurryBotCo/FurryBotAPI)`,
            examples: ['animal <option>'],
            args: [
                {
                    key: 'option',
                    prompt: 'animal.command.prompt.option',
                    default: '',
                    type: 'string'
                }
            ]
        });
    }
    async run(message, args) {
        const { option } = args;

        // Embed Function Handler to format output of furry image command.
        function imgEmbed (client, res, title, desc) {
            let artists, sources;
            // FurryBotAPI sometimes gives empty responses for some values, check first before parsing in embed.
            if (res.artists != '') {
                artists = res.artists;
            } else {
                artists = "N/A";
                //logger.debug(`artists = ${artists}`);
            }
            if (res.sources != '') {
                sources = res.sources;
                //logger.debug(`sources = ${sources}`);
            } else {
                sources = "N/A";
            }
            let report = res.reportURL;
            const imageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .setDescription(desc)
                .addFields(
                    {name:'Artists', value:artists},
                    {name:'Sources', value:sources},
                    {name:'Report Content', value:`Is this inappropriate content? Report it at ${report}`}
                )
                .setThumbnail(client.user.avatarURL({format:"png"}))
                .setImage(res.url)
                .setFooter('Bot created and maintained by NovaLynxie. Image provided by FurryBotAPI.', client.user.avatarURL({format:"png"}))
            return message.channel.send(imageEmbed); // Sends the image embed to the channel the user ran the command.
        }
        // animal command option handler. (MAY REWRITE OPTION CALLS IF API MODULE IS CHANGED!)
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
        } if (option === 'bird'|| option === 'birb') {
            logger.debug(`opthandler -> option=bird/birb`)
            furrybot.animals.birb("json", 1)
                .then(res => {
                    let title = 'Birds! >w<';
                    let desc = `Feathered friends and some rather interesting ones.`;
                    imgEmbed(this.client, res, title, desc);
                })
            return;
        } if (option === 'blep') {
            logger.debug(`opthandler -> option=blep`)
            furrybot.animals.blep("json", 1)
                .then(res => {
                    let title = 'Blep! >w<';
                    let desc = `Hehe, cute animal bleps x3`;
                    imgEmbed(this.client, res, title, desc);
                })
            return;
        } if (option === 'cheeta') {
            logger.debug(`opthandler -> option=cheeta`)
            furrybot.animals.cheeta("json", 1)
                .then(res => {
                    let title = 'Cheetas';
                    let desc = `Fastest runners of the animal kingdom... or are they?`;
                    imgEmbed(this.client, res, title, desc);
                }).catch(err => {
                    logger.error(err)
                    return message.reply('an error occured. Please alert my owner immediately.')
                })
            return;
        } if (option === 'fox') {
            logger.debug(`opthandler -> option=fox`)
            furrybot.animals.fox("json", 1)
                .then(res => {
                    let title = 'Foxes! >w<';
                    let desc = `They're soo adorable! I could squish their cute faces!`;
                    imgEmbed(this.client, res, title, desc);
                }).catch(err => {
                    logger.error(err)
                    return message.reply('an error occured. Please alert my owner immediately.')
                })
            return;
        } if (option === 'lynx') {
            logger.debug(`opthandler -> option=lynx`)
            furrybot.animals.lynx("json", 1)
                .then(res => {
                    let title = 'Lynxes';
                    let desc = `Quite floofy felines, one of the wild cats.`;
                    imgEmbed(this.client, res, title, desc);
                }).catch(err => {
                    logger.error(err)
                    return message.reply('an error occured. Please alert my owner immediately.')
                })
            return;
        } if (option === 'wolf') {
            logger.debug(`opthandler -> option=wolf`)
            furrybot.animals.wolf("json", 1)
                .then(res => {
                    let title = 'Wolves';
                    let desc = `Awooo! I see some wolves.`;
                    imgEmbed(this.client, res, title, desc);
                }).catch(err => {
                    logger.error(err)
                    return message.reply('an error occured. Please alert my owner immediately.')
                })
            return;
        } else {
            message.reply(stripIndents`
            I could not find that subcommand in this command's database.
            Please check your command input and try again.
            *Use \`p help animal\` for help with this command.*`)
        }
    }
};