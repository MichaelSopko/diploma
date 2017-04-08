'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var UserSchema = new Schema({
        userName : {type: String},
        password : {type: String},
        studentId: {
            type: ObjectId,
            rel: 'Student'
        },
        teacherId: {
            type: ObjectId,
            rel: 'Teacher'
        },
        classId  : {
            type: ObjectId,
            rel: 'Class'
        },
        role: {
            type: String,
            enum: ['Admin', 'User']
        },
        email: {
            type    : String,
            required: true,
            unique  : true
        },
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {collection: 'Users'});

    db.model('User', UserSchema);
};