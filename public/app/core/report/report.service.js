'use strict';

angular
    .module('core.report')
    .factory('Report', ['$http',
    function($http) {

        this.createReport = function (params, callback) {
            $http({
                url: '/reports',
                method: 'POST',
                data: params
            }).then(function (response) {
                callback(null, response.data);
            }, callback);
        };

        return this;
    }
    ]);
