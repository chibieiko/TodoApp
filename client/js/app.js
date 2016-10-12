/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    // Declares the module
    var todoModule = angular.module('todoModule', ['ngRoute', 'ngResource', 'ngCookies']);

    // Configures the routing
    todoModule.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'todos.html',
            controller: 'TodoCtrl',
            activetab: 'todo'
        });

        $routeProvider.when('/login', {
            templateUrl: 'login.html',
            controller: 'AuthCtrl',
            activetab: 'login'
        });

        $routeProvider.when('/register', {
            templateUrl: 'register.html',
            controller: 'AuthCtrl',
            activetab: 'register'
        });

        // Redirects to main page
        $routeProvider.otherwise({redirectTo: '/'});
    });
}());