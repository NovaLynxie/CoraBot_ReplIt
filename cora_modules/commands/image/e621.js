const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageFlags } = require('discord.js');
const logger = require('../../providers/WinstonPlugin');
const { stripIndents } = require('common-tags');
const fetch = require('node-fetch');
const yiff = require('yiff');
const { exxx } = require('../../../config.json');
const e6 = new yiff.e621(exxx);

module.exports = class FurryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'e621',
            aliases: ['e6'],
            group: 'image',
            memberName: 'e621',
            description: 'Gets images from e621 using your tags.',
            details: ` VERY WIP! MAY BREAK AT ANY TIME!
            This command allows users to get images from e621, just input your tags and it will search e621 for you
            *We are not responsible for the image results that come up from your tags, you have been warned.*.`,
            examples: ['e621 search <tags>'],
            args: [
                {
                    key: 'option',
                    prompt: 'e621.command.prompt.option',
                    default: '',
                    type: 'string'
                },
                {
                    key: 'tags',
                    prompt: 'e621.command.prompt.tags',
                    default: '',
                    type: 'string'
                }
            ]
        });
    }
    async run(message, args) {
        const { option, tags } = args;

        // Embed Function Handler to format output of furry image command.
        function imgEmbed (client, res, title, desc) {
            if (!message.channel.nsfw) {
                message.reply("woah there! You can only use those options in NSFW channels!")
                return;
            }
            let artist, sources;
            // FurryBotAPI sometimes gives empty responses for some values, check first before parsing in embed.
            if (res.tags.artist != '') {
                artist = res.tags.artist; // Artists are stored in 'tags' so use res.tags instead.
            } else {
                artist = "N/A";
            }
            if (res.sources != '') {
                sources = res.sources;
            } else {
                sources = "N/A";
            }
            const imageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title)
                .setDescription(desc)
                .addFields(
                    {name:'Page URL', value:res.page},
                    {name:'Artist', value:artist},
                    {name:'Sources', value:sources}
                )
                .setThumbnail(client.user.avatarURL({format:"png"}))
                .setImage(res.image)
                .setFooter('Bot created and maintained by NovaLynxie. Image provided by FurryBotAPI.', client.user.avatarURL({format:"png"}))
            return message.channel.send(imageEmbed); // Sends the image embed to the channel the user ran the command.
        }
        // furry command option handler.
        if (option === 'help') {
            const helpEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('You confused? Here ya go!')
                .setDescription(stripIndents`
                    Here are the subcommands for the \`furry\` command.
                    *NSFW Sub-commands will only work in nsfw marked channels*
                `)
                .addFields(
                    {name:'SFW Image Options', value:'\`hug, flop, boop, hold, cuddle\`'},
                    {name:'NSFW Image Options', value:'\`gay, lesbian, shemale\`'}
                )
                .setThumbnail(this.client.user.avatarURL({format:"png"}))
                .setFooter('Bot created and maintained by NovaLynxie. Image provided by FurryBotAPI.', this.client.user.avatarURL({format:"png"}))
            return message.channel.send(helpEmbed);
        } if (option === 'search') {
            e6.request(tags).then(res => {
                let title = 'e621 Image Handler v1.0';
                let desc = `You searched: ${tags}`;
                imgEmbed(this.client, res, title, desc);
            })
        } else {
            message.reply(stripIndents`
            I was unable to process your request
            Please check your tags and try again.
            *Use \`p help fur\` for help with this command.*`)
        }
    }
};