/************************************************************************* *  
 * BTI325– Assignment 2  
 * I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy. No part of this assignment 
 * has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 *  Name: Reziyemu Sulaiman
 *  Student ID: 106-153-208
 *  Date: 2022-10-07
 *  Your app’s URL (from Cyclic):
 *  https://healthy-leg-warmers-bat.cyclic.app
 * * ************************************************************************/  


const data_service = require("./data_service.js");   // require data_service module

const express = require("express");
const app = express();
const path = require("path");

var HTTP_PORT = process.env.PORT || 8080;


var onHttpStart = function(){
    console.log(`Express http server is listenning on port ${HTTP_PORT}`);
}


app.use(express.static('./public'));  // middleware


app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/home.html"));
})


app.get("/about", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/about.html"));
})


app.get("/employees", (req, res)=>{
    data_service.getAllEmployees()    // access the function
    .then(function(data){            // resolve
        res.json(data);
    })
    .catch(function(error){         // reject
        res.json({"message": error})
    })
})


app.get("/managers", (req, res)=>{
    data_service.getManagers()      // access the function
    .then(function(data){           // resolve
        res.json(data);
    })
    .catch(function(error){         // reject
        res.json({"message": error})
    })
})


app.get("/departments", (req, res)=>{
    data_service.getDepartments()   // access the function
    .then(function(data){            // resolve
        res.json(data);
    })
    .catch(function(error){         // reject
        res.json({"message": error});
    })
})


app.use((req, res)=>{
    res.status(404).redirect("https://kreativcopywriting.com/wp-content/uploads/2019/02/marvel-404.png");
})



data_service.initialize()
.then(function(data){
    app.listen(HTTP_PORT, onHttpStart);
})
.catch(function(error){
    console.log(error);
})


