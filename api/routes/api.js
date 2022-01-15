var express = require('express');
var router = express.Router();

var imghash = require('imghash');

router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/hashimage', (req, res, next) => {
  console.log(req.files[0]);

  
  res.send('received');
});

module.exports = router;
