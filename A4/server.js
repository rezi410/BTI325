/************************************************************************* *  
 * BTI325– Assignment 4  
 * I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy. No part of this assignment 
 * has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 *  Name: Reziyemu Sulaiman
 *  Student ID: 106-153-208
 *  Date: 2022-11-12
 *  Your app’s URL (from Heroku):
 *  https://serene-escarpment-31671.herokuapp.com/
 * * ************************************************************************/  

 const exphbs = require('express-handlebars');
const data_service = require("./data_service.js");   // require data_service module
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// define engine
app.engine('.hbs', exphbs.engine(
    { 
        extname: '.hbs' ,
        defaultLayout: 'main',
        helpers:{
            navLink: function(url, options){
                return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
               },
               equal: function (lvalue, rvalue, options) {
                if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
                if (lvalue != rvalue) {
                return options.inverse(this);
                } else {
                return options.fn(this);
                }
               }   
            }}));
app.set('view engine', '.hbs');


var HTTP_PORT = process.env.PORT || 8080;

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



var onHttpStart = function(){
    console.log(`Express http server is listenning on port ${HTTP_PORT}`);
}

// add middleware to show correct active item in navbar
app.use(function(req,res,next){ 
    let route = req.baseUrl + req.path; 
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, ""); 
    next(); 
}); 


// middleware use public folder
app.use(express.static('./public'));  

app.get("/", (req, res)=>{
    // res.sendFile(path.join(__dirname, "./views/home.html"));
    res.render('home', {});
})


app.get("/about", (req, res)=>{
  //  res.sendFile(path.join(__dirname, "./views/about.html"));
    res.render('about', {});
})


app.get("/employees", (req, res)=>{
    if(req.query.status)
    {
        data_service.getEmployeesByStatus(req.query.status)
        .then(function(data){
          //  res.json(data);
            res.render('employees', {employees: data});
        })
        .catch(function(error){
          //  res.json({"message": error});
            res.render({message: "no results"});
        })
    }
    else if(req.query.department)
    {
        data_service.getEmployeesByDepartment(req.query.department)
        .then(function(data){
         //   res.json(data);
            res.render('employees', {employees: data});
        })
        .catch(function(error){
         //   res.json({"message": error});
            res.render({message: "no results"});
        })
    }
    else if(req.query.manager)
    {
        data_service.getEmployeesByManager(req.query.manager)
        .then(function(data){
         //   res.json(data);
         res.render('employees', {employees: data});
        })
        .catch(function(error){
         //   res.json({"message": error});
         res.render({message: "no results"});
        })
    }
    else{
    data_service.getAllEmployees()    // access the function
    .then(function(data){            // resolve
      //  res.json(data);
      res.render('employees', {employees: data});
    })
    .catch(function(error){         // reject
     //   res.json({"message": error})
     res.render({message: "no results"});
    }) 
    }
})


/* 
app.get("/managers", (req, res)=>{
    data_service.getManagers()      // access the function
    .then(function(data){           // resolve
        res.json(data);
    })
    .catch(function(error){         // reject
        res.json({"message": error})
    })
})
*/


app.get("/departments", (req, res)=>{
    data_service.getDepartments()   // access the function
    .then(function(data){            // resolve
    //    res.json(data);
    res.render('departments', {departments: data});
    })
    .catch(function(error){         // reject
    //    res.json({"message": error});
    res.render({message: "no results"});
    })
})


app.get("/employees/add", (req, res)=>{
 //   res.sendFile(path.join(__dirname, "./views/addEmployee.html"));
    res.render('addEmployee', {});
})


app.get("/images/add", (req, res)=>{
 //   res.sendFile(path.join(__dirname, "./views/addImage.html"));
    res.render('addImage', {});
})


app.get("/images", (req, res)=>{
    fs.readdir("./public/images/uploaded", function(err, items){
        if(err){
            return console.log("unable to scan images " + err);
        }

        res.render('images', {items}); 
    })
/* 
    fs.readdir("./public/images/uploaded", function(err, items){ 
        res.json({"images": items})
         if (err) {
            console.log("Unable to read the directory: " + err);
         }
    })
*/
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

/* 
app.get("/employee/:empNum", (req, res)=>{
    data_service.getEmployeeByNum(req.params.empNum)
    .then(function(data){
    //    res.json(data);
        res.render('employee', {employee});
    })
    .catch(function(error){
    //    res.json({"message": error});
        res.render('employee', {message: "no results"});
    })
})
*/

app.get('/employee/:value', (req, res) => {

    data_service.getEmployeeByNum(req.params.value).then(data => {
        res.render("employee", { employee: data});
    }).catch(err => {
        res.render("employee", { message: "no results" });
    })
})


// update employee
app.post("/employee/update", (req, res)=>{
    data_service.updateEmployee(req.body)
    .then(function(){
     //   console.log(req.body);
        res.redirect("/employees");
    })
    .catch(function(err){
        res.render('employees', {message: "no results"});
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


