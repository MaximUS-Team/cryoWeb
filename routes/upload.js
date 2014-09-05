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

  // ensure the query has something
  if (!query.time && !query.T && !query.Snp && !query.serverCommand) {
    res.send(400);
  }

  if (query.time && query.T) {
    // update database with new temperature/time
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
  }

  if (query.Snp) {
    // update database with new SNP data
    (function() {
      var Snp = query.Snp
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
              if (Snp) {
                for (var i=0; i < Snp.length; i++) {
                  var SnpPoint = Snp[i];
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
              } else {
                console.log(
                  'for some reason query.Snp from upload is blank.')
              }
            }
          });
        }
      });
    })()
  }

  if (query.serverCommand) {
    // update database with new server command
    (function() {
      var serverCmdSchema = mongoose.model('serverCommand');
      // send a new command to the server
      var date = new Date();
      var enclosedMeta = query.meta ? query.meta : "";
      serverCmdSchema.create({
        time: date.toUTCString(),
        command: query.serverCommand,
        meta: enclosedMeta
      }, function(err, doc) {
        if (err) {
          res.send(400);
          return console.log("Error saving to DB");
        }
      });
    })();
    //console.log("Query received: " + query.serverCommand);
    res.send(201);
  }
});

module.exports = router;