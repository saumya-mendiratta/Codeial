// ---Taken these lines from mongoose documentation--

// Require the Library
const mongoose = require ('mongoose');

//Connect to DB
mongoose.connect('mongodb://localhost/codeial_development', {useNewUrlParser: true, useUnifiedTopology: true});

//Acquire the connection (to check if it is succesful)
const db = mongoose.connection;

//error
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

//up and running then print the message 
db.once('open', function() {
   console.log("Connected to database MomgoDB !");
});

module.exports = db;