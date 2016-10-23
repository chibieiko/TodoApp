/**
 * Created by erika on 10/5/2016.
 */
(function () {
    "use strict";

    // Gets an instance of mongoose and mongoose.Schema
    var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        , TaskSchema = new Schema({
            taskname: {type: String},
            priority: {type: Number},
            isDone: {type: Boolean},
            // The ref option is what tells Mongoose in which model to look for the id.
            list: {type: Schema.ObjectId, ref: 'List'}
        });

    // Sets up a mongoose model and exports it using module.exports
    module.exports = mongoose.model('Task', TaskSchema);
}());