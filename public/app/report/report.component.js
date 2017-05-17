"use strict";

angular
    .module('report')
    .component('report', {
        templateUrl: 'app/report/report.template.html',
        controller: ['$rootScope', '$scope',
            function PhoneDetailController($rootScope, $scope) {
                $scope.speciality = $rootScope.globals.speciality;
                $scope.department = $rootScope.globals.department;

                $scope.sendReport = sendReport;

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
            }
        ]
    });
