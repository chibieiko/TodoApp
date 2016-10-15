/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var Task = require('./models/task.js')
        , List = require('./models/list.js')
        , escape = require('escape-html')
        , tasks
        // Must be between 1 to 100 characters and cannot begin with a white space
        , pattern = /^\S.{1,100}$/
        , priorityValue = 1;

    // Checks whether priority is a number, returns a boolean accordingly
    function checkPriority(priority) {
        var intPriority = Number(priority);
        if (!isNaN(intPriority)) {
            return intPriority;
        } else {
            return false;
        }
    }

    // Returns the list to which task belongs to or is going to belong to as a callback function parameter
    function getList(req, res, callback) {
        var listObj;
        // Finds a list based on list's id
        List.findOne({_id: req.params.id}, function (err, result) {
            if (err) {
                res.status(401);
                res.json({
                    status: 401,
                    message: err.message //"Error finding list"
                });
            } else {
                listObj = result;
                callback(listObj);
            }
        });
    }

    tasks = {
        getAll: function (req, res) {
            // FINDS CORRESPONDING LIST AND GETS ALL TASKS FROM LIST
            getList(req, res, function (listObj) {
                if (listObj !== null) {
                    // sends all tasks from list in json style
                    res.json(listObj.tasks);
                } else {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: "Error finding list"
                    });
                }
            });
        },

        // CREATES NEW TASK AND SAVES IT TO THE LIST
        create: function (req, res) {
            if (req.body.taskname && req.body.taskname.match(pattern)) {
                var name = escape(req.body.taskname);
                // Returns the list where task should be saved
                getList(req, res, function (listObj) {
                    // If priority is defined then set that value as priority. Otherwise priority is 1 by default
                    if (req.body.priority && checkPriority(req.body.priority)) {
                        priorityValue = req.body.priority;
                    }

                    var taskToSave = new Task({
                        taskname: name, priority: priorityValue, isDone: false
                        , list: listObj.id
                    });

                    // Pushes task to parent object's variable array and saves parent
                    listObj.tasks.push(taskToSave);
                    listObj.save(function (err) {
                            if (err) {
                                res.status(401);
                                res.json({
                                    status: 401,
                                    message: err.message //"Error saving task to list"
                                });
                            } else {
                                res.json({
                                    task: taskToSave,
                                    status: 200,
                                    message: name + " successfully added to " + listObj.listname
                                });
                            }
                        }
                    );
                });
            } else {
                res.status(401);
                res.json({
                    status: 401,
                    message: "Invalid list name"
                });
            }
        },

        update: function (req, res) {
            // Indicates if any parameter in task was changed
            var modificationsMade = false;
            // TODO Check in front end if any modifications were made
            // GETS LIST AND TASK BY ID AND UPDATES THAT TASK
            getList(req, res, function (listObj) {
                // Finds the right task to modify with task id
                var task = listObj.tasks.id(req.body.id);
                if (task !== null) {
                    // Checks if task name is to be modified, taskname is a valid taskname and different from the one
                    // that already is in the database
                    if (req.body.taskname && req.body.taskname.match(pattern)
                        && task.taskname !== escape(req.body.taskname)) {
                        task.taskname = escape(req.body.taskname);
                        modificationsMade = true;
                    }

                    // Checks if priority is to be modified
                    if (req.body.priority && checkPriority(req.body.priority) && task.priority !== req.body.priority) {
                        task.priority = req.body.priority;
                        modificationsMade = true;
                    }

                    // Checks if isDone boolean is to be modified
                    if (req.body.isDone && (req.body.isDone === "true" || req.body.isDone === "false")
                        && task.isDone !== req.body.isDone) {
                        // Sets true or false depending on statement outcome
                        task.isDone = req.body.isDone === "true";
                        modificationsMade = true;
                    }

                    if (modificationsMade) {
                        // Saves the list
                        listObj.save(function (err) {
                            if (err) {
                                res.status(401);
                                res.json({
                                    status: 401,
                                    message: err.message //"Error updating task"
                                });
                            } else {
                                res.json({
                                    status: 200,
                                    message: "Successfully updated task details"
                                });
                            }
                        });
                    } else {
                        res.json({
                            status: 200,
                            message: "No changes made"
                        });
                    }
                } else {
                    res.status(401);
                    res.json({
                        status: 401,
                        message: "Error finding the task to modify"
                    });
                }
            });
        },

        remove: function (req, res) {
            // FINDS LIST AND THEN TASK BY TASK ID AND REMOVES THAT TASK
            getList(req, res, function (listObj) {
                // Pulls the task to be deleted out of the tasks array and updates List schema
                List.update({_id: listObj.id}, {$pull: {tasks: {_id: req.body.id}}}, function (err) {
                    if (err) {
                        res.status(401);
                        res.json({
                            status: 401,
                            message: "Error deleting task"
                        });
                    } else {
                        res.json({
                            status: 200,
                            message: "Task deleted successfully"
                        });
                    }
                });
            });
        }
    };

    module.exports = tasks;
}());
