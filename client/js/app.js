/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    // Declares the module
    var todoModule = angular.module('todoModule', ['ngRoute', 'ngResource']);

    // Configures the routing
    todoModule.config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'todos.html',
            controller: 'TodoCtrl'
        });

        $routeProvider.when('/login', {
            templateUrl: 'login.html',
            controller: 'AuthCtrl'
        });

        $routeProvider.when('/register', {
            templateUrl: 'login.html'
         //   controller: 'RegisterCtrl'
        });

        // Redirects to main page
        $routeProvider.otherwise({redirectTo: '/'});
    });
}());