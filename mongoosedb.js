/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var mongoose = require('mongoose')
        , config = require('./config');

    // Connects to the database, url is provided in config file
    mongoose.connect(config.database);
    // variable containing the connection
    var db = mongoose.connection;

    // Exports db so it can be used elsewhere
    module.exports = db;
}());