var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var path = require('path');
//TODO change NODE_ENV for production server
process.env.NODE_ENV = 'development';

//development only
if (process.env.NODE_ENV === 'production') {
    console.log('-----Server start success in Production version--------');
    require('../config/production');

} else {
    console.log('-----Server start success in Development version--------');
    require('../config/development');
}

var app = express();
var server = http.createServer(app);
var schema;
var db;

mongoose.connect(process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME);
db = mongoose.connection;
mongoose.Promise = Promise;

db.on('error', function() {
    console.error.bind(console, 'connection error:');
    console.log('Database connection error');
    process.exit();
});

require('../models/index')(db);
schema = require('./schema')(db);

app.get('/', function (req, res, next) {
    res.sendfile(path.join(__dirname, 'index.html'));
});

app.get('/databases/createStudents', function (req, res) {
    schema.createStudents(function (err) {
        if (err) {
            return res.send(err);
        }

        res.send('<b>Create Take Success</b>');
    });
});

app.get('/databases/createTeachers', function (req, res) {
    schema.createTeachers(function (err) {
        if (err) {
            return res.send(err);
        }

        res.send('<b>Create Take Success</b>');
    });
});

app.get('/databases/createDepartments', function (req, res) {
    schema.createDepartments(function (err) {
        if (err) {
            return res.send(err);
        }

        res.send('<b>Create Take Success</b>');
    });
});

app.get('/databases/drop', function (req, res) {
    schema.drop(function (err) {
        if (err) {
            return res.send(err);
        }

        res.send('<b>Drop Take Success</b>');
    });
});

db.once('open', function() {
    console.log("Connection to " + process.env.DB_NAME + " is success");

    server.listen(3000, function () {
        console.log("Express server listening on port " + 3000);
    });
});
