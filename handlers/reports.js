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
    var mailer = require('../helpers/mailer');

    function prepareCreateAccountEmail(body, callback) {
        var templateName = 'public/templates/mail/notification.html';
        var from = 'Decanat';
        var department = body.department;
        var speciality = body.speciality;

        var str = '<div> <h3>Кафедра: ' + department.name + '</h3> <h3>Спеціальність: ' + speciality.name + '</h3> </div>' +
            ' <div> <b>Курс: </b> <span>' + body.course + '</span> ' +
            '<b>Аудиторія: </b> <span>' + body.room + '</span> ' +
            '<b>Пара: </b> <span>' + body.couple + '</span> ' +
            '<b>Група: </b> <span>' + body.couple + '</span> ' +
            '<b>Кількість студентів: </b> <span>' + 10 + '</span> ' +
            '<b>Предмет: </b> <span>' + body.subject + '</span> ' +
            '<b>Тема: </b> <span>' + body.topic + '</span> ' +
            '<b>Викладач: </b> <span>' + body.teacher || '' + '</span> ' +
            '</div>';

        var mailOptions = {
            from        : from,
            mailTo      : 'zavkaf.teib.test@gmail.com',
            title       : 'Звіт',
            templateName: templateName,
            templateData: {
                data: {
                    notification: str
                }
            }
        };

        mailer.sendReport(mailOptions, callback);
    }

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
            .save(function (err, model) {
                if (err) {
                    return next(err)
                }

                prepareCreateAccountEmail(body, function (err, result) {
                    if (err) {
                        logWriter.log('createDefaultAdmin-> prepareCreateAdminEmail->' + err);
                        return;
                    }

                    res.status(200).send(model);
                });


            });

    };

};

module.exports = Department;