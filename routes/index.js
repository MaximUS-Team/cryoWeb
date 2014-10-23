var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
  	title: 'CryoWeb',
  	connection: 'x.x.x.x:xxxx'
  });
});



module.exports = router;