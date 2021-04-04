const {chatty} = require('../handlers/bootLoader.js');
const {Chatbot} = require('discord-chatbot');
const chatbot = new Chatbot({name: "Cora", gender: "Female"});
const {enableChatBot, chatChannels} = chatty;

module.exports = function chatty(message) {
    if (enableChatBot) {
        chatChannels.forEach(chatChannel => {
          if (chatChannel === message.channel.id) {
            chatbot.chat(message).then(res => {
              message.channnel.send(res);
            })
          }
        })
    }
}

