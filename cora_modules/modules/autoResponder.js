const logger = require('../providers/WinstonPlugin');
//const { responses } = require('../assets/json/responses.json');
const {responses} = require('../handlers/bootLoader');

function autoRespond(message) {
    logger.debug(`typeof responses: ${typeof responses}`)
    logger.debug(`loaded ${Object.keys(responses).length} responses`)
    let input = message.content; // gets message content and stores as input variable for easy execution.
    logger.debug(`message.content => ${input}`)
    input = input.toLowerCase(); // inputs must be in lowercase to parse correctly.
    let output = responses[input]
    if (output == undefined) {
        logger.debug(`output returned as undefined! ignoring message.`)
        return;
    } 
    logger.debug(`typeof ${typeof output} => output=${output}`)
    return message.channel.send(output);
}