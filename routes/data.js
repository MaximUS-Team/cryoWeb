var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('coolio'); // http status
  query = req.query;
  if (query.type == "status") {
  	sendStatus(query.data,res);
  } else if (query.type == "current") {
  	sendCurrentTest(res);
  } else if (query.type == "log") {
  	sendLogs(res);
  } else if (query.type == "tempcontrol") {
  	sendTempControl(res)
  } else if (query.type == "command") {
  	sendCommand(res)
  } else {
  	res.send(400, 'No type specified. Did you mean type=status?');
  }
});

sendStatus = function(dataType, res) {
	if (typeof dataType == 'undefined') {
		res.send(400, 'No data specified.');
	} else if (dataType == "T") {
		var currentTempModel = mongoose.model('currentTemp');
		currentTempModel.find({}, function(err, docs) {
			res.send(docs);
		});
	} else if (dataType == "Snp") {
		var currentSnpModel = mongoose.model('currentSnp');
		currentSnpModel.find({}, function(err, docs) {
			res.send(docs);
		})
	}
}

sendCurrentTest = function(res) {
	var currentTestSettingsModel = mongoose.model('testSettings');
	currentTestSettingsModel.findOne({}, function(err, doc) {
		res.send(doc);
	})
}

sendTempControl = function(res) {
	var currentTestSettingsModel = mongoose.model('updateSettings');
	currentTestSettingsModel.findOneAndRemove({}, function(err, doc) {
		res.send(doc);
	})
}

sendCommand = function(res) {
	var currentTestSettingsModel = mongoose.model('serverCommand');
	currentTestSettingsModel.findOneAndRemove({}, function(err, doc) {
		res.send(doc);
	})
}

sendLogs = function(res) {
	var logsModel = mongoose.model('logs');
	logsModel.find({}).sort({timestamp: -1}).limit(10).exec('find', function(err, docs) {
		res.send(docs);
	});
}

module.exports = router;