const express = require('express');
const mysql = require('mysql');
const http = require('http');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

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

const routes = require('./routes/app.js')(app);
const httpServer = http.createServer(app);
httpServer.listen(8080); // can change port

module.exports = app; // can be useful when testing