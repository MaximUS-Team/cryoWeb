var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('coolio'); // http status
  query = req.query;
  console.log(query);
  if (query.type == "status") {
  	res.send(getData(query.data));
  } else {
  	res.send(400);
  }
});

var prevTemp = 300;

getData = function(dataTypes) {
	if (typeof dataTypes == 'undefined') {
		return;
	}
	data = {};
	for (var i=0; i<dataTypes.length; i++) {
		if (dataTypes[i]=="T") {
			prevTemp += Math.random() - 0.5;
			data[dataTypes[i]] = prevTemp;
		}
	}
	return data;
}

module.exports = router;