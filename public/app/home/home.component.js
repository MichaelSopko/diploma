"use strict";

angular
    .module('homePage')
    .component('homePage', {
        templateUrl: 'app/home/home.template.html',
        controller: ['$scope', 'Department', function HomePageController($scope, Department) {
            $scope.departments = [];

            Department.getDepartments({}, function (err, data) {


                $scope.departments = data;
                console.log(data);
            });

        }]
    });