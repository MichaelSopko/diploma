"use strict";

var express = require('express');
var http = require('http');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')( session );

var app = express();
var httpServer;
var mainDb;
var connectOptions;

require('./config/development');

app.set('port', process.env.PORT || 7878);
httpServer = http.createServer(app);

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json({strict: false, limit: 1024 * 1024 * 200}));
app.use(bodyParser.urlencoded({extended: false}));

connectOptions = {
    db: {native_parser: false},
    server: {poolSize: 5},
    w: 1,
    j: true
};

mongoose.connect(process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME, connectOptions);
mainDb = mongoose.connection;
mongoose.Promise = Promise;

mainDb.on('error', function() {
    console.error.bind(console, 'connection error:');
    console.log('Database connection error');
    process.exit();
});

require('./models/index')(mainDb);
app.set('db', mainDb);

mainDb.once('open', function() {
    console.log("Connection to " + process.env.DB_NAME + " is success");

    app.use(session({
        secret: '5532',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mainDb }),
        cookie  : { maxAge  : new Date(Date.now() + (5 * 8760 * 60 * 60 * 1000))}
    }));

    require('./routes/index')(app, mainDb);

    httpServer.listen(app.get('port'), function () {
        console.log('Server listening on: ' + process.env.HOST + ':' + app.get('port'));
    });
});
