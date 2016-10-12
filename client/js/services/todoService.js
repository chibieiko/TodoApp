/**
 * Created by erika on 10/12/2016.
 */
(function () {
    "use strict";

    angular.module('todoModule').factory('TodoService', ['$resource', '$rootScope'
        , function ($resource, $rootScope) {
            var searchString = "http://localhost:8080/:todo";
            var result = $resource(searchString);

            var todo = {
                getLists: function (callback) {
                    console.log(1);
                    var root = result.get({todo: "lists"}
                        , function () {
                            console.log(2);
                            $rootScope.lists = root;
                            console.log("root : " + root);
                            callback();
                        }, function (err) {
                            console.log(" " + err);
                            callback(err);
                        });
                }
            };

            return todo;
        }]);
}());