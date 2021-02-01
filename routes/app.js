

        
  var Canvas = require('canvas');
const express = require('express');
const multer = require('multer');
const path = require('path');
var fs = require('fs')
const {spawnSync} = require('child_process');
var router = function (app) {
    app.get('/', function (req, res) {
        res.render('pages/index', {
        });
    });
    app.post('/upload', (req, res) => {
        const fs = require('fs');
        // // to detect only 1 image at a time, clear img directory
        fs.rmdirSync("./uploads", {recursive: true});
        //clear exp so that only newest detection is available
        fs.rmdirSync("./runs", {recursive: true});
        fs.mkdir(path.join('./', 'uploads'), (err) => { 
            if (err) { 
                return console.error(err); 
            }  
        }); 
        var dataUriToBuffer = require('data-uri-to-buffer');
        const promiseA = new Promise( (res,rej) => {
            var decoded = dataUriToBuffer(req.body.photo);
            res(decoded);
        });
        promiseA.then((decoded)=>{
        fs.writeFileSync('uploads/photo.png', decoded);

            const py = spawnSync('python', ['yolov5/detect.py', `--save-txt`],{
                cwd: process.cwd(),
                env: process.env,
                stdio: 'pipe',
                encoding: 'utf-8'
            })
            let output=py.output[1];
            fs.readFile('runs/detect/exp/photo.png', function(err, data) {
                let base64Image=Buffer.from(data,'binary').toString('base64');
                let imgsrc=`data:image/png;base64,${base64Image}`;
                res.render('pages/upload',{imgsrc,output});
            });
        });
        

        });
    };  
module.exports=router;
