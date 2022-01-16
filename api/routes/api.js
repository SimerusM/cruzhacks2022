var express = require('express');
var News = require('../../build/contracts/News.json');
var properties = require('../../properties.js');
var googlelanguage = require('../googlecloud.js');
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

module.exports = router;
