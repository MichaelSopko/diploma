'use strict';

angular
    .module('core.specialty')
    .factory('Specialty', ['$http', function($http) {

        this.getSpecialties = function (params, callback) {
            $http({
                url: '/specialties',
                method: 'GET',
                params: params
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        return this;
    }]);
