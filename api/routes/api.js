var express = require('express');
var News = require('../../build/contracts/News.json');
var properties = require('../../properties.js');
var router = express.Router();
var database = require('../database');


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

router.post('/hashimage', upload.single("image"), async (req, res, next) => {
  console.log(req.file);

  let hash = await imghash.hash("./uploads/image.png");
  console.log(hash);

  res.send(hash);
});


router.get('/contract/address', (req, res, next) => {
  res.send(JSON.stringify({address: properties.contractAddress}));
});


router.get('/contract/abi', (req, res, next) => {
  res.json(News["abi"]);
});


// API endpoints
router.get('/getuser', function(req, res, next) {
  // Front end will provide address for the backennd to look and see if its alr there
  address = req.query.address;

  // Backend is now trying to see if the address mentioned is already in the database or not
  database.users.findOne({id: address})
      .then(query => {
        // If backend finds user in database
          if (query) 
              res.status(200).send(JSON.stringify(query));
          // else backend reports error
          else 
              res.status(404).send(JSON.stringify({error: "No user associated with this address"}));
      })
      .catch(err => {
          console.log(err);
          res.status(500).send({error: "Something went wrong"});
      });
});

// THIS ADDS THE USER TO THE MONGODB DATABASE
router.post('/adduser', function(req, res, next) {
  if (!req.body.name || !req.body.address)
      res.status(400).send(JSON.stringify({error: "Missing field!"}));
  else {
      database.users.findOne({id: req.body.address})
          .then(query => {
              if (query) throw {error: "User already exists!"};
              else {
                  let user = new database.users({
                      id: req.body.address,
                      username: req.body.name,
                  });
                  user.save(err => {console.log(err)});
                  res.sendStatus(200);
              }
          })
          .catch(err => {
              console.log(err);
              res.status(400).send(JSON.stringify(err));
          });
  }
});

router.get('/users', function(req, res, next) {
  database.users.find()
      .then(query => {
          res.send(JSON.stringify(query));
      })
      .catch(err => {
          console.log(err);
      });
});






module.exports = router;
