'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ClassSchema = new Schema({
        name   : {type: String},
        course : {type: String},
        faculty: {type: String}
    }, {collection: 'Class'});

    db.model('Class', ClassSchema);
};