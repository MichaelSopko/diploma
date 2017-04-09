'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;

    var SpecialtySchema = new Schema({
        name        : {type: String},
        departmentId: {
            type: ObjectId,
            rel: 'Department'
        },
        imageUrl    : {type: String}
    }, {collection: 'Specialty'});

    db.model('Specialty', SpecialtySchema);
};