(function () {
    "use strict";

    // GETS ALL THE PACKAGES AND MODULES NEEDED
    var express = require('express')
        , app = express()
        , bodyParser = require('body-parser')
        , config = require('./config')
        // Connects to the database
        , mongoosedb = require('./mongoosedb')
        // Requires user module
        , User = require('./api/models/user')
        , userRoutes = require('./routes')
        , auth = require('./auth');

    // CONFIGURATIONS
    var port = 8080; // process.env.PORT
    // secret variable
    app.set('jwtTokenSecret', config.secret);

    app.all('/*', function(req, res, next) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        // Set custom headers for CORS, Content-type tells in what format content is
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    // Allows the use of body parser so we can get info
    // from POST and/or URL parameters. type: '*/*' enables
    // to accept all sorts of post types.
    app.use(bodyParser.urlencoded({extended: false, type: '*/*'}));

    // Calls register 'method' form auth, when receives url /register
    app.post("/register", auth.register);
    // Calls login 'method' form auth, when receives url /login
    app.post("/login", auth.login);

    // Delivers url info to routes.js. Does there things accordingly.
    app.use('/api', userRoutes);

    // todo basic route
    app.get('/', function (req, res) {
        res.send('Hello! The API is at http://localhost' + port + '/api');
    });

    // Starts the server
    app.listen(port);
    console.log("Server is listening to port: " + port);
}());