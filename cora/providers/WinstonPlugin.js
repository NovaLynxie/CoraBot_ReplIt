require('dotenv').config() // load .env as early as possible
const winston = require('winston');
//require('winston-daily-rotate-file'); // does not work, disabled.
const {addColors, createLogger, format, transports} = winston
const {combine, colorize, errors, json, timestamp, printf} = format;
var {logLevel} = process.env; // gets logLevel from os process.env vars
if (!logLevel||logLevel==undefined) {
  // if not defined then set as 'error' by default.
  logLevel = 'error';
}

// Logging Levels
const customLevels = {
  levels: {
    //silly: 0, 
    info: 0,
    data: 1,
    warn: 2,
    error: 3,
    debug: 4,
    verbose: 5,
  },
  colors: {
    //silly: 'grey',
    info: 'green',
    data: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'blue',
    verbose: 'magenta'
  }
};

addColors(customLevels.colors);

const logger = createLogger({
  levels: customLevels.levels,
    format: combine(
      timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
      printf(info => `(${info.timestamp}) [${info.level}] ${info.message}`),
      errors({stack: true}),
  ),
  transports: [
    // Console transport created here.
    new transports.Console({
      level: logLevel,
      format: combine(
        colorize(),
        errors({stack: true,}),
        timestamp({format: 'HH:mm:ss'}),
        printf(info => `(${info.timestamp}) [${info.level}] ${info.message}`),
      ),
      handleExceptions: true
    })
  ],
});

module.exports = logger;