var Canvas = require('canvas');
const express = require('express');
const multer = require('multer');
const path = require('path');
var fs = require('fs')
const {spawnSync} = require('child_process');
var router = function (app, db) {
    app.get('/', function (req, res) {
            res.render('pages/login', { //changed the start page to the login page!
        });
    //});
    app.post('/upload', (req, res) => {
        const fs = require('fs');
        // // to detect only 1 image at a time, clear img directory
        fs.rmdirSync("./uploads", {recursive: true});
        //clear exp so that only newest detection is available
        fs.rmdirSync("./runs", {recursive: true});
        //create uploads folder
        fs.mkdir(path.join('./', 'uploads'), (err) => { 
            if (err) { 
                return console.error(err); 
            }  
        }); 
        //take dataURI from upload and turn into buffer
        var dataUriToBuffer = require('data-uri-to-buffer');
        const promiseA = new Promise( (res,rej) => {
            var decoded = dataUriToBuffer(req.body.photo);
            res(decoded);
        });
        //turn buffer into image and then run detect.py
        promiseA.then((decoded)=>{
            fs.writeFileSync('uploads/photo.png', decoded);

        res.render('pages/loading');
        
    });

    app.post('/loading', async(req, res) => {
            const py = spawnSync('python', ['yolov5/detect.py', `--save-txt`],{
                    cwd: process.cwd(),
                    env: process.env,
                    stdio: 'pipe',
                    encoding: 'utf-8'
            })
            let output=py.output[1];
            console.log("py.output[1]: "+ py.output[1]);

            var carbon_estimate = await outputToCarbonEstimate(output);
            console.log('total carbon estimate:' + carbon_estimate);

            //outputs none if no food is detected
            if(carbon_estimate == 0){
                output = "Foods are: None";
            }
            //add food and carbon sum into the food log
            else{
                let out=output.slice(11);
                let values=[[req.session.username, out, carbon_estimate]];
                let addFood = "INSERT INTO `Food Log` (Username, Food_Recognized, Carbon_Sum) VALUES ?";
                db.query(addFood, [values], function (err, result) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            }
            //send image and output line to upload page
            fs.readFile('runs/detect/exp/photo.png', function(err, data) {
                let base64Image=Buffer.from(data,'binary').toString('base64');
                let imgsrc=`data:image/png;base64,${base64Image}`;
                res.render('pages/upload',{imgsrc,output, carbon_estimate});
            });

        });
    })

    async function outputToCarbonEstimate(output) {
        //output carbon estimates
        var out = output.split(" ");
        console.log("output: " + out);
        var carbon_estimate = 0;
        for(var i = 2; i < out.length-1; i+=2) {

            let int_string = out[i];
            let text = out[i+1];
            let int_parsed = parseFloat(int_string);
            console.log('parsed number:' + typeof int_parsed);

            if(out[i+1] == "hot") {
                text = out[i+1] + out[i+2];
                i += 1;
            }

            let carbon_amount = dbGetEstimates(text);
            carbon_amount.then((result) => {
                carbon_estimate += (int_parsed * result);
                console.log("promise: " + result);
            });

            await carbon_amount;
        }
        return carbon_estimate;
    }

    function dbGetEstimates(text){
        console.log("inside func2");
        return new Promise((resolve, reject) => {
            db.query(
                `CALL GetEstimates(?)`, [text], 
              (err, result) => {
                if(err) resolve(0);
                else {
                     //console.log("query done");
                     //console.log("query result: " + result[0][0].kg_carbon_per_item);
                    resolve(result[0][0].kg_carbon_per_item);
                }
              }
            );
          });
    }
});
}  
module.exports=router;