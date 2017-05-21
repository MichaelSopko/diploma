'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var SubjectSchema = new Schema({
        name   : {type: String},
        departmentId: {
            type: ObjectId,
            rel: 'Department'
        },
        classId     : {
            type: ObjectId,
            rel: 'Class'
        },
        courseId     : {
            type: ObjectId,
            rel: 'Course'
        },
        groupId     : {
            type: ObjectId,
            rel: 'Group'
        },
        date: {type: Date, default: Date.now},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {collection: 'Subject'});

    db.model('Subject', SubjectSchema);
};