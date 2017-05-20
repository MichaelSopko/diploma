"use strict";

angular
    .module('shedule')
    .component('shedule', {
        templateUrl: 'app/schedule/shedule.template.html',
        controller: ['$rootScope', '$scope', 'Report', '$location', '$filter', '$http', '$q', '_',
            function PhoneDetailController($rootScope, $scope, Report, $location, $filter, $http, $q, _) {
                $scope.users = [
                    {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
                    {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
                    {id: 3, name: 'awesome user3', status: 2, group: null}
                ];

                $scope.statuses = [
                    {value: 1, text: 'status1'},
                    {value: 2, text: 'status2'},
                    {value: 3, text: 'status3'},
                    {value: 4, text: 'status4'}
                ];

                $scope.days = [
                    { id: 1, name: 'Понеділок'},
                    { id: 2, name: 'Вівторок'},
                    { id: 3, name: 'Середа'},
                    { id: 4, name: 'Четвер'},
                    { id: 5, name: 'П\'ятниця'}
                ];

                $scope.subjectsByDay = [];
                $scope.selectedDay = $scope.days[0].id;
                $scope.groups = [1, 2, 3, 4, 5, 6, 7];
                $scope.lessons = [1, 2, 3, 4, 5, 6, 7];
                $scope.courses = [1, 2, 3, 4, 5, 6];
                $scope.course = 1;
                $scope.variant = 2;
                $scope.subjects = [];
                $scope.serverdata = [];

                $scope.changeDay = function () {
                    $scope.getSubjects($scope.selectedDay, $scope.course);
                };

                $scope.changeCourse = function () {
                    $scope.getSubjects($scope.selectedDay, $scope.course);
                };

                $scope.getSubjects = function (dayId, courseId) {
                    $http({
                        method : "GET",
                        url : "subjects.json"
                    }).then(function mySucces(response) {

                        $scope.subjects = _.filter(response.data, function(o) {
                            return o.day ==  dayId && o.course == courseId;
                        });
                        $scope.serverdata = _.difference(response.data, $scope.subjects) ;
                    }, function myError(response) {
                    });
                };

                $scope.getSubjects(1, 1);

                $scope.loadGroups = function() {
                    return $scope.groups.length ? null : [];
                };

                $scope.getSubject = function (lesson, group) {
                    var item =  $scope.subjects && $scope.subjects.find(function (item) {
                        return item.lesson === lesson && item.group === group;
                    });

                    if (!item) {
                        item = {
                            id: 4,
                            day: $scope.selectedDay,
                            course: $scope.course,
                            name: "",
                            lesson: lesson,
                            group: group,
                            variant: variant
                        };
                        $scope.subjects.push(item);
                    }


                    return  $scope.subjects[$scope.subjects.indexOf(item)];
                };

                $scope.showGroup = function(user) {
                    if(user.group && $scope.groups.length) {
                        var selected = $filter('filter')($scope.groups, {id: user.group});
                        return selected.length ? selected[0].text : 'Not set';
                    } else {
                        return user.groupName || 'Not set';
                    }
                };

                $scope.showStatus = function(user) {
                    var selected = [];
                    if(user.status) {
                        selected = $filter('filter')($scope.statuses, {value: user.status});
                    }
                    return selected.length ? selected[0].text : 'Not set';
                };

                $scope.checkName = function(data, id) {
                    if (id === 2 && data !== 'awesome') {
                        return "Username 2 should be `awesome`";
                    }
                };

                // filter users to show
                $scope.filterUser = function(user) {
                    return user.isDeleted !== true;
                };

                // mark user as deleted
                $scope.deleteUser = function(id) {
                    var filtered = $filter('filter')($scope.users, {id: id});
                    if (filtered.length) {
                        filtered[0].isDeleted = true;
                    }
                };

                // add user
                $scope.addUser = function() {
                    $scope.users.push({
                        id: $scope.users.length+1,
                        name: '',
                        status: null,
                        group: null,
                        isNew: true
                    });
                };

                // cancel all changes
                $scope.cancel = function() {
                    for (var i = $scope.users.length; i--;) {
                        var user = $scope.users[i];
                        // undelete
                        if (user.isDeleted) {
                            delete user.isDeleted;
                        }
                        // remove new
                        if (user.isNew) {
                            $scope.users.splice(i, 1);
                        }
                    }
                };

                // save edits
                $scope.saveTable = function() {
                    var subjects = _.union($scope.serverdata, $scope.subjects).map(function (item) {
                        item.variant = $scope.variant;
                        return item;
                    });
                    $http({
                        method : "POST",
                        url : "save",
                        data: subjects
                    }).then(function mySucces(response) {

                    }, function myError(response) {
                    });
                };
            }
        ]
    });
