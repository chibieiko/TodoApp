/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var List = require('./models/list.js')
        , escape = require('escape-html')
        , lists
        // Allows any characters, limits length to min 1 max 100
        , pattern = /^\S.{1,100}$/;

    lists = {
        getAll: function (req, res) {
            List.find({userId: req.userId}, function (err, result) {
                if (err) {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: err.message //"Error finding lists"
                    });
                } else {
                    res.json(result);
                }
            });
        },

        create: function (req, res) {
            if (req.body.listname && req.body.listname.match(pattern)) {
                // escapes name so no scripts or bad intents go into database
                var name = escape(req.body.listname);
                // Creates a new list with given name, user's id and an empty task array
                var listToSave = new List({listname: name, userId: req.userId, tasks: []});
                // Saves the list
                listToSave.save(function (err) {
                        if (err) {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: err.message //"Error creating list"
                            });
                        } else {
                            res.json({
                                list: listToSave,
                                status: 200,
                                message: name + " successfully created"
                            });
                        }
                    }
                );
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: "Invalid list name"
                });
            }
        },

        update: function (req, res) {
            console.log("in server newName on: " + req.body.listname);
            if (req.body.listname && req.body.listname.match(pattern)) {
                // escapes name so no scripts or bad intents go into database
                var newName = escape(req.body.listname);
                // Updates listname with the new list name
                List.update({userId: req.userId, _id: req.params.id}, {$set: {listname: newName}}
                    , function (err) {
                        if (err) {
                            res.status(401);
                            res.json({
                                status: 401,
                                message: err.message //"Error updating list name"
                            });
                        } else {
                            res.json({
                                status: 200,
                                message: "List name updated successfully"
                            });
                        }
                    });
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: "Invalid list name" + req.body.listname + " mikssiiiii"
                });
            }
        },

        remove: function (req, res) {
            List.find({userId: req.userId, _id: req.params.id}).remove(function (err) {
                if (err) {
                    res.status(401).send({
                        status: 401,
                        message: "Error deleting list"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "List deleted successfully"
                    });
                }
            });
        }
    };

    module.exports = lists;
}());


