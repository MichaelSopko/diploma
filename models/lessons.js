'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var LessonSchema = new Schema({
        teacherId: {
            type: ObjectId,
            rel: 'Teacher'
        },
        scheduleId: {
            type: ObjectId,
            rel: 'Schedule'
        },
        date     : {type: Date, default: Date.now},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {collection: 'Lesson'});

    db.model('Lesson', LessonSchema);
};