const express = require("express");
require('dotenv').config();
const env = require('./config/environment'); 
const logger = require('morgan');

//To use cookies in
const cookieParser = require('cookie-parser');

const app = express();

//Helper function
require('./config/view-helpers')(app);

const port = 8000;

const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');

//Used for session cookies
const session =require('express-session');

//For using passport js
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-stratergy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//Use mongo store to keep the user logged in
const MongoStore = require('connect-mongo');

//Using SASS
const sassMiddleware = require('node-sass-middleware');

//connect flash 
const flash = require('connect-flash');
//Middleware to be used in flash
const customMware = require('./config/middleware');

//For Sockets.io(Chatting engine)
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path = require('path');
//Use SASS
if(env.name== 'development'){

    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug:true,
        outputStyle: 'extended',
        prefix:'/css'
    }));
}


//Used for parsing
app.use(express.urlencoded());

//To use coookies
app.use(cookieParser());

//make the uploads path availaible to the browser
app.use('/uploads' , express.static(__dirname + '/uploads'));

//For usinf logger
app.use(logger(env.morgan.mode , env.morgan.options));

app.use(express.static(env.asset_path));

//Using Layouts
app.use(expressLayouts);

//Extract style and scripts from sub pages into layout
app.set('layout extractStyles' , true);
app.set('layout extractScripts' , true);

//Setting up view engine
app.set('view engine', 'ejs');
app.set('views' , './views');

//MongoStore is used to store the session cookie in db
//Encryption of cookies
app.use(session({
    name:'codeial',
    //TODO: Chagnge the secret before deployment in production mode
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        //maximum time of user session login
        maxAge: (1000 * 60 * 100)
    } ,
    store: MongoStore.create(
        { 
            // mongooseConnection : db,
            mongoUrl: 'mongodb://http://3.22.209.13/codeial_development',
            autoRemove:'disabled'     
         } ,
         function(err){
             console.log(err||'Connect mongodb setup ok');
         }
    )
}));

//Use passport JS
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Use connect flash after session cookie as it a part of it
app.use(flash());
app.use(customMware.setFlash);

//Use express router 
app.use('/' , require('./routes'));

app.listen(port , function(err){

    if(err){
        // console.log("Error:" , err);
        console.log(`Error in running the Server : ${err}`);
    }
    // ---Used backticks(``) not ''
    console.log(`Server is running on port :  ${port}` );


});