/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('AuthCtrl', function ($scope, $rootScope, $route, $location, AuthService) {
        // Saves the current active tab to $rootScope so that it can be accessed later
        $rootScope.activeTab = $route.current.activetab;

        $scope.login = function () {
            AuthService.login($scope.username, $scope.password, function (err) {
                if (err) {
                    AuthService.createAlert("loginAlert", "danger",
                        "Error! ", err.data.message);
                } else {
                    $rootScope.loggedIn = true;
                    $location.path('#/');
                }
            });
        };

        $scope.register = function () {
            AuthService.register($scope.username, $scope.password, function (err) {
                if (err) {
                    AuthService.createAlert("registerAlert", "danger",
                        "Error! ", err.data.message);
                } else {
                    $scope.login();
                }
            });
        };
    });
}());