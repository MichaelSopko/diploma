"use strict";

angular
    .module('myApp')
    .config(['$locationProvider', '$routeProvider',
        function ($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/', {
                    template: '<home-page></home-page>'
                })
                .when('/test', {
                    template: '<test></test>'
                })
                .when('/speciality', {
                    template: '<specialty></specialty>'
                })
                .when('/report', {
                    template: '<report></report>'
                }).when('/schedule', {
                    template: '<shedule></shedule>'
                })
                .when('/students', {
                    template: '<students></students>'
                })
                .when('/login', {
                    template: '<login></login>'
                })
                .when('/register', {
                    template: '<sign-up></sign-up>'
                })
                .otherwise('/');

        }]).run(['$rootScope', '$location', '$cookies', '$http', 'Auth', 'editableOptions',
        function($rootScope, $location, $cookies, $http, Auth, editableOptions) {
            $rootScope.location = $location.path();
            editableOptions.theme = 'bs3';

            checkAuth();

            function checkAuth() {
                Auth.checkAuth(function (err, response) {
                    var loggedIn;
                    var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;

                    if (err) {
                        if (!restrictedPage) {
                            return;
                        }

                        if (err.status === 401) {
                            Auth.ClearCredentials();
                            $location.path('/login')
                        }

                        return;
                    }

                    $rootScope.globals = $rootScope.globals || {};
                    $rootScope.globals.currentUser = $rootScope.globals.currentUser || response.data;
                    loggedIn = $rootScope.globals.currentUser;

                    if (restrictedPage && !loggedIn) {
                        $location.path('/login');
                    }
                });
            }

            // keep user logged in after page refresh
            $rootScope.globals = $cookies.getObject('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            }

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                var loggedIn;
                var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;

                $rootScope.globals = $rootScope.globals || {};
                loggedIn= $rootScope.globals.currentUser;

                if (!restrictedPage && loggedIn) {
                    return $location.path('/');
                } else {
                    checkAuth();
                }
            });
        }]);