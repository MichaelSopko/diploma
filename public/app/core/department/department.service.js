'use strict';

angular
    .module('core.department')
    .factory('Department', ['$http', function($http) {

        this.getDepartments = function (params, callback) {
            $http({
                url: '/departments',
                method: 'GET',
                params: params
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        this.getById = function (id, callback) {
            $http({
                url: '/departments/' + id,
                method: 'GET'
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        return this;
    }]);
