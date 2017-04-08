"use strict";

var express = require('express');
var router = express.Router();
var UsersHandler = require('../handlers/users');
var SessionHandler = require('../handlers/sessions');

module.exports = function (db) {
    var usersHandler = new UsersHandler(db);
    var session = new SessionHandler(db);

    router.post('/signIn', usersHandler.signIn);
    router.get('/signOut', usersHandler.signOut);

    router.get('/authenticated', session.isAuthenticatedUser, usersHandler.authenticated);

    router.route('/').get(/*session.isAuthenticatedUser,*/ usersHandler.getAll);
    router.route('/signUp').post(usersHandler.createUser);

    router.route('/:id').patch(session.isAuthenticatedUser, usersHandler.editUser);
    router.route('/:id').delete(session.isAuthenticatedUser, usersHandler.deleteUser);

    return router;
};