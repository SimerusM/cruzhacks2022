var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('test');
});

router.post('/hashimage', (req, res, next) => {
  
});

module.exports = router;
