var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('coolio'); // http status
  query = req.query;
  if (query.type == "status") {
  	sendStatus(query.data,res);
  } else {
  	res.send(400);
  }
});

var prevTemp = 300;

sendStatus = function(dataType, res) {
	if (typeof dataType == 'undefined') {
		return;
	}
	if (dataType=="T") {
		var currentTempModel = mongoose.model('currentTemp');
		currentTempModel.find({}, function(err, doc) {
			res.send(doc);
		});
	}
}

module.exports = router;