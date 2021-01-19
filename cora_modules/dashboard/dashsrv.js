const express = require('express');
const app = express();
const logger = require('../providers/WinstonPlugin');

logger.info('Starting dashboard server...')

// Setup webserver configuration.
//app.set('view engine', 'pug')
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

const port = 3000;

app.listen(port, () => {
  logger.info(`Server connected to port ${port}`);
});
// Discord Login handlers (WIP) - Heavily in development.


// Web Server Routers - Define all paths here.

// Status Ping Responder
app.get('/ping', (req, res) => {
  res.send('Response 200 - Online!'); 
});

// Front Page - The main page to load directly.
app.get('/', (req, res) => {
  res.render('home.pug');
});

// Test Page - Used to test if module is working correctly.
app.get('/test', (req, res) => {
  res.render('test.pug');
});