const express = require('express');
const app = express();
const logger = require('../providers/WinstonPlugin');
const Client = require("@replit/database");
const client = new Client();

var guilds, channels, members, allChannels, textChannels, voiceChannels;
(async () => {
  guilds = await client.get("guilds")
  members = await client.get("members")
  uptime = await client.get("uptime")
  allChannels = await client.get("allChannels")
  textChannels = await client.get("textChannels")
  voiceChannels = await client.get("voiceChannels")
  return guilds, channels, members, uptime;
})()

logger.info('Starting dashboard server...')

// Setup webserver configuration.
app.set('view engine', 'pug')
//app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

const port = 3000;

app.listen(port, () => {
  logger.info(`Server connected to port ${port}`);
});
// App Locals defined here
(async () => {
  app.locals.guilds = await client.get("guilds")
  app.locals.users = await client.get("members")
})//()
// Discord Login handlers (WIP) - Heavily in development.

// Web Server Routers - Define all paths here.

// Status Ping Responder
app.get('/ping', (req, res) => {
  res.send('Response 200 - Online!'); 
});

// All Pages for the web interface.
app.get('/', (req, res) => {
  res.render('home.pug', {
    users: members,
    channels: allChannels,
    guilds: guilds
  });
});
app.get('/about', (req, res) => {
  res.render('about.pug');
});
app.get('/status', (req, res) => {
  res.render('status.pug', {
    uptime: uptime,
    users: members,
    guilds: guilds,
    channels: allChannels,
    chText: textChannels,
    chVoice: voiceChannels,
  });
});
// Test Page - Used to test if module is working correctly.
app.get('/test', (req, res) => {
  res.render('test.pug');
});