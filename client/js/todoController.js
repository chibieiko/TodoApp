/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('TodoCtrl', function ($scope, $rootScope, $route, $http, $cookies
        , $location, TodoService) {

        if ($cookies.get('token') === null || undefined || "") {
            $location.path('#/login');
        } else {
            // Sends token as a header to server
            $http.defaults.headers.common['x-access-token'] = $cookies.get('token');
            $scope.uName = $cookies.get('name');


            // Saves the current active tab to $rootScope so that it can be accessed later
            $rootScope.activeTab = $route.current.activetab;

            $scope.getLists = function () {
                TodoService.getLists(function (result, err) {
                    if (err) {
                        console.log("Error getting list / No lists available");
                    } else {
                        $scope.lists = result;
                    }
                });
            };

            $scope.getLists();

            $scope.smoothCollapse = function (listId) {
                $("#" + listId).slideToggle();
            };
        }
    });
}());