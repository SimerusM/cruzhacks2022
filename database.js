var mongoose = require('mongoose');
var properties = require('./properties');

//set up mongoose connection
var mongoDB = properties.databaseURL;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

//bind connection to error event for connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var Schema = mongoose.Schema;

var userSchema = new Schema({
    id: String, //stores blockchain user/publisher address
    username: String, // name of organization
});

var users = db.model('users', userSchema); 

module.exports = {
    users: users
}