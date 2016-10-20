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
                            $cookies.put('token', root.token);
                            $cookies.put('name', root.user.username);
                            callback();
                        }, function (err) {
                            callback(err);
                        });
                },

                register: function (username, password, callback) {
                    var root = result.save({auth: "register"}, "username=" + username + "&password=" + password
                        , function () {
                            callback();
                        }, function (err) {
                            console.log(err);
                            callback(err);
                        });
                },

                createAlert: function (containerId, type, header, message) {
                    $("#" + containerId).append('<div class="alert alert-' + type + '" id="alert' + containerId + '">' +
                        '<strong>' + header + '</strong>' + message + '</div>');
                    $("#alert" + containerId).alert();
                    window.setTimeout(function () {
                        $("#alert" + containerId).alert('close');
                    }, 4000);
                }
            };

            return auth;
        }]);
}());