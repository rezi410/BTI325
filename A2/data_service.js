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


