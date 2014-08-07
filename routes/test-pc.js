var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var historyLength = 10; // mins

/* GET: for debug only. */
router.get('/', function(req, res) {
  query = req.query;
  console.log(query);
  res.send(400, "Sorry, you shouldn't be here!");
});

/* PUT: new data for DB. */
router.put('/', function(req, res) {
  // get query either as request's body or query
  console.log('poo')
  query = req.query ? req.body : req.query;
  console.log(query)

  // Update DB on temp
  if (query.time && query.T) {
    var currentTempModel = mongoose.model('currentTemp');
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
      // get the latest entry time
      var latest = Date.parse(_.max(docs, function(doc) {
        return Date.parse(doc.time); }).time);
      // get all entries older that historyLength behind latest
      var oldDocs = docs.filter(function(doc) {
        return Date.parse(doc.time) <
          latest - new Date(historyLength * 60 * 1000); });
      // and remove them from the DB
      for (var i = oldDocs.length - 1; i >= 0; i--) {
        oldDocs[i].remove();
      };
    });
  } else {
    res.send(400);
  }

  // Update DB on S-params
  if (query.Snp) {
    var currentSnpModel = mongoose.model('currentSnp');

    // only have one set of current S-params at a time, so first
    // delete old data.
    currentSnpModel.find({}, function(err, docs) {
      for (doc in docs) {
        doc.remove();
      }
    });

    // add new S-params
    for (line in query.Snp) {
      var current = new currentSnpModel ({
        "Frequency": line["Frequency"],
        "S11 Re": line["S11 Re"],
        "S11 Im": line["S11 Im"],
        "S12 Re": line["S12 Re"],
        "S12 Im": line["S12 Im"],
        "S21 Re": line["S21 Re"],
        "S21 Im": line["S21 Im"],
        "S22 Re": line["S22 Re"],
        "S22 Im": line["S22 Im"]
      });
      current.save(function(err) {
        if (err) {
          res.send(400);
          return console.log("Error saving to DB");
        } else {
          res.send(200);
        }
      });
    }
  }
});

module.exports = router;