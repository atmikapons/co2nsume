var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const {spawnSync} = require('child_process');
const fs = require('fs');

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
			const ruMenu = new Promise(function(resolve, reject) {
				db.query('SELECT CONVERT(DATE_FORMAT(Timestamp, "%m/%d"),CHAR) AS `Day`, `Location` AS `Dining_Hall`, `Meal_Time` AS `Meal_Type`, `Meal_Name` AS `Meal`, `Serving` AS `Serving_Size`, `Calories` AS `Meal_Calories`, `Carbon_Sum` AS `Carbon` FROM `Rutgers_Menu` ORDER BY Carbon ASC', function(err, rows) {
					if (err) {
						resolve(null);
					}
					else {
						resolve (rows);
					}
				});
			});
			ruMenu.then(function(rows){
				console.log(rows);
				response.render('pages/menu', {rM:rows});
				response.end();
			})
		} else {
			response.send('Please login to view this page!');
			response.end();
		}
	});

    //Click food log button, go to food log page (foodlog.ejs)
    app.get('/foodlog', function(request, response) {
		if (request.session.loggedin) {
			const userFoodLog = new Promise(function(resolve, reject) {
				db.query('SELECT CONVERT(DATE_FORMAT(Timestamp,"%m/%d"),CHAR) AS `Day`, `Food_Recognized` AS `Food`, `Carbon_Sum` AS `Carbon_Emissions` FROM `Food Log` WHERE username="'+request.session.username+'" ORDER BY Day DESC', function (err, rows) {
					if (err) {
						resolve(null); 
					} 
					else {
						resolve(rows);
					}
				});
			});
			userFoodLog.then(function(rows){
				console.log(rows);
				response.render('pages/foodlog', {fL:rows});
				response.end();
			});
		} else {
			response.send('Please login to view this page!');
			response.end(); //must be in the else bc "cannot set headers after sent to client"
		}
		
	});

    //Click stats button, go to stats page (stats.ejs)
    app.get('/stats', function(request, response) {
		if (request.session.loggedin) {
			const CO2perWeek = new Promise(function(resolve, reject) {
				db.query('SELECT CONVERT(DATE_FORMAT(Timestamp,"%m/%d"),CHAR) AS `Day`, SUM(Carbon_Sum) AS `Sum` FROM `Food Log` WHERE username="'+request.session.username+'" AND Timestamp BETWEEN (CURDATE() - INTERVAL 1 WEEK) AND CURDATE() GROUP BY Day ORDER BY Day', function (err, rows) {
					if (err) {
						resolve(null); 
					} 
					else {
						resolve(rows);
					}
				});
			});
			CO2perWeek.then(function(rows){
				console.log(rows);
				response.render('pages/stats', {CbyW:rows});
				response.end();
			});
		} else {
			response.send('Please login to view this page!');
			response.end();
		}
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
