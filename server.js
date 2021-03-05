const express = require('express');
const mysql = require('mysql');
const https = require('https');
const http = require('http');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json()); // parse form data client
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

//database connection--NEEDS TO BE ADDED IN
let db = mysql.createConnection({
    // ssl        : false,
    // secureAuth : true,
    host: '127.0.0.1', // local host
    user: 'consume',
    password: 'cap@21stone',
    database: 'co2nsume'
});


db.connect( function (err) {
    if ( err ) throw err;
    console.log('DB connected!');
});

const routes = require('./routes/app.js')(app,db);
const routes2 = require('./routes/login.js')(app,db); //for extra routing js files (login)
const routes3 = require('./routes/signup.js')(app, db); //for extra routing js files (signup)
const routes4 = require('./routes/home.js')(app, db); //for extra routing js files (home)
const routes5 = require('./routes/getMenu.js')(app, db); //for extra routing js files (get menu)

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };


const httpServer = http.createServer(app);
httpServer.listen(8000); // port for http server

const httpsServer = https.createServer(options, app);
httpsServer.listen(8080); // port for https server

module.exports = app; // can be useful when testing
module.exports.dbName=db; //for extra routing js files (login)
