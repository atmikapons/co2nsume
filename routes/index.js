const express = require('express');
const multer = require('multer');
const path = require('path');
const {spawn} = require('child_process');
var router = function (app) {
    app.get('/', function (req, res) {
        //const python = spawn('python', ['yolov5/detect.py']);
        res.render('pages/index', {
        });
    });
    /* //code made before upload post method below--may not need anymore at all
    app.get('/detect', function(req, res) {
        // Call your python script here.
        // I prefer using spawn from the child process module instead of the Python shell
        const scriptPath = 'yolov5/detect.py'
        const process = spawn('python', [scriptPath])
        process.stdout.on('data', (myData) => {
            // Do whatever you want with the returned data.
            // ...
            res.send("Done!")
        })
        process.stderr.on('data', (myErr) => {
            // If anything gets written to stderr, it'll be in the myErr variable
        })
    })*/
    app.post('/upload', (req, res) => {
        const fs = require('fs');

        // // to detect only 1 image at a time, clear img directory
        fs.rmdirSync("./uploads", {recursive: true});
        //clear exp so that only newest detection is available
        fs.rmdirSync("./runs/detect/exp", {recursive: true});
        fs.mkdir(path.join('./', 'uploads'), (err) => { 
            if (err) { 
                return console.error(err); 
            } 
            //console.log('Directory created successfully!'); 
        }); 
        const storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, 'uploads/');
            },
        
            // By default, multer removes file extensions so let's add them back
            filename: function(req, file, cb) {
                cb(null, file.fieldname + path.extname(file.originalname));
            }
        });
        let upload = multer({ storage: storage}).single('photo');
    
        upload(req, res, function(err) {
            if (err) {
                return res.send(err);
            }
            const scriptPath = 'yolov5/detect.py'
            const process = spawn('python', [scriptPath])
        });
    });  
}
module.exports=router;
/*
app.get('/', (req, res) => {
res.render('index', {});
 var dataToSend;
 // spawn new child process to call the python script
 const python = spawn('python', ['yolov5/detect.py']);
 // collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  dataToSend = data.toString();
 });
 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
 // send data to browser
 res.send(dataToSend)
 });
 
})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`));
*/
