"use strict";

angular
    .module('homePage')
    .component('homePage', {
        templateUrl: 'app/home/home.template.html',
        controller: ['$scope', 'Department', 'Specialty', function HomePageController($scope, Department, Specialty) {
            $scope.departments = [];
            $scope.specialities = [];
            $scope.checkDepartmnet = checkDepartmnet;
            $scope.checkSpeciality = checkSpeciality;
            $scope.departmentId = null;
            $scope.department = null;
            $scope.speciality = null;
            $scope.specialityId = null;

            Department.getDepartments({}, function (err, data) {
                $scope.departments = data;
            });

            Specialty.getSpecialties({}, function (err, data) {
                $scope.specialities = data;
            });

            function checkDepartmnet(id) {
                $scope.departmentId = id;
                getDepartment(id);
            }

            function checkSpeciality(id) {
                $scope.specialityId = id;
                getSpeciality(id);
            }

            function getDepartment(id) {
                Department.getById(id, function (err, data) {
                    $scope.department = data;
                });
            }

            function getSpeciality(id) {
                Specialty.getById(id, function (err, data) {
                    $scope.speciality = data;
                });
            }

        }]
    });