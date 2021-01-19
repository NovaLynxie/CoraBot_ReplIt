//const { channels } = require('../../config.json');
const { channels } = require('../handlers/bootLoader');

module.exports.functions = function autoMod(message) {
    console.debug("message.event_fire()")
    //AutoMod Module
    let channel = message.guild.channels.cache.get(message.channel.id)
    console.debug(channel.id + ' ' + typeof channel.id)
    //var channelID = parseInt(channel.id);
    if (channels.indexOf(channel.id)) {
        console.debug("channel found, searching...")
        if (message.author.bot) return console.debug('bot.message_ignore()')
            if (message.attachments.size > 0) {
                if (message.attachments.every(attachedIsImage)) {
                    message.delete();
                    return message.reply("you cannot post gifs here! Use another channel.")
                } else {
                console.info("Message not gif type. Ignoring.")
                if (message.attachments.every(attachedIsVideo)) {
                    message.delete();
                    return message.reply("you cannot post videos here! Use another channel.")
                }
            }
        }
        if (message.content.startsWith(`https://`) || message.content.startsWith(`http://`)) {
            console.debug("detected https_url, searching content")
            if (message.content.indexOf(`tenor.com/view/`)) {
                message.delete();
                return message.reply("those are not allowed here! Use the correct channel please.")
            }
            if (message.content.indexOf(`reactiongifs.com/r/`))
                message.delete();
                return message.reply("those are not allowed here! Use the correct channel please.")
        }
    }
};

function attachedIsImage(msgAttach) {
    var url = msgAttach.url;
    console.debug(url);
    // True if this url is a gif image.
    return url.indexOf("gif", url.length - "gif".length) !== -1;
}
function attachedIsVideo(msgAttach) {
    var url = msgAttach.url;
    console.debug(url);
    // True if this url is a video.
    return url.indexOf("mp4", url.length - "mp4".length) !== -1;
}
