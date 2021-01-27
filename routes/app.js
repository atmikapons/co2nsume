const express = require('express');
const multer = require('multer');
const path = require('path');
var fs = require('fs')
const {spawnSync, exec, execSync} = require('child_process');
var router = function (app) {
    app.get('/', function (req, res) {
        res.render('pages/index', {
        });
    });

    //TODO: redirect this to loading.ejs
    app.post('/loading', (req, res) => {
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

            // let p = runDetect();
            // p.then((output) => {
            //     console.log(output);
            //     fs.readFile('runs/detect/exp/photo.png', function(err, data) {
            //         let base64Image=Buffer.from(data,'binary').toString('base64');
            //         let imgsrc=`data:image/png;base64,${base64Image}`;
            //         res.render('pages/upload',{imgsrc,output});
            //     });
            // })

            //only 1 page can be rendered per request!
            //res.render('pages/loading')
            
        });
    });  
}

// function runDetect(){
//     const scriptPath = 'yolov5/detect.py'
//     return new Promise((resolve, reject) => {
//         const py = spawnSync('python', ['yolov5/detect.py', `--save-txt`],{
//             cwd: process.cwd(),
//             env: process.env,
//             stdio: 'pipe',
//             encoding: 'utf-8'
//         })
//         resolve(py.stdout);
//     }) 
// }

module.exports=router;

