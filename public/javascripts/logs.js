var winston = require('winston');

//Mongo DB connection for winston logs

var MongoDB =require('winston-mongodb').MongoDB;

//define logging levels

var loggingLevels = {
  levels: {
    info: 0,
    warning: 1, 
    err: 2,
    critical: 3
  },
  colors: {
    info: 'blue',
    warning: 'yellow',
    err: 'red',
    critical: 'orange'
  }

};

winston.addColors(loggingLevels.colors);

//Initiate own version of winston logger
var logger = new (winston.Logger)
({ 
  levels: 
  (loggingLevels.levels),
  transports: [
  new (winston.transports.Console)(),
  //new (winston.transports.File)({ filename: 'test.log'}),
  new (winston.transports.MongoDB)(
    {dbUri: 'mongodb://admin:Cryogenic@oceanic.mongohq.com:10003/jcu-cryo'})
  ]
})

//Test logging Levels

logger.log('info', 'Logger Active');
//logger.log('warning', 'warning test');
//logger.log('err', 'error test');
//logger.log('critical', 'critical test');

var logThis = function(level, message){
  this.level = level;
  this.message = message;
  logger.log(level, message);
};

module.exports.logThis = logThis;