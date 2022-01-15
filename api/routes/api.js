var express = require('express');
var router = express.Router();

var multer = require('multer');
var imghash = require('imghash');

router.get('/', function(req, res, next) {
  res.send('test');
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'image.png')
  }
});
upload = multer({ storage: storage });

router.post('/hashimage', upload.single("image"), (req, res, next) => {
  console.log(req.file);

  res.send('received');
});

module.exports = router;
