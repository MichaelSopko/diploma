"use strict";

describe('phoneDetail', function() {

    // Load the module that contains the `phoneDetail` component before each test
    beforeEach(module('phoneDetail'));

    // Test the controller
    describe('PhoneDetailController', function() {
        var $httpBackend, ctrl;

        beforeEach(inject(function($componentController, _$httpBackend_, $routeParams) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('phones/xyz.json').respond({name: 'phone xyz'});

            $routeParams.phoneId = 'xyz';

            ctrl = $componentController('phoneDetail');
        }));

        it('should fetch the phone details', function() {
            expect(ctrl.phone).toBeUndefined();

            $httpBackend.flush();
            expect(ctrl.phone).toEqual({name: 'phone xyz'});
        });

    });

    it('should display the first phone image as the main phone image', function() {
        var mainImage = element(by.css('img.phone'));

        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });

    it('should swap the main image when clicking on a thumbnail image', function() {
        var mainImage = element(by.css('img.phone'));
        var thumbnails = element.all(by.css('.phone-thumbs img'));

        thumbnails.get(2).click();
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);

        thumbnails.get(0).click();
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
    });


});