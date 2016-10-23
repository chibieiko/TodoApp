/**
 * Created by erika on 10/10/2016.
 */
(function () {
    "use strict";

    angular.module("todoModule").controller('TodoCtrl', function ($scope, $rootScope, $route, $http, $cookies
        , $location, TodoService) {

        // If there is no token in cookies, then redirects to login page
        if ($cookies.get('token') === undefined) {
            $location.path('login');
            $rootScope.loggedIn = false;
        } else {
            // Sets token as a header to server. Server always checks the token before allowing any requests.
            $http.defaults.headers.common['x-access-token'] = $cookies.get('token');
            // Saves user's name to $scope so it can be accessed in html
            $scope.uName = $cookies.get('name');
            // Saves the current active tab to $rootScope so that it can be accessed later
            $rootScope.activeTab = $route.current.activetab;
            // loggedIn variable controls which navbar elements to show
            $rootScope.loggedIn = true;

            // ---------------------- LIST FUNCTIONS ---------------------------

            // Requests server to send user's lists from the database to frontend. List object contains it's tasks so
            // no need to get tasks separately.
            $scope.getLists = function () {
                TodoService.getLists(function (result, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        $scope.lists = result;
                    }
                });
            };

            // Call method so lists can be shown immediately after user has logged in.
            $scope.getLists();

            // Adds a list.
            $scope.addList = function () {
                if ($scope.listname && $scope.listname !== undefined) {
                    //Calls TodoServices function addList
                    TodoService.addList($scope.listname, function (result, err) {
                        if (err) {
                            TodoService.createAlert("listAlert", "danger",
                                "Error! ", err.data.message);
                        } else {
                            // Adds the new list to view
                            $scope.lists.push(result.list);
                            TodoService.createAlert("listAlert", "success",
                                "Success! ", result.message);
                        }
                    });
                } else {
                    TodoService.createAlert("listAlert", "danger",
                        "Error! ", "Invalid list name");
                }
            };

            // Deletes a list.
            $scope.deleteList = function (listId) {
                TodoService.deleteList(listId, function (result, err) {
                    if (err) {
                        TodoService.createAlert("listAlert", "danger",
                            "Error! ", err.data.message);
                    } else {
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
                if (newname && newname !== undefined) {
                    TodoService.modifyList(list._id, newname, function (result, err) {
                        if (err) {
                            TodoService.createAlert("listAlert", "danger",
                                "Error! ", err.data.message);
                            console.log(err);
                        } else {
                            console.log(result);
                            TodoService.createAlert("listAlert", "success",
                                "Success! ", result.message);

                            // Adds new name to list object
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
                } else {
                    TodoService.createAlert("listAlert", "danger",
                        "Error! ", "Invalid list name");
                }
            };

            // Initially and after every page refresh sorts tasks by list name alphabetically ascending
            $scope.sortList = 'listname';

            // Sorts lists with the given parameter
            $scope.sortListWith = function (parameter) {
                // Checks if same sort parameter is clicked and reverses sort parameter value
                if ($scope.sortList === parameter) {
                    parameter = "-" + parameter;
                }

                $scope.sortList = parameter;
            };


            // ---------------------- TASK FUNCTIONS ---------------------------

            // Adds a task to a list
            $scope.addTask = function (list, taskname, priority) {
                // Sets priority to 1 if it is out of range or undefined
                if (priority < 1 || priority > 5 || priority === undefined) {
                    priority = 1;
                }

                if (taskname && taskname !== undefined) {
                    TodoService.addTask(list._id, taskname, priority, function (result, err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                            // Adds the new task to view
                            list.tasks.push(result.task);
                        }
                    });
                } else {
                    TodoService.createAlert("listAlert", "danger",
                        "Error! ", "Invalid task name");
                }
            };

            // Deletes a task from list
            $scope.deleteTask = function (list, taskId) {
                TodoService.deleteTask(list._id, taskId, function (result, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                        // Removes task from view
                        var i;
                        for (i = list.tasks.length - 1; i >= 0; i -= 1) {
                            if (list.tasks[i]._id === taskId) {
                                list.tasks.splice(i, 1);
                            }
                        }
                    }
                });
            };

            // Modifies a task. taskname, priority and isDone parameters can be modified.
            $scope.modifyTask = function (list, task, newTaskName, newPriority, isDone) {
                var name = null
                    , priority = null;
                // Checks if there is any need to proceed with modify request. When isDone parameter is modified by
                // ticking the checkbox, newTaskName and newPriority are null values.
                if (newTaskName && newTaskName !== undefined) {
                    name = newTaskName;
                }

                if (newPriority && newPriority !== undefined) {
                    priority = newPriority;
                }

                if (name !== undefined || priority !== undefined) {
                    TodoService.modifyTask(list._id, task, name, priority, isDone, function (result, err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                            // Updates task in frontend
                            var i, updatedTask;
                            for (i = list.tasks.length - 1; i >= 0; i -= 1) {
                                if (list.tasks[i]._id === task._id) {
                                    if (name !== undefined && name !== null) {
                                        list.tasks[i].taskname = name;
                                    }

                                    if (priority !== undefined && priority !== null) {
                                        list.tasks[i].priority = priority;
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

            // Sorts tasks with the given parameter
            $scope.sortWith = function (parameter) {
                console.log(parameter);
                // Checks if same sort parameter is clicked and reverses sort parameter value
                if ($scope.sort === parameter) {
                    parameter = "-" + parameter;
                    console.log(parameter);
                }

                $scope.sort = parameter;
            };


            // ------------------------ STYLING FUNCTIONS ---------------------------------

            // Opens or closes modal depending
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