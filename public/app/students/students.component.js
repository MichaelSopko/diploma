"use strict";

angular
    .module('students')
    .component('students', {
        templateUrl: 'app/students/students.template.html',
        controller: ['$scope', 'Student', function HomePageController($scope, Student) {
            $scope.students = [];
            $scope.sort = {
                column: 'lastName',
                descending: false
            };
            $scope.columns = [{
                variable: 'lastName',
                display: 'Прізвище',
                type: 'string'
            }, {
                variable: 'firstName',
                display: 'Ім\'я',
                type: 'string'
            }, {
                variable: 'email',
                display: 'Email',
                type: 'string'
            }];

            $scope.changeSorting = changeSorting;
            $scope.convertSorting = convertSorting;

            Student.getStudents({}, function (err, data) {
                $scope.students = data;
            });

            function changeSorting(columnName) {
                var sort = $scope.sort;
                if (sort.column === columnName) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = columnName;
                    sort.descending = false;
                }
            }

            function convertSorting() {
                return $scope.sort.descending ? '-' + $scope.sort.column : $scope.sort.column;
            }

        }]
    });