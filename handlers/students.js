"use strict";

var crypto = require('crypto');
var async = require('async');
var RESPONSE = require('../constants/response');
var logWriter = require('../modules/logWriter')();
var SessionHandler = require('./sessions');

var Student = function (db) {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Student = db.model('Student');

    this.getAll = function (req, res, next) {
        Student
            .find()
            .exec(function (err, models) {
                if (err) {
                    return next()
                }

                res.status(200).send(models);
            });
    };
};

module.exports = Student;