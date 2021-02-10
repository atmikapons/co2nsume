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
}
module.exports=router;
