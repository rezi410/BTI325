/************************************************************************* *  
 * BTI325– Assignment 3  
 * I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy. No part of this assignment 
 * has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 *  Name: Reziyemu Sulaiman
 *  Student ID: 106-153-208
 *  Date: 2022-10-29
 *  Your app’s URL (from Heroku):
 *  https://serene-escarpment-31671.herokuapp.com/
 * * ************************************************************************/  


const data_service = require("./data_service.js");   // require data_service module
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
app.use(express.json());   
app.use(express.urlencoded({extended: true})); 

const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb){
       cb(null, Date.now()+ path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

var HTTP_PORT = process.env.PORT || 8080;

var onHttpStart = function(){
    console.log(`Express http server is listenning on port ${HTTP_PORT}`);
}


app.use(express.static('./public'));  

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/home.html"));
})


app.get("/about", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/about.html"));
})


app.get("/employees", (req, res)=>{
    if(req.query.status)
    {
        data_service.getEmployeesByStatus(req.query.status)
        .then(function(data){
            res.json(data);
        })
        .catch(function(error){
            res.json({"message": error});
        })
    }
    else if(req.query.department)
    {
        data_service.getEmployeesByDepartment(req.query.department)
        .then(function(data){
            res.json(data);
        })
        .catch(function(error){
            res.json({"message": error});
        })
    }
    else if(req.query.manager)
    {
        data_service.getEmployeesByManager(req.query.manager)
        .then(function(data){
            res.json(data);
        })
        .catch(function(error){
            res.json({"message": error});
        })
    }
    else{
    data_service.getAllEmployees()    // access the function
    .then(function(data){            // resolve
        res.json(data);
    })
    .catch(function(error){         // reject
        res.json({"message": error})
    }) 
    }
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


app.get("/employees/add", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/addEmployee.html"));
})


app.get("/images/add", (req, res)=>{
    res.sendFile(path.join(__dirname, "./views/addImage.html"));
})


app.get("/images", (req, res)=>{
    fs.readdir("./public/images/uploaded", function(err, items){ 
        res.json({"images": items})
         if (err) {
            console.log("Unable to read the directory: " + err);
         }
    })
})


app.post("/images/add", upload.single("imageFile"), (req,res)=>{
    res.redirect("/images");
});


app.post("/employees/add", (req,res)=>{
    data_service.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    }).catch(function(error){
        res.json({"message": error});
    })
});


app.get("/employee/:empNum", (req, res)=>{
    data_service.getEmployeeByNum(req.params.empNum)
    .then(function(data){
        res.json(data);
    })
    .catch(function(error){
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


