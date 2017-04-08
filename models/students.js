'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var StudentSchema = new Schema({
        firstName   : {type: String},
        lastName    : {type: String},
        ticketNumber: {type: String},
        classId     : {
            type: ObjectId,
            rel: 'Class'
        },
        email    : {type: String},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now}
    }, {collection: 'Student'});

    db.model('Student', StudentSchema);
};