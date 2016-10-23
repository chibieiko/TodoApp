/**
 * Created by erika on 10/3/2016.
 */
(function () {
    "use strict";

    var Task = require('./models/task.js')
        , List = require('./models/list.js')
        , tasks
        // Task names must be between 1 to 100 characters and cannot begin with a white space
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
                res.status(500);
                res.json({
                    status: 500,
                    message: "Error finding list where task belongs to"
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
                    res.status(200);
                    res.json(listObj.tasks);
                } else {
                    res.status(500);
                    res.json({
                        status: 500,
                        message: "Error finding list"
                    });
                }
            });
        },

        // CREATES A NEW TASK AND SAVES IT TO IT'S LIST
        create: function (req, res) {
            if (req.body.taskname && req.body.taskname.match(pattern)) {
                var name = req.body.taskname;
                // Returns the list where task should be saved
                getList(req, res, function (listObj) {
                    // If priority is defined then set that value as priority. Otherwise priority is 1 by default
                    if (req.body.priority && checkPriority(req.body.priority)) {
                        priorityValue = req.body.priority;
                    }

                    // Creates a new task
                    var taskToSave = new Task({
                        taskname: name, priority: priorityValue, isDone: false
                        , list: listObj.id
                    });

                    // Pushes task to parent object's (list's) task array and saves parent
                    listObj.tasks.push(taskToSave);
                    listObj.save(function (err) {
                            if (err) {
                                res.status(500);
                                res.json({
                                    status: 500,
                                    message: "Error saving task's list to database"
                                });
                            } else {
                                res.status(200);
                                res.json({
                                    task: taskToSave,
                                    status: 200,
                                    message: "Task successfully added"
                                });
                            }
                        }
                    );
                });
            } else {
                res.status(400);
                res.json({
                    status: 400,
                    message: "Invalid task name"
                });
            }
        },

        // GETS LIST AND TASK BY ID AND UPDATES THAT TASK
        update: function (req, res) {
            // Indicates if any parameter in task was changed
            var modificationsMade = false;
            getList(req, res, function (listObj) {
                // Finds the right task to modify with task id
                var task = listObj.tasks.id(req.params.taskId);
                if (task !== null) {
                    // Checks if task name is to be modified, task name is a valid task name and different from the one
                    // that already is in the database
                    if (req.body.taskname && req.body.taskname !== undefined && req.body.taskname.match(pattern)
                        && task.taskname !== req.body.taskname) {
                        task.taskname = req.body.taskname;
                        modificationsMade = true;
                    }

                    // Checks if priority is to be modified
                    if (req.body.priority && req.body.priority !== undefined &&
                        checkPriority(req.body.priority) && task.priority !== req.body.priority) {
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

                    // if any modification were made saves the task's parent list
                    if (modificationsMade) {
                        // Saves the list
                        listObj.save(function (err) {
                            if (err) {
                                res.status(500);
                                res.json({
                                    status: 500,
                                    message: "Error saving updated task's list"
                                });
                            } else {
                                res.status(200);
                                res.json({
                                    status: 200,
                                    message: "Successfully updated task details"
                                });
                            }
                        });
                    } else {
                        res.status(400);
                        res.json({
                            status: 400,
                            message: "No changes made"
                        });
                    }
                } else {
                    res.status(500);
                    res.json({
                        status: 500,
                        message: "Error finding the task to modify"
                    });
                }
            });
        },

        // FINDS LIST AND THEN TASK BY TASK ID AND REMOVES THAT TASK
        remove: function (req, res) {
            getList(req, res, function (listObj) {
                // Pulls the task to be deleted out of the tasks array and updates List schema
                List.update({_id: listObj.id}, {$pull: {tasks: {_id: req.params.taskId}}}, function (err) {
                    if (err) {
                        res.status(500);
                        res.json({
                            status: 500,
                            message: "Error deleting task"
                        });
                    } else {
                        res.status(200);
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
