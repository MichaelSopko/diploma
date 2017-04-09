"use strict";

module.exports = function (db) {
    require('./users')(db);
    require('./students')(db);
    require('./teachers')(db);
    require('./lessons')(db);
    require('./classes')(db);
    require('./presenceStatuses')(db);
    require('./messages')(db);
    require('./schedules')(db);
    require('./departments')(db);
};