var employees = [];
var departments = [];
const fs = require("fs");


exports.initialize = function(){
    return new Promise (function(resolve, reject){
        fs.readFile("./data/employees.json", (err, data)=>{
            if(err) reject("Failure to read file from employees.json!");
            else{
                employees = JSON.parse(data);

                fs.readFile("./data/departments.json", (err, data)=>{
                    if(err) reject("Failnure to read file from departments.json!");
                    else{
                        departments = JSON.parse(data);
                        resolve("The operation was successful!");
                    }
                })
            }
        })
    })
}


exports.getAllEmployees = function(){
    return new Promise (function(resolve, reject){
        if(employees.length > 0){
            resolve(employees);
        }else{
            reject("no results returned.");
        }
    })
}


exports.getManagers = function(){
    var managers = [];

    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            for(let i=0; i<employees.length; i++){
                if(employees[i].isManager == true){
                    managers.push(employees[i]);
                }
            }
        }
        if(managers.length > 0){
            resolve(managers);
        }
        else{
            reject("no results returned.");
        }
    })
}


exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(departments.length > 0){
            resolve(departments);
        }else{
            reject("no results returned.");
        }
    })
}


exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
       if(!employeeData){
        reject("undefined employee data");
       }
       else{
        if(employeeData.isManager == undefined)
        employeeData.isManager = false;
        else
        employeeData.isManager = true;

        employeeData.employeeNum = employees.length + 1;
        employeeData.employeeManagerNum = parseInt(employeeData.employeeManagerNum);
        employeeData.department = parseInt(employeeData.department);

        employees.push(employeeData);
        resolve();
       }
    })
}


exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            let emp = employees.filter(emp => emp.status == status);
            if(emp.length > 0){
                resolve(emp);
            }else{
                reject("no results returned.");
            }
        }
        else{
            reject("no results returned.");
        }
    })
}


exports.getEmployeesByDepartment = function(department){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            let emp = employees.filter(emp => emp.department == department);
            if(emp.length > 0){
                resolve(emp);
            }else{
                reject("no results returned.");
            }
        }
        else{
            reject("no results returned.");
        }
    })
}


exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            let emp = employees.filter(emp => emp.employeeManagerNum == manager);
            if(emp.length > 0){
                resolve(emp);
            }else{
                reject("no results returned.");
            }
        }
        else{
            reject("no results returned.");
        }
    })
}

/* 
exports.getEmployeeByNum = function(empNum){
    return new Promise(function(resolve, reject){
        if(employees.length > 0){
            let employee = employees.find(emp => emp.employeeNum == empNum);
            if(employee.length > 0){
                resolve(employee);
            }else{
                reject("no results returned.");
            }
        }
        else{
            reject("no results returned.");
        }
    })
}
*/


exports.getEmployeeByNum = function(num) {
    return new Promise(function(resolve, reject) {
        if (employees.length > 0) {
            for (var i in employees) {
                if (employees[i].employeeNum == num) {
                    index = i;
                }
            }
            resolve(employees[index]);
        }
        else {
            reject("no results returned");
        };
    })
}


exports.updateEmployee = function(employeeData){
   return new Promise(function(resolve, reject){
        if(employees.length == 0 || employeeData == undefined){
            reject("No results returned");
        }
        else{
            for(let i=0; i<employees.length; i++){
                if(employees[i].employeeNum == employeeData.employeeNum){
                    employees[i] = employeeData;
                    break;
                }
            }
            resolve();
        }
    })
}