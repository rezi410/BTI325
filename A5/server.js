/************************************************************************* *  
 * BTI325– Assignment 5
 * I declare that this assignment is my own work in 
 * accordance with Seneca  Academic Policy. No part of this assignment 
 * has been copied manually or electronically from any other source  
 * (including 3rd party web sites) or distributed to other students. 
 *  Name: Reziyemu Sulaiman
 *  Student ID: 106-153-208
 *  Date: 2022-11-26
 *  Your app’s URL (from Cyclic):
 *  https://modern-tam-ox.cyclic.app/
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
    res.render('home', {});
})


app.get("/about", (req, res)=>{
    res.render('about', {});
})


app.get("/employees", function(req, res){
    if(req.query.status){
        data_service.getEmployeesByStatus(req.query.status).then((data) => {
            if(data.length > 0){
                res.render("employees", {employee: data});
            }
            else{
                res.render("employees", {message: "No results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.department){
        data_service.getEmployeesByDepartment(req.query.department).then((data) => {
            if(data.length > 0){
                res.render("employees", {employee: data});
            }
            else{
                res.render("employees", {message: "No results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.manager){
        data_service.getEmployeesByManager(req.query.manager).then((data) => {
            if(data.length > 0){
                res.render("employees", {employee: data});

            }
            else{
                res.render("employees", {message: "No results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else{
        data_service.getAllEmployees().then((data) => {
            if(data.length > 0){
                res.render("employees", {employee: data});
            }
            else{
                res.render("employees", {message: "No results"});
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
});


app.get("/departments", (req, res)=>{
    data_service.getDepartments()   // access the function
    .then(function(data){            // resolve
    if (data.length > 0)
    res.render('departments', {departments: data});
    else 
    res.render("departments", { message: "no results" })
    })
    .catch(function(error){         // reject
    res.render({message: "no results"});
    })
})


app.get("/employees/add", (req, res)=>{
    data_service.getDepartments()
    .then((data)=>{
        res.render("addEmployee", { departments: data });
    })
    .catch(()=>{
        res.render("addEmployee", { departments: [] });
    })
})


app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
})


app.post("/departments/add", (req, res)=>{
    data_service.addDepartment(req.body)
    .then(()=>{
        res.redirect('/departments');
    })
    .catch((err)=>{
        res.status(500).send("unable to add department");
    })
})


app.post("/department/update", (req, res)=>{
    data_service.updateDepartment(req.body)
    .then(()=>{
        res.redirect('/departments');
    })
    .catch((err)=>{
        res.status(500).send("unable to update department");
    })
})


app.get("/department/:departmentId", (req, res) => {
    data_service.getDepartmentById(req.params.departmentId)
    .then((data) => {
        if (data.length > 0) 
        res.render("department", { department: data })
        else 
        res.status(404).send("Department Not Found"); 
    })
    .catch(() => {
        res.status(404).send("Department Not Found");
    })
})


app.get("/images/add", (req, res)=>{
    res.render('addImage', {});
})


app.get("/images", (req, res)=>{
    fs.readdir("./public/images/uploaded", function(err, items){
        if(err){
            return console.log("unable to scan images " + err);
        }

        res.render('images', {items}); 
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


app.get("/employee/:empNum", (req, res) => {
    let viewData = {};
    data_service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; 
        } else {
            viewData.employee = null; 
        }
    }).catch(() => {
        viewData.employee = null; 
    }).then(data_service.getDepartments)
        .then((data) => {
            viewData.departments = data; 
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});



// update employee
app.post("/employee/update", (req, res)=>{
    data_service.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees"); 
    })
})


app.get("/employees/delete/:empNum", (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum)
        .then(() => 
        res.redirect("/employees"))
        .catch(() => 
        res.status(500).send("Unable to Remove Employee / Employee not found"))
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


