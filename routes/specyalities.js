"use strict";

var express = require('express');
var router = express.Router();
var SpecialtiesHandler = require('../handlers/specialty');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var specialtiesHandler = new SpecialtiesHandler(db);
    var session = new SessionHandler(db);

    router.route('/').get(session.isAuthenticatedUser, specialtiesHandler.getAll);
    router.route('/:id').get(session.isAuthenticatedUser, specialtiesHandler.getOne);

    return router;
};