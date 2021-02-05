const fs = require('fs');
const logger = require('../providers/WinstonPlugin');
// Sets time and date of the crash report file as logstamp.
function timeStamp (date) { 
  var hrs, mins, secs, logtime, day, month, year, logdate, logstamp;
  // Get current time as hours.mins.secs and put into logtime
  hrs = date.getUTCHours();
  if (hrs <= 9) hrs = `0${hrs}`
  mins = date.getUTCMinutes();
  if (mins <= 9) mins = `0${mins}`
  secs = date.getUTCSeconds();
  if (secs <= 9) secs = `0${secs}`
  logtime = `${hrs}.${mins}.${secs}`
  // Get current date as day-month-year and put into logdate
  day = date.getUTCDate();
  month = date.getUTCMonth() + 1; // Adds one to get actual month.
  year = date.getUTCFullYear();
  logdate = `${day}-${month}-${year}`
  // Now combine both logtime and logdate to get full logstamp.
  return logstamp = `${logdate}_${logtime}`;
}
module.exports = function crashReporter (error) {
  let date = new Date();
  let logstamp = timeStamp(date);
  let filepath = `./logs/crash-reports/crash-${logstamp}.txt`
  let crashdata = `Exception thrown! Log saved to ${filepath}. 
    Caused by: ${error.stack}`
  
  fs.writeFile(filepath, crashdata, function(error) {
    logger.error(`Something went wrong while writing crash report!`)
    logger.error(`Caused by: ${error}`)
    logger.warn(`Error details may have been lost, check console.`)
  })
  logger.error(`Exception thrown! Log saved to ${filepath}.`)
}