var express = require('express');
var News = require('../../build/contracts/News.json');
var properties = require('../../properties.js');
var googlelanguage = require('../googlecloud.js');
var database = require('../database.js');
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
