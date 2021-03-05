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
                                    if(typeof serving === 'undefined'){
                                        serving = 'no data';
                                    }
                                    if(typeof calories === 'undefined'){
                                        calories = 0;
                                    }
                                    //values= [location, menu_time, food, serving, calories];
                                    db.query(`CALL sendMenu(?, ?, ?, ?, ?)`, [location, menu_time, food, serving, calories],
                                    function (err, result){
                                        if (err){
                                            return res.status(500).send(err);
                                        }
                                    });
                                    console.log("Values inserted");
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
}
module.exports=router;