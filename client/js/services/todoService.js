/**
 * Created by erika on 10/12/2016.
 */
(function () {
    "use strict";

    angular.module('todoModule').factory('TodoService', ['$resource', '$rootScope'
        , function ($resource, $rootScope) {
            // Lists are under api
            var searchString = "http://localhost:8080/api/:todo/:id";
            var result = $resource(searchString, null, {'update': {method: 'PUT'}});

            var searchStringTask = "http://localhost:8080/api/:todo/:id/tasks/:taskId";
            var resultTask = $resource(searchStringTask, null, {'update': {method: 'PUT'}});

            var todo = {
                getLists: function (callback) {
                    var root;
                    // Server returns an array so query is better than get
                    root = result.query({todo: "lists"}
                        , function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                },

                addList: function (listname, callback) {
                    var root;
                    root = result.save({todo: "lists"}, "listname=" + listname
                        , function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                },

                deleteList: function (listId, callback) {
                    var root;
                    root = result.remove({todo: "lists", id: listId}
                        , function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                },

                modifyList: function (listId, listname, callback) {
                    var root;
                    root = result.update({todo: "lists", id: listId}, "listname=" + listname,
                        function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                },

                addTask: function (listId, taskname, priority, callback) {
                    var root;
                    root = resultTask.save({
                            todo: "lists",
                            id: listId
                        }, "taskname=" + taskname + "&priority=" + priority,
                        function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                },

                deleteTask: function (listId, taskId, callback) {
                    var root;
                    console.log("task id: " + taskId);
                    root = resultTask.remove({todo: "lists", id: listId, taskId: taskId},
                        function () {
                            callback(root, null);
                        }, function (err) {
                            callback(null, err);
                        });
                }
            };

            return todo;
        }]);
}());