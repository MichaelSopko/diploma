"use strict";

var crypto = require('crypto');
var async = require('async');
var RESPONSE = require('../constants/response');
var logWriter = require('../modules/logWriter')();
var SessionHandler = require('./sessions');

var Department = function (db) {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Specialty = db.model('Specialty');

    this.getAll = function (req, res, next) {
        var query = req.query;
        var departmentId = query.departmentId;

        Specialty
            .find({
                departmentId: departmentId
            })
            .exec(function (err, models) {
                if (err) {
                    return next()
                }

                res.status(200).send(models);
            });
    };

    this.getOne = function (req, res, next) {
        var id = req.params.id;

        Specialty
            .findOne({_id: id})
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                res.status(200).send(model);
            });

    };

    this.create = function (req, res, next) {
        var id = req.params.id;

        Specialty
            .findOne({_id: id})
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                res.status(200).send(model);
            });

    };

    this.update = function (req, res, next) {
        var id = req.params.id;

        Specialty
            .findOne({_id: id})
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                res.status(200).send(model);
            });

    };

    this.delete = function (req, res, next) {
        var id = req.params.id;

        Specialty
            .findOne({_id: id})
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                res.status(200).send(model);
            });

    };

};

module.exports = Department;