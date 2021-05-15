// ---Taken these lines from mongoose documentation--
const env = require('./environment');
// Require the Library
const mongoose = require ('mongoose');

//Connect to DB
mongoose.connect(`mongodb://localhost/${env.db}`, {useNewUrlParser: true, useUnifiedTopology: true});

//Acquire the connection (to check if it is succesful)
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

//up and running then print the message 
db.once('open', function() {
   console.log("Connected to database MomgoDB !");
});

module.exports = db;