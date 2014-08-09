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

module.exports = router;