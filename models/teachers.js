'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var TeacherSchema = new Schema({
        firstName: {type: String},
        lastName : {type: String},
        email    : {type: String},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {collection: 'Teacher'});

    db.model('Teacher', TeacherSchema);
};