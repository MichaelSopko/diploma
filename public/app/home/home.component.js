"use strict";

angular
    .module('homePage')
    .component('homePage', {
        templateUrl: 'app/home/home.template.html',
        controller: ['$rootScope', '$scope', 'Department', 'Specialty', 'Report',
            function HomePageController($rootScope, $scope, Department, Specialty, Report) {
                $scope.departments = [];
                $scope.specialities = [];
                $scope.departmentId = null;
                $scope.department = null;
                $scope.speciality = null;
                $scope.specialityId = null;
                $scope.currentUser = $rootScope.globals.currentUser;

                $scope.checkDepartmnet = checkDepartmnet;
                $scope.checkSpeciality = checkSpeciality;
                $scope.sendReport = sendReport;

                Department.getDepartments({}, function (err, data) {
                    $scope.departments = data;
                });

                Specialty.getSpecialties({}, function (err, data) {
                    $scope.specialities = data;
                });

                function checkDepartmnet(id) {
                    $scope.departmentId = id;

                    Department.getById(id, function (err, data) {
                        $scope.department = data;
                    });
                }

                function checkSpeciality(id) {
                    $scope.specialityId = id;

                    Specialty.getById(id, function (err, data) {
                        $scope.speciality = data;
                    });
                }

                function sendReport() {
                    var data = {
                        department: $scope.department,
                        speciality: $scope.speciality,
                        course: $scope.course,
                        room: $scope.room,
                        couple: $scope.couple,
                        subject: $scope.subject,
                        topic: $scope.topic,
                        teacher: $scope.teacher,
                        date: Date.now()
                    };

                    Report.createReport(data, function (err, data) {
                        alert('success');
                    });
                }

            }]
    });