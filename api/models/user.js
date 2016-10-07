/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    // Allows user name to contain only alphanumeric characters and it cannot start with whitespace
    var patternName = /^\S[\w\s]{1,100}$/;

    // Gets an instance of mongoose and mongoose.Schema
    var mongoose = require('mongoose'), Schema = mongoose.Schema;
    var UserSchema = new Schema({
        // match defines what username should be like and required defines the field as required. Both have their own
        // error messages included. They are checked when saving user details
        username: {type: String, match: [patternName, "Invalid username"], required: [true, "No username detected"]},
        password: {type: String}
    });

    // Sets up a mongoose model and passes it using module.exports
    module.exports = mongoose.model('User', UserSchema);
}());