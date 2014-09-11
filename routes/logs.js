var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('logs', {
  	title: 'CryoWeb Logs',
  });
});

module.exports = router;

// mongoose.connect('mongodb://admin:Cryogenic@oceanic.mongohq.com:10003/jcu-cryo', function(err){
// 	if(!err){
// 		console.log('connected to mongodb');
// 	} else{
// 		throw err;
// 	}
// });

// var schema = mongoose.Schema,
// ObjectID = Schema.ObjectID;

// var Logs = new Schema({
// 	log : string
// });

// var Logs = mongoose.model('Logs', Logs);

// app.get('/', function(req, res){
// 	Logs.find({}, function(err, docs){
// 		res.render('logs', {docs: docs});
// 	});
// });
