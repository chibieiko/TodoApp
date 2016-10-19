/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('TodoCtrl', function ($filter, $scope, $rootScope, $route, $http, $cookies
        , $location, TodoService) {

        if ($cookies.get('token') === undefined) {
            $location.path('login');
        } else {
            // Sets token as a header to server. Server always checks the token before allowing any requests.
            $http.defaults.headers.common['x-access-token'] = $cookies.get('token');
            // Saves user's name to $scope so it can be accessed in html
            $scope.uName = $cookies.get('name');
            // Saves the current active tab to $rootScope so that it can be accessed later
            $rootScope.activeTab = $route.current.activetab;

            // Requests server to send user's lists from the database to frontend. List object contains it's tasks so
            // no need to get tasks separately.
            $scope.getLists = function () {
                TodoService.getLists(function (result, err) {
                    if (err) {
                        // todo error message for user!
                        console.log("Error getting list / No lists available");
                    } else {
                        $scope.lists = result;
                    }
                });
            };

            // Call method immediately so lists can be shown immediately after user has logged in.
            ($scope.getLists());

            // Adds a list.
            $scope.addList = function () {
                TodoService.addList($scope.listname, function (result, err) {
                    if (err) {
                        // todo error message for user!
                        console.log(err);
                    } else {
                        console.log(result);
                        // Adds the new list to view
                        $scope.lists.push(result.list);
                    }
                });
            };

            // Deletes a list.
            $scope.deleteList = function (listId) {
                TodoService.deleteList(listId, function (result, err) {
                    if (err) {
                        // todo error message for user!
                        console.log(err);
                    } else {
                        // todo success message for user!

                        // Removes the deleted list from view
                        var i;
                        for (i = $scope.lists.length - 1; i >= 0; i -= 1) {
                            if ($scope.lists[i]._id === listId) {
                                $scope.lists.splice(i, 1);
                            }
                        }

                        console.log(result);
                    }
                });
            };

            // Modifies list's name
            $scope.modifyList = function (list, newname) {
                TodoService.modifyList(list._id, newname, function (result, err) {
                    if (err) {
                        // todo error message for user!
                        console.log(err);
                    } else {
                        console.log(result);

                        // Adds new name to list list object
                        list.listname = newname;
                        var i;
                        // Removes list object with old name and adds list object with new name in its place
                        for (i = $scope.lists.length - 1; i >= 0; i -= 1) {
                            if ($scope.lists[i]._id === list._id) {
                                $scope.lists.splice(i, 1, list);
                            }
                        }
                    }
                });
            };

            // Initially and after every page refresh sorts tasks by listname alphabetically ascending
            $scope.sortList = 'listname';

            $scope.sortListWith = function(parameter) {
                if ($scope.sortList === parameter) {
                    // Checks if same sort parameter is clicked and reverses sort parameter value
                    console.log("same so turning it to -parameter");
                    parameter = "-" + parameter;
                }

                console.log("parameter to sort with: " + parameter);
                $scope.sortList = parameter;
            };

            $scope.addTask = function (list, taskname, priority) {
                if (priority < 1 || priority > 5 || priority === undefined) {
                    priority = 1;
                }

                TodoService.addTask(list._id, taskname, priority, function (result, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);

                        list.tasks.push(result.task);
                    }
                });
            };

            $scope.deleteTask = function (list, taskId) {
                TodoService.deleteTask(list._id, taskId, function (result, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);

                        // Removes task from frontend
                        var i;
                        for (i = list.tasks.length - 1; i >= 0; i -= 1) {
                            if (list.tasks[i]._id === taskId) {
                                list.tasks.splice(i, 1);
                            }
                        }
                    }
                });
            };

            $scope.modifyTask = function (list, task, newTaskName, newPriority, isDone) {
                // Checks if there is any need to proceed with modify request
                if (newTaskName !== undefined || newPriority !== undefined) {
                    TodoService.modifyTask(list._id, task, newTaskName, newPriority, isDone, function (result, err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                            // Updates task in frontend
                            var i, updatedTask;
                            for (i = list.tasks.length - 1; i >= 0; i -= 1) {
                                if (list.tasks[i]._id === task._id) {
                                    if (newTaskName !== undefined && newTaskName !== null) {
                                        list.tasks[i].taskname = newTaskName;
                                    }

                                    if (newPriority !== undefined && newTaskName !== null) {
                                        list.tasks[i].priority = newPriority;
                                    }

                                    updatedTask = list.tasks[i];
                                    list.tasks.splice(i, 1, updatedTask);
                                }
                            }
                        }
                    });
                } else {
                    console.log("Nothing to modify");
                }
            };

            // Initially and after every page refresh sorts tasks by priority
            $scope.sort = 'priority';

            $scope.sortWith = function(parameter) {
                // Checks if same sort parameter is clicked and reverses sort parameter value
                if ($scope.sort === parameter) {
                    parameter = "-" + parameter;
                }

                $scope.sort = parameter;
            };


            // ------------------------ STYLING FUNCTIONS ---------------------------------

            $scope.toggleModal = function (id) {
                $(id).modal('toggle');
            };

            // Turns list's chevron when clicking list panel
            $scope.turnChevron = function (listId) {
                $("#" + listId + "chevron").toggleClass("chevronOpen");
            };

            // Collapses list's tasks smoothly away and to view
            $scope.smoothCollapse = function (listId) {
                $("#" + listId).slideToggle();
            };
        }
    });
}());