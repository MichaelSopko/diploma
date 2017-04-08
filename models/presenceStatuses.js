'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var PresenceStatusSchema = new Schema({
        teacherId: {
            type: ObjectId,
            rel: 'Teacher'
        },
        studentId: {
            type: ObjectId,
            rel: 'Student'
        },
        scheduleId: {
            type: ObjectId,
            rel: 'Schedule'
        },
        classId  : {
            type: ObjectId,
            rel: 'Class'
        },
        lessonId  : {
            type: ObjectId,
            rel: 'Lesson'
        },
        status         : {type: String},
        additionalInfo : {type: String},
        late           : {type: String},
        reasonOfChanges: {type: String},
        date           : {type: Date, default: Date.now},
        createdAt      : {type: Date, default: Date.now},
        updatedAt      : {type: Date, default: Date.now}
    }, {collection: 'PresenceStatus'});

    db.model('PresenceStatus', PresenceStatusSchema);
};