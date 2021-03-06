"use strict";

var logWriter = require('../modules/logWriter')();
var path = require('path');

module.exports = function (app, db) {
    var usersRouter = require('./users')(db);
    var departmentsRouter = require('./departments')(db);
    var specyalitiesRouter = require('./specyalities')(db);
    var studentsRouter = require('./students')(db);
    var reportsRouter = require('./reports')(db);
    var json = require('json-update');
    var runBots = require('../helpers/monitoring');
    runBots(db);

    app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, '../app/index.html'));
    });

    app.use('/users', usersRouter);
    app.use('/departments', departmentsRouter);
    app.use('/specialties', specyalitiesRouter);
    app.use('/students', studentsRouter);
    app.use('/reports', reportsRouter);

    app.use('/save', function (req, res, next) {
        json.update('public/subjects.json', req.body)
            .then(function(dat) {
                res.send('jjh');
            });
    });

    function notFound(req, res, next){
        next();
    }

    function errorHandler(err, req, res, next) {
        var status = err.status || 500;

        if (process.env.NODE_ENV === 'production') {
            if (status === 404 || status === 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }
            res.status(status).send({error: err.message});
        } else {
            if (status !== 401) {
                logWriter.log('', err.message + '\n' + err.stack);
            }

            res.status(status).send({error: err.message});
        }

        if (status === 401) {
            console.warn(err.message);
        } else {
            console.error(err.message);
            console.error(err.stack);
        }
    }

    app.use( notFound );
    app.use( errorHandler );

};