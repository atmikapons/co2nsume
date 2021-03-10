var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const {spawnSync} = require('child_process');
const fs = require('fs');

var app = express();
var router = function (app, db) {
    
    app.post('/getMenu', function(req, res){
        db.query("DELETE FROM `Rutgers_Menu`", function (err, result){
            if (err) {
                return res.status(500).send(err);
            }
        });

        const py = spawnSync('python', ['scrape.py', `--fancy`, `--dicts`],{
			cwd: process.cwd(),
			env: process.env,
			stdio: 'pipe',
			encoding: 'utf-8'
		})
        let mydata = JSON.parse(fs.readFileSync('output.json', 'utf-8'));
        let location = 'Busch';
        let menu_time = '';
        let food = '';
        let serving = '';
        let calories = 0;
        let genre_name = '';
        Object.keys(mydata['Busch Dining Hall']).forEach(function(key){
            Object.keys(mydata['Busch Dining Hall'][key]).forEach(function(key2){
                if(key2 === 'genres'){
                    Object.keys(mydata['Busch Dining Hall'][key][key2]).forEach(function(key3){
                        Object.keys(mydata['Busch Dining Hall'][key][key2][key3]).forEach(function(key4){
                            if(key4 === 'items'){
                                Object.keys(mydata['Busch Dining Hall'][key][key2][key3][key4]).forEach(function(key5){
                                    menu_time = mydata['Busch Dining Hall'][key]['meal_name'];
                                    food = mydata['Busch Dining Hall'][key][key2][key3][key4][key5]['name'];
                                    serving = mydata['Busch Dining Hall'][key][key2][key3][key4][key5]['serving'];
                                    calories = mydata['Busch Dining Hall'][key][key2][key3][key4][key5]['calories'];
                                    genre_name = mydata['Busch Dining Hall'][key][key2][key3]['genre_name'];
                                    var carbon_emissions = getCarbonEstimate(genre_name, calories);
                                    if(typeof serving === 'undefined'){
                                        serving = 'no data';
                                    }
                                    if(typeof calories === 'undefined'){
                                        calories = 0;
                                    }
                                    db.query(`CALL sendMenu(?, ?, ?, ?, ?, ?)`, [location, menu_time, food, serving, calories, carbon_emissions],
                                    function (err, result){
                                        if (err){
                                            return res.status(500).send(err);
                                        }
                                    });
                                })
                            }
                        })
                    })
                }
            })
        });
    res.render('pages/getMenu');
    });
    app.get('/menu', function(req, res){
        if(req.session.loggedin){
            res.render('pages/menu');
        } else {
            res.send('Please login to view page');
            res.end();
        }
    });
    function getCarbonEstimate (genre_name, calories){
        let parsedCalories = parseFloat(calories);
        let carbon_sum = 0;
        if(genre_name == 'BREAKFAST MEATS' || genre_name == 'ENTREES' || genre_name == 'COOK TO ORDER'){
            carbon_sum = (parsedCalories * 2.38).toFixed(2);
        }
        else if(genre_name == 'BREAKFAST ENTREES'){
            carbon_sum = (parsedCalories * 3.06).toFixed(2);
        }
        else if(genre_name == 'BREAKFAST BAKERY' || genre_name == 'BAKERY MISC'){
            carbon_sum = (parsedCalories * 0.64).toFixed(2);
        }
        else if(genre_name == 'SOUPS' || genre_name == 'VEGGIES' || genre_name == 'STARCH &  POTATOES' || genre_name == 'BREAKFAST MISC'){
            carbon_sum = (parsedCalories * 1.39).toFixed(2);
        }
        else{
            carbon_sum = (parsedCalories * 2.17).toFixed(2);
        }

        return carbon_sum;
    }
}
module.exports=router;