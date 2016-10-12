/**
 * Created by erika on 10/11/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").factory('AuthService', ["$resource", "$rootScope", "$cookies"
        , function ($resource, $rootScope, $cookies) {
            var searchString = "http://localhost:8080/:auth";
            var result = $resource(searchString);

            var auth = {
                login: function (username, password, callback) {
                    var root = result.save({auth: "login"}, "username=" + username + "&password=" + password
                        , function () {
                            $rootScope.token = root.token;
                            $cookies.put('token', root.token);
                            $rootScope.name = root.user.username;
                            callback();
                        }, function (err) {
                            console.log("auth service login: " + err);
                            callback(err);
                        });
                },

                register: function (username, password, callback) {
                    var root = result.save({auth: "register"}, "username=" + username + "&password=" + password
                        , function () {
                            callback();
                        }, function (err) {
                            console.log("auth service register: " + err);
                            callback(err);
                        });
                }
            };

            return auth;
        }]);
}());