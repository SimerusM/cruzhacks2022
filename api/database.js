//import mongoose module
var mongoose = require('mongoose');
var properties = require('../properties');

//set up mongoose connection
var mongoDB = properties.databaseURL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

//bind connection to error event for connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    owner: String, // stores blockchain address of publisher
    title: String, // headline
    titleHash: String, 
    sentiment: Number // sentiment analysis
});

var articles = db.model('articles', articleSchema);

var categorizeSchema = new Schema({
    name: String, // name of category
    article: [{ type: Schema.Types.ObjectId, ref: 'articles' }]
});

var categories = db.model('categories', categorizeSchema);

var userSchema = new Schema({
    id: String, // stores blockchain user/publisher address
    username: String, // name of organization
});

var users = db.model('users', userSchema); 

module.exports = {
    categories: categories,
    articles: articles,
    users: users
}