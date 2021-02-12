var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var router = function (app, db) {
    
    //Click camera button, go to camera page (upload.ejs)
    app.get('/upload', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/upload');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click menu button, go to dining hall menu suggestion page (menu.ejs)
    app.get('/menu', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/menu');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click store button, go to store page (store.ejs)
    app.get('/store', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/store');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click stats button, go to stats page (stats.ejs)
    app.get('/stats', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/stats');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click info button, go to info page (info.ejs)
    app.get('/info', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/info');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click points button, go to points page (points.ejs)
    app.get('/points', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/points');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

    //Click back button, go to home page (home.ejs)
    app.get('/home', function(request, response) {
		if (request.session.loggedin) {
			response.render('pages/home');
		} else {
			response.send('Please login to view this page!');
		}
		response.end();
	});

}
module.exports=router;