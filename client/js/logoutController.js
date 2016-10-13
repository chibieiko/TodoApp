/**
 * Created by erika on 10/13/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('LogoutCtrl', function ($scope, $cookies) {
        $scope.logout = function () {
            console.log("in logout");
            $cookies.remove('token');
            $cookies.remove('name');
            $scope.lists = null;
        };
    });
}());