"use strict";

var express = require('express');
var router = express.Router();
var DepartmentsHandler = require('../handlers/departments');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var departmentsHandler = new DepartmentsHandler(db);
    var session = new SessionHandler(db);

    router.route('/').get(session.isAuthenticatedUser, departmentsHandler.getAll);
    router.route('/:id').get(session.isAuthenticatedUser, departmentsHandler.getOne);
    router.route('/:id').post(session.isAdmin, departmentsHandler.create);
    router.route('/:id').put(session.isAdmin, departmentsHandler.update);
    router.route('/:id').delete(session.isAdmin, departmentsHandler.delete);

    return router;
};