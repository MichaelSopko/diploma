"use strict";

var express = require('express');
var router = express.Router();
var StudentsHandler = require('../handlers/students');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var studentsHandler = new StudentsHandler(db);
    var session = new SessionHandler(db);

    router.route('/').get(session.isAuthenticatedUser, studentsHandler.getAll);

    return router;
};