/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('TodoCtrl', function ($scope, $rootScope, $route, TodoService) {
        // Saves the current active tab to $rootScope so that it can be accessed later
        $rootScope.activeTab = $route.current.activetab;
        $scope.getLists = function () {
            TodoService.getLists(function (err) {
                if (err) {
                    console.log("Error getting list / No lists available");
                }
            });
        };
    });
}());