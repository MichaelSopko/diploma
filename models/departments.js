'use strict';

module.exports = function (db) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var DepartmentSchema = new Schema({
        name    : {type: String},
        imageUrl: {type: String}
    }, {collection: 'Department'});

    db.model('Department', DepartmentSchema);
};