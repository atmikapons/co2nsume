var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var router = function (app, db) {

    //post request for signup page
    app.post('/sign', function (req, res) {
        let username = req.body.username;
        db.query('SELECT * FROM `User Info` WHERE `Username` = ? ', [username], function(error, results, fields) {
            if (results.length > 0) {
                res.send("Username already in use");
                res.end();
            }
        });
        let first = req.body.first;
        let last = req.body.last;
        let password = req.body.password;
        let values = [[username, first, last, password, 0]];
        if (username && first && last && password) {
            let addQuery = "INSERT INTO `User Info` (Username, First, Last, Password, Carbon) VALUES ?";
            db.query(addQuery, [values], function (err, result) {
                if (err) {
                    return res.status(500).send(err);
                }
                else {
                    req.session.loggedin = true;
					req.session.username = username;
					res.redirect('/login');
                }
            });
        }
        else {
            res.send("Please fill ALL fields");
            res.end();
        }
    });
}
module.exports = router;