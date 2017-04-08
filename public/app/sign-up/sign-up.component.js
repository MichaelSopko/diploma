"use strict";

angular
    .module('signUp')
    .component('signUp', {
        templateUrl: 'app/sign-up/sign-up.template.html',
        controller: ['$scope', '$location', 'Auth', function LoginController($scope, $location, Auth) {
            $scope.signUp = signUp;
            $scope.userType = 'student';

            function signUp() {
                $scope.dataLoading = true;

                var obj = {
                    userName: $scope.username,
                    password: $scope.password,
                    confirmPass: $scope.confirmPass,
                    ticketNumber: $scope.ticketNumber,
                    userType: $scope.userType,
                    email: $scope.email
                };

                Auth.signUp(obj, function (err, data) {
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