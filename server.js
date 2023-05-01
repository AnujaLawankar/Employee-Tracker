//import filesystem for read and write in file
const fs = require('fs');
//import mysql package
const mysql = require("mysql2");

//import inquire package
const inquirer = require("inquirer");

//import expess
const express = require("express");

//
const PORT = process.env.PORT || 3001;

const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Agniv@26",
        database: "cms_db"

    });


db.connect(err => {

    if (err) {
        throw err;
    } else {
        console.log("Wellcome to Employee-Tracker");


    }


    tracker();

});

const tracker = () => {

    //when tracker start options:- view all department, view all role, view all employee, and update an employee role.
    inquirer.prompt({

        message: "What would you like to view?",

        type: "list",
        name: "question1",
        choices: ["View all department", "View all roles", " View all employee", "Add a department", "Add a role", "Add an employee", "Update an employee role"],

    })
        .then(response => {

            switch (response.question1) {
                case "View all department": viewdepartment();
                    break;




                case "View all roles": viewroles();
                    break;


                case "View all employee": viewemployee();
                    break;


                case "Add a department": addDepartment();
                    break;


                case "Add a role": addRole();
                    break;


                case "Add an employee": addEmployee();
                    break;


                case "Update an employee role": updateemprole();
                    break;
            }
            console.log("\n-------------------------");

        })

}
//all dep:- dep name depid table.
const viewdepartment = () => {
    db.query('SELECT * FROM department', (error, results) => {
        if (error) throw error;


        console.table(results);

        tracker();
    });

};

//all role:- job title,roleid, dep role,sal.
const viewroles = () => {
    db.query('SELECT * FROM role', (error, results) => {
        if (error) throw error;
        console.table(results);

        tracker();
    });

};


//all emp:- table empid,name,job title, sal,manager.
const viewemployee = () => {
    db.query('SELECT * FROM employee', (error, results) => {
        if (error) throw error;
        console.table(results);

        tracker();
    });


};

/// when choose to add a department:-
//INSERTquery:- dep name add to db.
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name:',
        },
    ])
        .then((answers) => {
            db.query(`INSERT INTO department (dep_name) VALUES ('${answers.name}')`, (error, results) => {
                if (error) throw error;
                console.log(`${results.affectedRows} department added.`);


            });

            db.query('SELECT * FROM department', (error, results) => {
                if (error) throw error;


                console.table(results);

                tracker();
            });
        });



};

//add a role:- enter name,sal,dep name that role should add in db.


const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter job title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary:',
        },
    ])
        .then((answers) => {
            db.query(`INSERT INTO role (title, salary) VALUES ('${answers.title}', ${answers.salary})`, (error, results) => {
                if (error) throw error;
                console.log(`${results.affectedRows} role added.`);
            });

            db.query('SELECT * FROM role', (error, results) => {
                if (error) throw error;


                console.table(results);

                tracker();
            });
        });


};




// add a emp:- enter emp fisrt last name,role manager should add in db.


const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter first name of employee:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter last name of employee:',
        },
    ])
        .then((answers) => {
            db.query(`INSERT INTO employee (first_name, last_name) VALUES ('${answers.firstName}', '${answers.lastName}')`, (error, results) => {
                if (error) throw error;
                console.log(`${results.affectedRows} employee added.`);
            });

            db.query(' SELECT e.id, e.first_name, e.last_name, r.title, m.manager_name FROM employee e JOIN manager m ON e.manager_id = m.id JOIN role r ON e.role_id = r.id', (error, results) => {
                if (error) throw error;


                console.table(results);

                tracker();
            });
        });



};

//UPDATEquery:-emprole:- propmt select emp:-update role,info in db

const updateemprole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter department id:',
        },
        {
            type: 'input',
            name: 'title',
            message: 'Enter job title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary:',
        },
    ])
        .then((answers) => {
            const sql = `UPDATE role SET title = ?, salary = ? WHERE id = ?`;
            const values = [answers.title, answers.salary, answers.id];
            db.query(sql, values, (error, result) => {
                if (error) throw error;
                console.log(result.affectedRows + ' row(s) updated.');
            });


            db.query(' SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dep_name, m.manager_name FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN manager m ON e.manager_id = m.id', (error, results) => {
                if (error) throw error;


                console.table(results);


                tracker();

            });

        });
};