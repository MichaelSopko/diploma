"use strict";

var crypto = require('crypto');
var async = require('async');
var RESPONSE = require('../constants/response');
var logWriter = require('../modules/logWriter')();
var SessionHandler = require('./sessions');

var Department = function (db) {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Report = db.model('Report');

    this.getAll = function (req, res, next) {
        Report
            .find()
            .exec(function (err, models) {
                if (err) {
                    return next()
                }

                res.status(200).send(models);
            });
    };

    this.create = function (req, res, next) {
        var body = req.body;
        var report = new Report({
            department: body.department,
            speciality: body.speciality,
            course    : body.course,
            room      : body.room,
            couple    : body.couple,
            subject   : body.subject,
            topic     : body.topic,
            teacher   : body.teacher,
            createdAt : body.date,
            createdBy : req.session.userId
        });

        report
            .save()
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                res.status(200).send(model);
            });

    };

};

module.exports = Department;