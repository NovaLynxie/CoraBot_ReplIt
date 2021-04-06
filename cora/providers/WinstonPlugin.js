require('dotenv').config() // load .env as early as possible
const winston = require('winston');
require('winston-daily-rotate-file'); //re-added for daily logs.
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
    warn: 1,
    error: 2,
    debug: 3,
    data: 4,
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
    }),
    new transports.DailyRotateFile({      
      filename: 'corabot-%DATE%.log',
      datePattern: 'DD-MM-YY',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '14d',
      level: 'debug'
    }),
    new transports.DailyRotateFile({
      filename: 'debug-%DATE%.log',
      datePattern: 'DD-MM-YY',
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '14d',
      level: 'debug'
    })
  ],
});

module.exports = logger;