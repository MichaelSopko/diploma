"use strict";

angular
    .module('specialty')
    .component('specialty', {
        templateUrl: 'app/specialty/specialty.template.html',
        controller: ['$scope', 'Specialty', function HomePageController($scope, Specialty) {
            $scope.departments = [];

            Specialty.getSpecialties({departmentId: departmentId}, function (err, data) {


                $scope.departments = data;
                console.log(data);
            });

        }]
    });