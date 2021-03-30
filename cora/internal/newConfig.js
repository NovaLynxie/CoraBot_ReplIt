const fs = require('fs');

// Config Template (DO NOT EDIT!)
const cfgTemplate = `
# CoraBot Configuration file.

[general]
# Bot general settings.
# Set the bot's prefix for commands and other options here.
prefix = "PREFIX_HERE"
# Bot Modules. To enable them, change from false to true.
# Developer only setting! Use this only for debugging the config file.
debug = false

[images]
# Image modules settings.
# Client name is used for identifying the bot when using modules with web requests.
# If left blank, the bot will try to use a temporary client name for the current session.
# This is not recommended as requests from this bot instance may get blocked in future.
clientName = "corabot-discord"
# API Key for usage with the yiffy module in api calls to yiff.rest for furry command. Required for request calls to Yiffy's API.
# Get your API key from https://yiff.rest/support and run the command '/apikey create' in their discord support server.
yiffyApiKey = "API_KEY_HERE"

[autoModerator]
# Auto moderation settings.
enableAutoMod = "no"
# Whether to use channelsList as whitelist or blacklist.
whitelistMode = "whitelist"
# Channels to observe in the mode selected.
# This only accepts channel IDs, NOT channel names. Using channel name will not work, it will be ignored.
# To get the channel's ID, enable 'Developer Mode' in User Settings -> Appearance -> Advanced.
channelsList = []
# URL domains to check when removing messages.
urlBlacklist = []
# URL domains to ignore when removing messages.
urlWhitelist = []

  [autoModerator.mediaOptions]
  # These tell which types of media the auto moderator should look for.
  # Set 'yes' (do check) or 'no' (don't check)
  removeGifs = "no"
  removeVids = "no"
  removeImgs = "no"
  removeURLs = "no"
  # Note: removeVids and removeImgs are very experimental.
  # Please use them with caution as they are currently WIP.

[dashboard]
# Enable the bot's web dashboard interface here. (WIP)
enableDashboard = false
# This is the port your bot's dashboard will connect to. Default port is '3000'.
port = 3000
`; // Config Template (DO NOT EDIT!)
fs.writeFile('./config.toml', cfgTemplate, { flag: 'wx' }, function (err) {
    if (err) {
      console.log('Bot config already exists!')
      return console.error(err);
      };
    // Respond with this in console
    console.log("Generated new config as config.toml!");
});