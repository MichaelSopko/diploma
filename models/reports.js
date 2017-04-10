'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var ReportSchema = new Schema({
        department: {type: String},
        speciality: {type: String},
        course: {type: String},
        room: {type: String},
        couple: {type: String},
        subject: {type: String},
        topic: {type: String},
        teacher: {type: String},
        createdBy: {
            type: ObjectId,
            rel: 'User'
        },
        createdAt: {type: Date, default: Date.now}
    }, {collection: 'Report'});

    db.model('Report', ReportSchema);
};