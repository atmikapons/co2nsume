var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var router = function (app, db) {

    //post request for signup page
    app.post('/signup', function (req, res) {
        let username = req.body.username;
        let first = req.body.first;
        let last = req.body.last;
        let password = req.body.password;
        let values = [[username, first, last, password]];
        if (username != '' || first != '' || last != '' || password != '') {
            let addQuery = "INSERT INTO `User Info` (Username, First, Last, Password) VALUES ?";
            db.query(addQuery, [values], function (err, result) {
                if (err) {
                    return res.status(500).send(err);
                }
                else {
                    return res.status(200).send({
                        'status': "Success",
                    });
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