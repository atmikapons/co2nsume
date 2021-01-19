const express = require('express')
const {spawn} = require('child_process');
var router = function (app) {
    app.get('/', function (req, res) {
        //const python = spawn('python', ['yolov5/detect.py']);
        res.render('pages/index', {
        });
    });
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
    })  
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
