// require sequalize
const Sequelize = require('sequelize');

//setup db connection
var sequelize = new Sequelize("iztsabfp", "iztsabfp", "bV59hLgRD-BjdKCwR73tMBg9mShe6P1g", {
    host: "peanut.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
    ssl: true
    },
    query:{raw: true}
});

//authenticate connection
sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));


// create data models: Employee
var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING 
    }, {
        createdAt: false,
        updatedAt: false
    });


var Department = sequelize.define("Department", {
    departmentId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    departmentName: Sequelize.STRING
    }, {
        createdAt: false,
        updatedAt: false
    });


exports.initialize = function(){
    return new Promise (function(resolve, reject){
        sequelize.sync()
        .then(()=>{
            resolve();
        }).catch(()=>{
            reject("unable to sync the database");
        })
    })
}


exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
        Employee.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("no results returned"))
    });
}



exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
        Department.findAll()
            .then((data) => resolve(data))
            .catch(() => reject("no results returned"))
    });
}


exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var i in employeeData) {
            if (employeeData[i] == "") {
                employeeData[i] = null;
            }
        }
        Employee.create(employeeData)
            .then(() => {
                resolve(); 
            })
            .catch(() => { 
                reject("unable to create employee") 
            })
    });
}


exports.addDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for(var i in departmentData){
            if(departmentData[i] == ""){
                departmentData[i] = null;
            }
        }
        Department.create(departmentData)
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create department");
        })
    })
}


exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {status: status}
        })
        .then((data)=>{
            resolve(data);
        }).catch(()=>{
            reject('no results returned');
        })
    })
}


exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {department: department}
        })
        .then((data)=>{
            resolve(data);
        }).catch(()=>{
            reject('no results returned');
        })
    })
}


exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {employeeManagerNum: manager}
        })
        .then((data)=>{
            resolve(data);
        }).catch(()=>{
            reject('no results returned');
        })
    })
}


exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        Employee.findAll({
            where: {employeeNum: num}
        })
        .then((data)=>{
            resolve(data[0]);
        }).catch(()=>{
            reject('no results returned');
        })
    })
}


exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var i in employeeData) {
            if (employeeData[i] == "") { 
                employeeData[i] = null; 
            }
        }
        
        Employee.update(employeeData, { 
            where: { employeeNum: employeeData.employeeNum } 
        })
        .then((data) => { 
            resolve(data);
        })
        .catch(() => { 
            reject("unable to update employee"); 
        })
    });
}


exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for(var i in departmentData){
            if(departmentData[i] == ""){
                departmentData[i] = null;
            }
        }

        Department.update(departmentData, {
            where: { departmentId: departmentData.departmentId }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject('unable to update department');
        })
    })
}


exports.getDepartmentById = function(id){
    return new Promise(function(resolve, reject){
        Department.findAll({
            where: {departmentId: id}
        })
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject('no results returned');
        })
    })
}


exports.deleteEmployeeByNum = function (empNum) {
    return new Promise(function(resolve, reject) {
        Employee.destroy({ 
            where: { employeeNum: empNum } 
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to delete employee");
        })
    });
}

