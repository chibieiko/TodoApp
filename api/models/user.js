/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    // Allows user name to contain only alphanumeric characters and it cannot start with whitespace
    var patternName = /^\S[\w]{1,100}$/
        // Gets an instance of mongoose
        , mongoose = require('mongoose')
        // Gets an instance of mongoose.Schema
        , Schema = mongoose.Schema
        // Creates UserSchema
        , UserSchema = new Schema({
            // match defines what username should be like and required defines the field as required.
            // Both have their own error messages included. They are checked when saving user details.
            username: {type: String, match: [patternName, "Invalid username"], required: [true, "No username detected"]},
            password: {type: String}
        });

    // Sets up a mongoose model and passes it using module.exports
    module.exports = mongoose.model('User', UserSchema);
}());