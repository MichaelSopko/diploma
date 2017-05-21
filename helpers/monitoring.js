var SCHEDULE_JOB_RULE;
var schedule = require('node-schedule');
var async = require('async');
var mailer = require('../helpers/mailer');

function prepareCreateAccountEmail(str, callback) {
    var templateName = 'public/templates/mail/notification.html';
    var from = 'Decanat';

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

function runMonitoring (db) {
    var Report = db.model('Report');
    var rule = new schedule.RecurrenceRule();
    //rule.hour = 1;
    rule.second  = 1;

    rule.minute = new schedule.Range(1);

        SCHEDULE_JOB_RULE = schedule.scheduleJob("*/2 * * *", function () {

            console.log('...');

            Report
                .find()
                .lean()
                .exec(function (err, models) {
                    if (err) {
                        console.error(err);
                    }

                    if (models && models.length) {
                        var str = '';
                        for (var i = models.length - 1; i >= 0; i--) {
                            var model = models[i];
                            var department = model.department && model.department.name ;
                            var speciality = model.speciality && model.speciality.name ;
                            str += '<div> <h3>Кафедра: ' + department + '</h3>' +
                                '<h3>Спеціальність: ' +speciality + '</h3> </div>' +
                                    ' <div> <b>Курс: </b> <span>' + model.course + '</span> ' +
                                    '<b>Аудиторія: </b> <span>' + model.room + '</span> ' +
                                    '<b>Пара: </b> <span>' + model.couple + '</span> ' +
                                    '<b>Група: </b> <span>' + model.couple + '</span> ' +
                                    '<b>Кількість студентів: </b> <span>' + 10 + '</span> ' +
                                    '<b>Предмет: </b> <span>' + model.subject + '</span> ' +
                                    '<b>Тема: </b> <span>' + model.topic + '</span> ' +
                                    '<b>Викладач: </b> <span>' + model.teacher || '' + '</span> ' +
                                    '</div>';
                        }

                        prepareCreateAccountEmail(str, function (result) { });
                    }
                });
        });
}

module.exports = runMonitoring;