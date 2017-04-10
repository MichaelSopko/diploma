'use strict';

angular
    .module('core.student')
    .factory('Student', ['$http', function($http) {

        this.getStudents = function (params, callback) {
            $http({
                url: '/students',
                method: 'GET',
                params: params
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        return this;
    }]);
