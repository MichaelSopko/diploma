"use strict";

angular
    .module('report')
    .component('report', {
        templateUrl: 'app/report/report.template.html',
        controller: ['$routeParams', 'Phone',
            function PhoneDetailController($routeParams, Phone) {
                var self = this;

                self.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
                    self.setImage(phone.images[0]);
                });

                self.setImage = function setImage(imageUrl) {
                    self.mainImageUrl = imageUrl;
                };
            }
        ]
    });
