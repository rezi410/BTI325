/************************************************************************* *  
 * BTI325– Assignment 6
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
var dataService = require('./data-service-auth.js');  // require module
var clientSessions = require("client-sessions");
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


app.use(function(req,res,next){ 
    let route = req.baseUrl + req.path; 
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, ""); 
    next(); 
}); 


// middleware use public folder
app.use(express.static('./public'));  


app.use(clientSessions({
    cookieName: "session", 
    secret: "meetsimar_assignment6", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}


app.get("/", (req, res)=>{
    res.render('home', {});
})


app.get("/about", (req, res)=>{
    res.render('about', {});
})


app.get("/employees", ensureLogin, function(req, res){
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


app.get("/departments", ensureLogin, (req, res)=>{
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


app.get("/employees/add", ensureLogin, (req, res)=>{
    data_service.getDepartments()
    .then((data)=>{
        res.render("addEmployee", { departments: data });
    })
    .catch(()=>{
        res.render("addEmployee", { departments: [] });
    })
})


app.get("/departments/add", ensureLogin, (req, res) => {
    res.render("addDepartment");
})


app.post("/departments/add", ensureLogin, (req, res)=>{
    data_service.addDepartment(req.body)
    .then(()=>{
        res.redirect('/departments');
    })
    .catch((err)=>{
        res.json({"message": err});
    })
})


app.post("/department/update", ensureLogin, (req, res)=>{
    data_service.updateDepartment(req.body)
    .then(()=>{
        res.redirect('/departments');
    })
    .catch((err)=>{
        res.json({"message": err});
    })
})


app.get("/department/:departmentId", ensureLogin, (req, res) => {
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


app.get("/images/add", ensureLogin, (req, res) => { 
    res.render("addImage");
})


app.get("/images", ensureLogin, (req, res)=>{
    fs.readdir("./public/images/uploaded", function(err, items){
        if(err){
            return console.log("unable to scan images " + err);
        }

        res.render('images', {items}); 
    })
})


app.post("/images/add", upload.single("imageFile"), ensureLogin, (req, res) => { 
    res.redirect("/images");
})


app.post("/employees/add", ensureLogin, (req,res)=>{
    data_service.addEmployee(req.body).then(function(){
        res.redirect("/employees");
    }).catch(function(error){
        res.json({"message": error});
    })
});


app.get("/employee/:empNum", ensureLogin, (req, res) => {
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
            viewData.departments = []; 
        }).then(() => {
            if (viewData.employee == null) { 
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); 
            }
        });
});



// update employee
app.post("/employee/update", ensureLogin, (req, res)=>{
    data_service.updateEmployee(req.body)
    .then(() => {
        res.redirect("/employees"); 
    })
})


app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum)
        .then(() => 
        res.redirect("/employees"))
        .catch(() => 
        res.status(500).send("Unable to Remove Employee / Employee not found"))
})


/* login and register routes */
app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    dataService.registerUser(req.body)
        .then(() => {
            res.render("register", { successMessage: "User created" });
        })
        .catch((err) => {
            res.render("register", { errorMessage: err, userName: req.body.userName });
        })
})

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
})

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render("userHistory");
})

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    dataService.checkUser(req.body)
        .then((user) => {
            req.session.user = {
                userName: user.userName, 
                email: user.email, 
                loginHistory: user.loginHistory 
            }

            res.redirect('/employees');
        })
        .catch((err) => {
            res.render("login", { errorMessage: err, userName: req.body.userName });
        })
})


/* 404 and initilize */
app.use((req, res)=>{
    res.status(404).redirect("https://kreativcopywriting.com/wp-content/uploads/2019/02/marvel-404.png");
})


dataService.initialize()
.then(dataService.initialize)
    .then(function () {
        app.listen(HTTP_PORT, function () {
            console.log("app listening on: " + HTTP_PORT)
        });
    })
    .catch(function (err) {
        console.log("unable to start server: " + err);
    });




