var RESPONSE = require('../constants/response');

var Session = function (db) {
    'use strict';

    this.register = function (req, res, userModel, rememberMe) {
        if (rememberMe) {
            req.session.rememberMe = true;
            req.session.cookie.expires = false;
            req.session.cookie.maxAge = 1000 * 3600 * 24 * 365 * 5; //5 year
        } else {
            req.session.rememberMe = false;
            req.session.cookie.expires = new Date(Date.now() + 60000);
            req.session.cookie.maxAge = 60000 * 60 * 24;
        }

        req.session.loggedIn = true;
        req.session.uId = userModel._id;
        req.session.userName = userModel.userName;
        req.session.role = userModel.role;
        req.session.type = userModel.teacherId ? 'teacher' : 'student';

        res.status(200).send({
            success: RESPONSE.AUTH.LOG_IN,
            data   : {
                userName: userModel.userName,
                role    : userModel.role,
                userId  : userModel._id,
                type    : userModel.teacherId ? 'teacher' : 'student'
            }
        });
    };

    this.adminRegister = function (req, res, userId, userType, login) {
        req.session.loggedIn = true;
        req.session.uId = userId;
        req.session.type = userType;

        res.status(200).send({login: login});
    };

    this.kill = function (req, res, next) {
        if (req.session) {
            req.session.destroy();
        }

        res.redirect('/');
    };

    this.killWithUnAuthenticated = function (req, res, next) {
        if (req.session) {
            req.session.destroy();
        }
        res.status(403).send({error: RESPONSE.AUTH.UN_AUTHORIZED});
    };

    this.isAdmin = function (req, res, next) {
        var err;

        if (req.session && req.session.role === 'Admin') {
            console.log('Session: role:', req.session.role ,'  ID: ', req.session.uId, '  NAME: ', req.session.userName );
            return next();
        }

        err = new Error(RESPONSE.AUTH.NO_PERMISSIONS);
        err.status = 403;
        return next(err);
    };

    this.isAuthenticatedUser = function (req, res, next) {
        var err;
        if (req.session && req.session.uId && req.session.loggedIn) {

            return next();
        } else {
            err = new Error('UnAuthorized');
            err.status = 401;
            return next(err);
        }
    };
};

module.exports = Session;