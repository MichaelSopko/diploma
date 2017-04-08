'use strict';

angular
    .module('core.user')
    .factory('User', ['$http', function($http) {

        this.signIn = function (data, callback) {
            $http({
                url: '/users/signIn',
                method: "POST",
                data: data
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        this.getUsers = function (params, callback) {
            $http({
                url: '/users',
                method: 'GET',
                params: params
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        return this;
    }]);
