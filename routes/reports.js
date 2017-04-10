"use strict";

var express = require('express');
var router = express.Router();
var ReportsHandler = require('../handlers/reports');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var reportsHandler = new ReportsHandler(db);
    var session = new SessionHandler(db);

    router.route('/').get(session.isAuthenticatedUser, reportsHandler.getAll);
    router.route('/').post(session.isAuthenticatedUser, reportsHandler.create);

    return router;
};