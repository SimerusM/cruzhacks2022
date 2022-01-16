var express = require('express');
var News = require('../../build/contracts/News.json');
var properties = require('../../properties.js');
var googlelanguage = require('../googlecloud.js');
var database = require('../database.js');
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





router.post('/languageanalysis', async (req, res, next) => {

  const text = req.body.text;

  console.log(text);

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  // Sentiment analysis
  const [sentimentresult] = await googlelanguage.analyzeSentiment({ document: document });
  const sentiment = sentimentresult.documentSentiment;
  console.log(sentiment);
  // Classification
  const [classifyresult] = await googlelanguage.classifyText({ document: document });
  const classify = [];
  for (let i of classifyresult.categories) {
    for (let nm of i.name.split('/'))
      if (nm && !classify.includes(nm))
        classify.push(nm);
  }
  console.log(classify);

  res.json({
    sentimentscore: sentiment.score,
    sentimentmagnitude: sentiment.magnitude,
    classify: classify
  });
});


router.post('/addarticle', (req, res, next) => {
  const sentiment = req.body.sentiment;
  const classify = req.body.classify;
  const title = req.body.title;
  const titleHash = req.body.hex;
  const address = req.body.publisher;

  console.log(`Address: ${address}`);

  database.articles.findOne({owner: address, titleHash: titleHash})
    .then(query => {
      if (!query) {
        let article = new database.articles({
          owner: address,
          title: title,
          titleHash: titleHash, 
          sentiment: sentiment
        });
        article.save( err => {
          if (err) console.log(err);

          for (let name of classify) {
            let category = new database.categories({
              name: name,
              article: article._id
            });
            category.save(err => { console.log(err) });
          }
        });
        
      }
    });
  
  res.sendStatus(200);
});

router.post('/getarticles', (req, res, next) => {
  const address = req.body.publisher;
  if (req.body.sentiment && req.body.category) {
    database.categories
      .find({ name: req.body.category })
      .populate('article')
      .find({ owner: address, sentiment: (req.body.sentiment == 1 ? {$lte: 0} : {$gte: 0}) })
      .then(query => {
        res.send(JSON.stringify(query));
      })
      .catch(err => {
          console.log(err);
      });
  }
  else if (req.body.category) {
    database.categories
      .find({ name: req.body.category })
      .populate('article')
      .find({ owner: address })
      .then(query => {
        res.send(JSON.stringify(query));
      })
      .catch(err => {
          console.log(err);
      });
  }
  else if (req.body.sentiment) {
    database.articles
      .find({ owner: address, sentiment: (req.body.sentiment < 0 ? {$lte: 0} : {$gte: 0}) })
      .then(query => {
        res.send(JSON.stringify(query));
      })
      .catch(err => {
          console.log(err);
      });
  }
});

module.exports = router;
