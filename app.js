var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

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
  new (winston.transports.File)({ filename: 'test.log'}),
  new (winston.transports.MongoDB)(
    { db: 'jcu-cryo', level: 'info', username: 'Jcu14.207@gmail.com', password: 'Cryogenic', port: '10003', host: 'mongodb://admin:Cryogenic@oceanic.mongohq.com:10003/jcu-cryo' })
  ]
})

//Test logging Levels

logger.log('info', 'info test.');
logger.log('warning', 'warning test');
logger.log('eror', 'error test');
logger.log('critical', 'critical test');

var routes = require('./routes/index');
var upload = require('./routes/upload');
var status = require('./routes/status');
var data = require('./routes/data');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json({limit: '500kb'}));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/upload', upload);
app.use('/status', status);
app.use('/data', data);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

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
  console.log(err);
  //console.log("Ben");
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
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



//winston.log('info', 'test 1!');
module.exports = app;
