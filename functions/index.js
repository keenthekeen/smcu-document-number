"use strict";
exports.__esModule = true;
var functions = require("firebase-functions");
var firebase = require("firebase-admin");
firebase.initializeApp(functions.config().firebase);
exports.submit = functions.https.onRequest(function (req, res) {
    if (req.method.toLowerCase() !== 'post') {
        if (req.method.toLowerCase() !== 'options') {
            res.status(405);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200);
        }
        res.end();
    }
    else {
        var data = req.body;
        var name_1 = data.name;
        var divisionId_1 = data.divisionId;
        var year_1 = data.year;
        var category_1 = data.category;
        var uid_1 = data.uid;
        var nextNumberRef_1 = firebase.database().ref("data/documents/" + year_1 + "/" + category_1 + "/nextNumber");
        nextNumberRef_1.once('value').then(function (_nextNumber) {
            var nextNumber = _nextNumber.val();
            if (!nextNumber) {
                nextNumber = 1;
            }
            return nextNumber;
        }).then(function (nextNumber) {
            return nextNumberRef_1.set(nextNumber + 1).then(function () { return nextNumber; });
        }).then(function (nextNumber) {
            return firebase.database().ref("data/users/" + uid_1).once('value').then(function (_v) {
                var v = _v.val();
                return firebase.database().ref("data/divisions/" + divisionId_1).once('value').then(function (_d) {
                    var d = _d.val();
                    return firebase.database().ref("data/documents/" + year_1 + "/" + category_1 + "/documents").push({
                        number: nextNumber,
                        name: name_1,
                        user: v,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        division: d
                    });
                });
            });
        }).then(function () {
            res.status(200);
            res.end();
        });
    }
});
