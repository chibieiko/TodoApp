/**
 * Created by erika on 10/12/2016.
 */
(function () {
    "use strict";

    angular.module('todoModule').factory('TodoService', ['$resource', '$rootScope'
        , function ($resource, $rootScope) {
            // Lists are under api
            var searchString = "http://localhost:8080/api/:todo";
            var result = $resource(searchString);

            var todo = {
                getLists: function (callback) {
                    // Server returns an array so query is better than object
                    var root = result.query({todo: "lists"}
                        , function () {
                            callback(root, null);
                        }, function (err) {
                            console.log(" " + err);
                            callback(null, err);
                        });
                }
            };

            return todo;
        }]);
}());