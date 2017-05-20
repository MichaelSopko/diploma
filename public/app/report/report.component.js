"use strict";

angular
    .module('report')
    .component('report', {
        templateUrl: 'app/report/report.template.html',
        controller: ['$rootScope', '$scope', 'Report', '$location',
            function PhoneDetailController($rootScope, $scope, Report, $location) {
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

                    $.confirm({
                        title: 'Відправити звіт?',
                        content: '',
                        buttons: {
                            something: {
                                text: 'ок',
                                action: function(){
                                    // here the key 'something' will be used as the text.

                                    Report.createReport(data, function (err, data) {
                                        $location.path('/');
                                    });
                            }
                            },
                            somethingElse: {
                                text: 'скасувати'
                            }
                        }
                    });

                }
            }
        ]
    });
