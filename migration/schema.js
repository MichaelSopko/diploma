"use strict";

module.exports = function (db) {
    var fs = require('fs');
    var Student = db.model('Student');
    var Teacher = db.model('Teacher');
    var Department = db.model('Department');
    var Specialty = db.model('Specialty');
    var async = require('async');

    function createStudents(callback) {
        fs.readFile(__dirname + '/data/students.json', function (err, result) {
            var data = JSON.parse(result).data;
            var student;

            async.each(data, function (item, eachCb) {
                student = new Student({
                    ticketNumber: item.ticketNumber,
                    firstName: item.firstName,
                    lastName: item.lastName
                });

                student.save(function (err) {
                    eachCb(err);
                });
            }, function (err) {
                callback(err);
            });
        });
    }

    function createTeachers(callback) {
        fs.readFile(__dirname + '/data/teachers.json', function (err, result) {
            var data = JSON.parse(result).data;
            var teacher;

            async.each(data, function (item, eachCb) {
                teacher = new Teacher({
                    email: item.email
                });

                teacher.save(function (err) {
                    eachCb(err);
                });
            }, function (err) {
                callback(err);
            });
        });
    }

    function createDepartments(callback) {
        fs.readFile(__dirname + '/data/departments.json', function (err, result) {
            var data = JSON.parse(result).data;
            var department;

            async.each(data, function (item, eachCb) {
                department = new Department({
                    name    : item.name,
                    imageUrl: item.imageUrl
                });

                var specialties = item.specialties;

                department.save(function (err, res) {

                    async.each(specialties, function (el, innerCb) {
                        var specialty = new Specialty({
                            name    : el.name,
                            imageUrl: el.imageUrl,
                            departmentId: res._id
                        });

                        specialty.save(function () {
                            innerCb();
                        });
                    }, function (err) {
                        eachCb(err);
                    });

                });
            }, function (err) {
                callback(err);
            });
        });
    }

    function drop(callback) {
        Student.remove()
            .exec(function (err) {
                if (err) {
                    return callback(err);
                }

                Teacher.remove()
                    .exec(function (err) {
                        if (err) {
                            return callback(err);
                        }
                        Department.remove()
                            .exec(function (err) {
                                if (err) {
                                    return callback(err);
                                }
                                Specialty.remove()
                                    .exec(function (err) {
                                        if (err) {
                                            return callback(err);
                                        }
                                        callback(err);
                                    });
                            });
                    });
            });

    }

    return {
        createStudents   : createStudents,
        createTeachers   : createTeachers,
        createDepartments: createDepartments,
        drop             : drop
    }
};