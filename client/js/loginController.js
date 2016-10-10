/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('AuthCtrl', function ($scope, AuthService) {
        $scope.login = function () {
            AuthService.login($scope.username, $scope.password, function (err) {
                if (err) {
                    console.log("Authentication failure");
                } else {
                    location.href="#/";
                }
            });
        };
    });

    angular.module("todoModule").factory('AuthService', ["$resource", "$rootScope", function ($resource, $rootScope) {
        var searchString = "http://localhost:8080/:auth";
        var result = $resource(searchString);

        var auth = {
            login: function (username, password, callback) {
                var root = result.save({auth: "login"}, "username=" + username + "&password=" + password, function () {
                    $rootScope.token = root.token;
                    $rootScope.name = root.user.username;
                    callback();
                }, function (err) {
                    console.log("auth " + err);
                    callback(err);
                });
            }
        };

        return auth;
    }]);
}());