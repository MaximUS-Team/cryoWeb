var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var winston = require('winston');

//Mongo DB connection for winston logs

 

winston.addColors(loggingLevels.colors);

//Initiate own version of winston logger
var logger = new (winston.Logger)
({ 
  levels: 
  (loggingLevels.levels),
  transports: [
  new (winston.transports.Console)(),
  new (winston.transports.File)({ filename: 'test.log'}),
  new (winston.transports.MongoDB)(
    {dbUri: 'mongodb://admin:Cryogenic@oceanic.mongohq.com:10003/jcu-cryo'})
  ]
})

//Test logging Levels

logger.log('info', 'info test.');
logger.log('warning', 'warning test');
//logger.log('err', 'error test');
//logger.log('critical', 'critical test');

function Log(level, message){
  this.level = level;
  this.message = message;
  //logger.log(level, message);
  console.log(info, message);
  return logger.log(info, message);

};


// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(
    'mongodb://admin:Cryogenic@oceanic.mongohq.com:10003/jcu-cryo',
    options);
}
connect()

// Error handler
mongoose.connection.on('error', function (err) {
  logger.log('ere', err);
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
})

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path + '/' + file)
})

// production error handler
// no stacktraces leaked to user
test.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = test;
