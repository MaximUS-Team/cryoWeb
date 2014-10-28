var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logger = require("../public/javascripts/logs.js");
var _ = require('underscore');
var $ = require('jquery');

var historyLength = 10; // mins


//logger.logThis('info', 'Logger Active on app.js');
logger.logThis('info', "Logger Active on uploads.js")

//logger.logThis('info', 'Logger Active on app.js');

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
  console.log(query)

  //app.Log('info', 'Info Test');
  //console.log("test logging");
  //logger.logThis('info', "Info Test");

  // ensure the query has something
  if (!query.time && !query.T && !query.Snp && !query.serverCommand && !query.updateSettings) {
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
        logger.logThis('err', 'Error saving to DB')
        //return console.log("Error saving to DB");
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
    parseSnp(query.Snp);
  }
  
  if (query.serverCommand) {
    if (query.serverCommand === "LOG_CLEAR"){
      var logsModel = mongoose.model('logs');
      //logsModel.drop();
      logsModel.remove({}, function(err) {
        if (err) {
          res.send(400);
          logger.logThis('err', "Error deleting logs from DB");
        }
      });
      //db.logs.remove();
      //console.log(db.logs.remove());
      console.log("test");
    } else {
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
            //return console.log("Error saving to DB");
            logger.logThis("err", "Error saving to DB")
          }
        });
      })();
    }
    //console.log("Query received: " + query.serverCommand);
    res.send(201);
  }

  if (query.updateSettings) {
    // update database with new test settings
    (function() {
      var newSettingsSchema = mongoose.model('updateSettings');
      // add the update settings to the server
      newSettingsSchema.create({
        p: query.updateSettings[0],
        i: query.updateSettings[1],
        d: query.updateSettings[2],
        controlmode: query.updateSettings[3],
        power: query.updateSettings[4]
      }, function(err, doc) {
        if (err) {
          res.send(400);
          //return console.log("Error saving to DB");
          logger.logThis('err', "Error saving to DB")
        }
      });
    })();
    res.send(201);
  }
});

function parseSnp(Snp) {
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
            if (typeof Snp == 'string' || Snp instanceof String) {
              Snp = JSON.parse(Snp);
            }
            for (var i=0; i < Snp.length; i++) {
              var SnpPoint = Snp[i];
              //console.log(SnpPoint);
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
}

module.exports = router;