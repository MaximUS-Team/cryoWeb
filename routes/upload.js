var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var historyLength = 10; // mins

/* GET: for debug only. *
router.get('/', function(req, res) {
  query = req.query;
  console.log(query);
  res.send(400, "Sorry, you shouldn't be here!");
});

/* POST: new data for DB. */
router.post('/', function(req, res) {
  // get query either as request's body or query
  query = req.query ? req.body : req.query;

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
        res.send(201);
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
    /*
    currentSnpModel.find({}, function(err, docs) {
      for (doc in docs) {
        doc.remove();
      }
    });*/
    currentSnpModel.remove({}, function (err) {
      if (err) {
        res.send(400);
        return console.log("Error removing Snp from DB");
      } else {
        // check how many entries left
        currentSnpModel.find({}, function(err, docs) {
          // if empty
          if (docs.length == 0) {
            // add new S-params
            for (var i=0; i < query.Snp.length; i++) {
              var SnpPoint = query.Snp[i];
              currentSnpModel.create({
                "Frequency": SnpPoint["Frequency"],
                "S11 Re": SnpPoint["S11 Re"],
                "S11 Im": SnpPoint["S11 Im"],
                "S12 Re": SnpPoint["S12 Re"],
                "S12 Im": SnpPoint["S12 Im"],
                "S21 Re": SnpPoint["S21 Re"],
                "S21 Im": SnpPoint["S21 Im"],
                "S22 Re": SnpPoint["S22 Re"],
                "S22 Im": SnpPoint["S22 Im"]
              }, function(err, doc) {
                if (err) {
                  res.send(400);
                  return console.log("Error saving to DB");
                }
              });
            }
          }
        });
      }
    });
  }
});

module.exports = router;