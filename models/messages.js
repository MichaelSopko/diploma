'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var MessageSchema = new Schema({
        userId: {
            type: ObjectId,
            rel: 'User'
        },
        teacherId: {
            type: ObjectId,
            rel: 'Teacher'
        },
        studentId: {
            type: ObjectId,
            rel: 'Student'
        },
        classId  : {
            type: ObjectId,
            rel: 'Class'
        },
        name     : {type: String},
        message  : {type: String},
        status   : {type: String},
        priority : {type: String},
        type     : {type: String},
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'Message'});

    db.model('Message', MessageSchema);
};