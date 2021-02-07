var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var router = function (app,db) {
app.use(session({
	secret: 'secret', //tutorial said to change this, but to what??
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


//Display Login page at beginning
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.ejs'));
});

//Post request to check db for first name & password combo
app.post('/auth', function(request, response) {
	// console.log("beginning of post");
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
        // console.log("inside first && pass");
		db.query('SELECT * FROM `User Info` WHERE `Username` = ? AND `Password` = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/index');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//Go to home page (camera page for now!!) after logging in
app.get('/index', function(request, response) {
	if (request.session.loggedin) {
        response.render('pages/index');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/signup', function (request, response) {
	response.render('pages/signup');
	response.end();
});
}
module.exports=router;

//app.listen(8080);