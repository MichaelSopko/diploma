"use strict";

angular
    .module('login')
    .component('login', {
        templateUrl: 'app/login/login.template.html',
        controller: ['$scope', '$location', 'Auth', function LoginController($scope, $location, Auth) {
            $scope.login = login;
            $scope.error = null;

            Auth.ClearCredentials();

            function login() {
                $scope.dataLoading = true;
                $scope.error = null;

                Auth.signIn({userName: $scope.username, password: $scope.password}, function (err, data) {
                    $scope.dataLoading = false;

                    if(err) {
                        $scope.error = err.data ? err.data.error : err.error;
                        console.log(err);

                        return;
                    }

                    Auth.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                });
            }
        }]
    });