"use strict";

var express = require('express');
var router = express.Router();
var SubjectsHandler = require('../handlers/departments');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var subjectsHandler = new SubjectsHandler(db);
    var session = new SessionHandler(db);

    router.route('/').get(session.isAuthenticatedUser, subjectsHandler.getAll);
    router.route('/:id').get(session.isAuthenticatedUser, subjectsHandler.getOne);
    router.route('/:id').post(session.isAdmin, subjectsHandler.create);
    router.route('/:id').put(session.isAdmin, subjectsHandler.update);
    router.route('/:id').delete(session.isAdmin, subjectsHandler.delete);

    return router;
};