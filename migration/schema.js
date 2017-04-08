"use strict";

module.exports = function (db) {
    var fs = require('fs');
    var Student = db.model('Student');
    var Teacher = db.model('Teacher');
    var async = require('async');

    function createStudents(callback) {
        fs.readFile(__dirname + '/data/students.json', function (err, result) {
            var data = JSON.parse(result).data;
            var student;

            async.each(data, function (item, eachCb) {
                student = new Student({
                    ticketNumber: item.ticketNumber
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

    function drop(callback) {
        Student.remove()
            .exec(function (err) {
                if (err) {
                    return callback(err);
                }

                Teacher.remove()
                    .exec(function (err) {
                        callback(err);
                    });
            });

    }

    return {
        createStudents: createStudents,
        createTeachers: createTeachers,
        drop          : drop
    }
};