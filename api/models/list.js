/**
 * Created by erika on 10/5/2016.
 */
(function () {
    "use strict";

    // Gets an instance of mongoose and mongoose.Schema
    var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , Task = require('./task')
        , ListSchema = new Schema({
        listname: {type: String},
        // References to the user who's list it is
        userId: {type: String},
        // Sets tasks field to an array of task Objects. Enables list to contain many tasks.
        // The ref option is what tells Mongoose in which model to look
        tasks: [Task.schema]
    });

    // Sets up a mongoose model and exports it using module.exports
    module.exports = mongoose.model('List', ListSchema);
}());