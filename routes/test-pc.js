var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var historyLength = 10; // mins

/* GET: for debug only. */
router.get('/', function(req, res) {
  query = req.query;
  console.log(query);
  res.send(400);
});

/* PUT: new data for DB. */
router.put('/', function(req, res) {
  var currentTempModel = mongoose.model('currentTemp');
  query = req.query ? req.body : req.query;

  // Update DB
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

    // clear old from DB
    currentTempModel.find({}, function(err, docs) {
      var latest = Date.parse(_.max(docs, function(doc) { return Date.parse(doc.time); }).time);
      var oldDocs = docs.filter(function(doc) { return Date.parse(doc.time) < latest - new Date(historyLength*60*1000); });
      for (var i = oldDocs.length - 1; i >= 0; i--) {
        oldDocs[i].remove();
      };
    });
  } else {
    res.send(400);
  }
});

module.exports = router;