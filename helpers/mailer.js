"use strict";

module.exports = new function () {
    var nodemailer = require('nodemailer');
    var sgTransport = require('nodemailer-sendgrid-transport');
    var _ = require('../public/bower_components/underscore/underscore-min.js');
    var fs = require('fs');

    require('../config/development');

    this.sendReport = function (options, callback) {
        var encoding = 'utf8';

        var mailOptions = {
            from: options.from,
            to: options.mailTo,
            subject: options.title,
            html: _.template(fs.readFileSync(options.templateName, encoding))(options.templateData)
        };

        deliver(mailOptions, callback);
    };

    function deliver(mailOptions, callback) {

        var authOptions = {
            auth: {
                api_user: process.env.MAIL_USERNAME,
                api_key: process.env.MAIL_PASSWORD
            }
        };

        var mailerClient = nodemailer.createTransport(sgTransport(authOptions));

        mailerClient.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.error('Email did not send: ' + err);
                if (callback && typeof callback === 'function') {
                    callback(err, null);
                }
                return;
            }

            console.log('Email sent: ', response);
            if (callback && typeof callback === 'function') {
                callback(null, response);
            }
        });
    }
};

