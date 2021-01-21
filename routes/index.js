const express = require('express');
const multer = require('multer');
const path = require('path');
var fs = require('fs')
const {spawnSync} = require('child_process');
var router = function (app) {
    app.get('/', function (req, res) {
        //const python = spawn('python', ['yolov5/detect.py']);
        res.render('pages/index', {
        });
    });
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
            const process = spawnSync('python', [scriptPath])
            fs.readFile('runs/detect/exp/photo.jpeg', function(err, data) {
                //let base64Image = new Buffer(data, 'binary').toString('base64');
                let base64Image=Buffer.from(data,'binary').toString('base64');
                let imgsrc=`data:image/jpeg;base64,${base64Image}`;
                res.render('pages/upload',{imgsrc});
            });

        });
    });  
}
module.exports=router;

