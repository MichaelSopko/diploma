"use strict";

angular
    .module('students')
    .component('students', {
        templateUrl: 'app/students/students.template.html',
        controller: ['$scope', 'Student', function HomePageController($scope, Student) {
            $scope.students = [];

            Student.getStudents({}, function (err, data) {


                $scope.students = data;
                console.log(data);
            });

        }]
    });