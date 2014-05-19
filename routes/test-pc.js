var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

/* GET users listing. */
router.get('/', function(req, res) {
  //res.send('coolio'); // http status
  query = req.query;
  console.log(query);
  if (query.address || query.port) {
  	res.send(200);
  } else {
  	res.send(400);
  }
});
router.put('/', function(req, res) {
  var currentTempModel = mongoose.model('currentTemp');
  query = req.query;
  if (query.time && query.T) {
    var current = new currentTempModel ({
      time: query.time,
      T: query.T
    });
    current.save(function(err) {
      if (err) {
        res.send(400);
        return console.log("Error saving to DB");
      } else {
        res.send(200);
      }
    });
    currentTempModel.find({}, function(err, doc) {
      var latest = 0;
      for (var i = doc.length - 1; i >= 0; i--) {
        dateTime = Date.parse(doc[i].time);
        if (dateTime > latest) {
          latest = dateTime;
        } else if (dateTime < latest - new Date(1000*60*10)) {
          doc[i].remove();
        }
      };
    });
  } else {
    res.send(400);
  }
});

module.exports = router;