"use strict";

var crypto = require('crypto');
var async = require('async');
var RESPONSE = require('../constants/response');
var logWriter = require('../modules/logWriter')();
var SessionHandler = require('./sessions');

var User = function (db) {
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var User = db.model('User');
    var Student = db.model('Student');
    var Teacher = db.model('Teacher');
    var mailer = require('../helpers/mailer');
    var session = new SessionHandler(db);
    var passRegExp = /^[0-9A-Za-z]{6,24}$/;
    var nameRegExp = /[a-zA-Z]/;
    var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    createDefaultAdmin();

    function getEncryptedPass(pass) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(pass);
        return shaSum.digest('hex');
    }

    function generateConfirmToken() {
        var randomPass = require('../helpers/randomPass');

        return randomPass.generate();
    }

    function prepareCreateAccountEmail(model, pass, callback) {
        var templateName = 'public/templates/mail/notification.html';
        var from = 'Decanat';

        var mailOptions = {
            from        : from,
            mailTo      : model.email,
            title       : 'Account created',
            templateName: templateName,
            templateData: {
                data: {
                    notification: 'Hi. Account created. User name: ' + model.userName + '  \u000A Password: ' + pass
                }
            }
        };

        mailer.sendReport(mailOptions, callback);
    }

    function createDefaultAdmin() {
        //TODO change email on real email from customer in Production version
        User.findOne({userName: process.env.SUPERADMIN_NAME}, function (err, model) {
                var admin;
                var pass;

                if (err) {
                    logWriter.log('createDefaultAdmin-> findOne->' + err);
                    return;
                }

                pass = (generateConfirmToken()).slice(0, 6);

                admin = new User({
                    userName: process.env.SUPERADMIN_NAME,
                    role: 'Admin',
                    password: getEncryptedPass(pass),
                    email: process.env.SUPERADMIN_EMAIL
                });

                if (!model) {
                    admin
                        .save(function (err, user) {
                            if (err) {
                                logWriter.log('createDefaultAdmin-> save->' + err);
                                return;
                            }
                            if (user) {
                                console.log('Account Created');

                                prepareCreateAccountEmail(user.toJSON(), pass, function (err, result) {
                                    if (err) {
                                        logWriter.log('createDefaultAdmin-> prepareCreateAdminEmail->' + err);
                                        return;
                                    }

                                    console.log('Default password was sending on email');
                                });
                            }
                        });
                }
            });
    }

    this.getAll = function (req, res, next) {
        User
            .find()
            .exec(function (err, models) {
                if (err) {
                    return next()
                }

                res.status(200).send(models);
            });
    };

    function findStudent(ticketNumber, cb) {
        Student
            .findOne({ticketNumber: ticketNumber})
            .exec(function (err, model) {
                if (err) {
                    return cb(err)
                }

                if (!model) {
                    return cb(new Error(RESPONSE.ON_ACTION.NOT_FOUND_USER));
                }

                cb(null, model._id);
            });
    }

    function findTeacher(email, cb) {
        Teacher
            .findOne({email: email})
            .exec(function (err, model) {
                if (err) {
                    return cb(err)
                }

                if (!model) {
                    return cb(new Error(RESPONSE.ON_ACTION.NOT_FOUND_USER));
                }

                cb(null, model._id);
            });
    }

    this.createUser = function (req, res, next) {
        var options = req.body || {};
        var userName = options.userName;
        var ticketNumber = options.ticketNumber;
        var email = options.email;
        var userType = options.userType;
        var pass = options.password; //(generateConfirmToken()).slice(0, 6);
        var user;
        var studentId = null;
        var teacherId = null;

        if (!options || !userName || !userType || !email || (userType === 'student' && !ticketNumber)) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!passRegExp.test(pass)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_PASS});
        }

        if (!nameRegExp.test(userName)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_NAME});
        }

        if (!emailRegExp.test(email)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_EMAIL});
        }

        async.waterfall([
            function (cb) {
                if (userType === 'student') {
                    findStudent(ticketNumber, function (err, id) {
                        if (err) {
                            return cb(err)
                        }

                        studentId = id;
                        cb();
                    });
                } else if (userType === 'teacher') {
                    findTeacher(email, function (err, id) {
                        if (err) {
                            return cb(err)
                        }

                        teacherId = id;
                        cb();
                    })
                } else {
                    cb({error: RESPONSE.ON_ACTION.NOT_FOUND_USER})
                }
            }
        ], function (err) {
            if (err) {
                return next(err)
            }

            user = new User({
                userName : userName,
                role     : 'User',
                password : getEncryptedPass(pass),
                studentId: studentId,
                teacherId: teacherId,
                email    : email
            });

            user
                .save(function (err, model) {
                    if (err) {

                        if (err.code === 11000) {
                            return res.status(500).send({error: RESPONSE.ON_ACTION.DUPLICATE_USER});
                        }

                        return next()
                    }

                    if (!model) {
                        return res.status(500).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
                    }

                    prepareCreateAccountEmail(model, pass, function (err, result) {
                        if (err) {
                            return next()
                        }

                        res.status(200).send(model);
                    });
                });
        });
    };

    this.signIn = function (req, res, next) {
        var options = req.body || {};
        var pass = options.password;
        var userName = options.userName;
        var rememberMe = options.rememberMe;

        if (!options || !userName || !pass) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (!passRegExp.test(pass)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_PASS});
        }

        User
            .findOne({userName: userName, password: getEncryptedPass(pass)})
            .exec(function (err, model) {
                if (err) {
                    return next()
                }

                if (!model) {
                    return res.status(400).send({error: RESPONSE.AUTH.INVALID_CREDENTIALS});
                }

                return session.register(req, res, model, rememberMe);
            });
    };

    this.authenticated = function (req, res, next) {
        User.findOne({_id: ObjectId(req.session.uId)})
            .lean()
            .exec(function (err, user) {
                if (!user) {
                    return session.killWithUnAuthenticated(req, res, next);
                }

                return res.status(200).send({
                    data: {
                        userName: user.userName,
                        role    : req.session.role,
                        type    : user.teacherId ? 'teacher' : 'student'
                    }
                });
            });
    };

    this.editUser = function (req, res, next) {
        var options = req.body || {};
        var userId = req.params.id;
        var userName = options.userName;
        var role = options.role;
        var email = options.email;
        var pass = options.password;
        var updateObj = {};

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({error: "Bad user ID"});
        }

        if (!options) {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (userName && !nameRegExp.test(userName)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_NAME});
        }

        if (email && !emailRegExp.test(email)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_EMAIL});
        }

        if (role && role !== 'Admin' && role !== 'User') {
            return res.status(400).send({error: RESPONSE.NOT_ENOUGH_PARAMS});
        }

        if (role && (!req.session || req.session.role !== 'Admin')) {
            return res.status(403).send({error: RESPONSE.NOT_ALLOW_FOR_ROLE});
        }

        if (pass && !passRegExp.test(pass)) {
            return res.status(400).send({error: RESPONSE.NOT_VALID_PASS});
        }

        if (!req.session || userId !== req.session.userId || user.role !== 'Admin') {
            return res.status(403).send({error: RESPONSE.NOT_ALLOW_FOR_ROLE});
        }

        if (pass) {
            updateObj.password = getEncryptedPass(pass);
        }

        if (userName) {
            updateObj.userName = userName;
        }

        if (role) {
            updateObj.role = role;
        }

        if (email) {
            updateObj.userName = email;
        }

        User.findByIdAndUpdate(userId, updateObj, {}, function (err, model) {
            if (err) {
                return next(err)
            }

            if (!model) {
                return res.status(500).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
            }

            res.status(200).send(model);
        });
    };

    this.deleteUser = function (req, res, next) {
        var userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).send({error: "Bad user ID"});
        }

        User.findOne({_id: ObjectId(userId)})
            .lean()
            .exec(function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(404).send({error: RESPONSE.ON_ACTION.NOT_FOUND});
                }

                if (user._id !== req.session.userId || user.role !== 'Admin') {
                    return res.status(403).send({error: RESPONSE.NOT_ALLOW_FOR_ROLE});
                }

                User
                    .findByIdAndRemove(userId)
                    .exec(function (err, result) {
                        if (err) {
                            return next(err);
                        }

                        return res.status(200).send({success: RESPONSE.ON_ACTION.SUCCESS});
                    });
            });
    };

    this.signOut = function (req, res, next) {
        return session.kill(req, res, next);
    };

};

module.exports = User;