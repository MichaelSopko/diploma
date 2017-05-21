'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var ScheduleSchema = new Schema({
        teacherId: {
            type: ObjectId,
            rel: 'Teacher'
        },
        subjectId     : {
            type: ObjectId,
            rel: 'Subject'
        },
        dayOfWeek  : {type: String},
        parity     : {type: String},
        dateOfStart: {type: Date, default: Date.now},
        dateOfEnd  : {type: Date, default: Date.now},
        time       : {type: Date, default: Date.now},
        duration   : {type: Date, default: Date.now},
        createdAt  : {type: Date, default: Date.now},
        updatedAt  : {type: Date, default: Date.now}
    }, {collection: 'Schedule'});

    db.model('Schedule', ScheduleSchema);
};