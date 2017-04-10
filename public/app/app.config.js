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
                .when('/speciality', {
                    template: '<specialty></specialty>'
                })
                .when('/report', {
                    template: '<report></report>'
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
                .when('/phones', {
                    template: '<phone-list></phone-list>'
                })
                .when('/phones/:phoneId', {
                    template: '<phone-detail></phone-detail>'
                })
                .otherwise('/');

        }]).run(['$rootScope', '$location', '$cookies', '$http', 'Auth',
        function($rootScope, $location, $cookies, $http, Auth) {
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