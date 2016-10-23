/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var List = require('./models/list.js')
        , lists
        // Allows any characters, limits length to min 1 max 100
        , pattern = /^\S.{0,100}$/;

    lists = {
        getAll: function (req, res) {
            List.find({userId: req.userId}, function (err, result) {
                if (err) {
                    res.status(500);
                    res.json({
                        status: 500,
                        message: "No lists found"
                    });
                } else {
                    res.status(200);
                    res.json(result);
                }
            });
        },

        create: function (req, res) {
            if (req.body.listname && req.body.listname.match(pattern)) {
                // No need to escape list names if they are shown as angular expressions
                var name = req.body.listname;
                // Creates a new list with given name, user's id and an empty task array
                var listToSave = new List({listname: name, userId: req.userId, tasks: []});
                // Saves the list
                listToSave.save(function (err) {
                        if (err) {
                            res.status(500);
                            res.json({
                                status: 500,
                                message: "Error saving new list to database"
                            });
                        } else {
                            res.status(200);
                            res.json({
                                list: listToSave,
                                status: 200,
                                message: "List successfully created"
                            });
                        }
                    }
                );
            } else {
                res.status(400);
                res.json({
                    status: 400,
                    message: "Invalid list name"
                });
            }
        },

        update: function (req, res) {
            if (req.body.listname && req.body.listname.match(pattern)) {
                // No need to escape list names if they are shown as angular expressions.
                var newName = req.body.listname;
                // Updates listname with the new list name
                List.update({userId: req.userId, _id: req.params.id}, {$set: {listname: newName}}
                    , function (err) {
                        if (err) {
                            res.status(500);
                            res.json({
                                status: 500,
                                message: "Error updating list name"
                            });
                        } else {
                            res.status(200);
                            res.json({
                                status: 200,
                                message: "List name updated successfully"
                            });
                        }
                    });
            } else {
                res.status(400);
                res.json({
                    status: 400,
                    message: "Invalid list name"
                });
            }
        },

        remove: function (req, res) {
            // Finds and removes a list
            List.find({userId: req.userId, _id: req.params.id}).remove(function (err) {
                if (err) {
                    res.status(500);
                    res.json({
                        status: 500,
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


