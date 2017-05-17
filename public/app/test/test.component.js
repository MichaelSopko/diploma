"use strict";

angular
    .module('test')
    .component('test', {
        templateUrl: 'app/test/test.template.html',
        controller: ['$scope', function ($scope) {
            $scope.word = "Habrahabra";
        }]
    });