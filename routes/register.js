var express = require('express');
var router = express.Router();

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

module.exports = router;