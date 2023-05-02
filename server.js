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
    // testPrompt();

});

const tracker = () => {

    //when tracker start options:- view all department, view all role, view all employee, and update an employee role.
    inquirer.prompt({

        message: "What would you like to view?",

        type: "list",
        name: "question1",
        choices: ["View all department", "View all roles", "View all employee", "Add a department", "Add a role", "Add an employee", "Update an employee role", "quit"],

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

                case "quit": db.end();
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
    db.query(`SELECT r.id, r.title, r.salary, d.dep_name FROM role r 
    JOIN department d ON r.department_id = d.id;`, (error, results) => {
        if (error) throw error;
        console.table(results);

        tracker();
    });

};


//all emp:- table empid,name,job title, sal,manager.
const viewemployee = () => {
    db.query(`SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dep_name, concat (m.first_name, " ", m.last_name) as manager
    FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee m ON e.manager_id = m.id;`, (error, results) => {
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


const addRole = async () => {

    const [department] = await db.promise().query(`SELECT * FROM department`);
    const departmentChoices = department.map((role) => {
        return { name: role.title, value: role.id }
    });
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
        {
            type: "list",
            name: "department_id",
            choices: departmentChoices,
            message: "Please select a Departments"
        },

    ])
        .then((answers) => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}', ${answers.salary}, ${answers.department_id})`, (error, results) => {
                if (error) throw error;
                console.log(`${results.affectedRows} Role added.`);
            });

            db.query(`SELECT role.id, role.title, role.salary, department.dep_name
            FROM role JOIN department ON role.department_id = department.id;`, (error, results) => {
                if (error) throw error;


                console.table(results);

                tracker();
            });
        });


};




// add a emp:- enter emp fisrt last name,role manager should add in db.


const addEmployee = async () => {
    //get existing roles
    const [roles] = await db.promise().query(`SELECT * FROM role`);
    const roleChoices = roles.map((role) => { return { name: role.title, value: role.id } });

    //get existing employees
    const [employees] = await db.promise().query(`SELECT * FROM employee`);
    const managerChoices = employees.map((employee) => {
        return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }
    });

    const answers = await inquirer.prompt([

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
        {
            type: "list",
            name: "role_id",
            choices: roleChoices,
            message: "Please select a role"
        },
        {
            type: "list",
            name: "manager_id",
            choices: managerChoices,
            message: "Please select a manager"
        }
    ])

    try {
        await db.promise().query(`INSERT INTO employee 
            (first_name, last_name, role_id, manager_id) 
            VALUES 
            ('${answers.firstName}', '${answers.lastName}', ${answers.role_id}, ${answers.manager_id})`)

        console.log(`Employee added.`);
        viewemployee()
    } catch (err) {
        console.error(err)
    }


};

//UPDATEquery:-emprole:- propmt select emp:-update role,info in db
const updateemprole = async () => {
    try {
        const [roles] = await db.promise().query(`SELECT * FROM role`);
        const roleChoices = roles.map((role) => ({ name: role.title, value: role.id }));

        const [employees] = await db.promise().query(`SELECT * FROM employee`);
        const empid = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        const managerChoices = empid;

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                choices: empid,
                message: 'Select id of employee:',
            },
            {
                type: 'list',
                name: 'role_id',
                choices: roleChoices,
                message: 'Please select a role',
            },
            {
                type: 'list',
                name: 'manager_id',
                choices: managerChoices,
                message: 'Please select a manager',
            },
        ]);

        await db.promise().query(`UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?`,
            [answers.role_id, answers.manager_id, answers.id]
        );

        console.log(`Employee role is updated.`);
        viewemployee();
    } catch (err) {
        console.error(err);
    }
    //  tracker();
};



// async function testPrompt() {
//     const [roles] = await db.promise().query(`SELECT * FROM role`);
//     const roleChoices = roles.map((role) => { return { name: role.title, value: role.id } });

//     const [employees] = await db.promise().query(`SELECT * FROM employee`);
//     const managerChoices = employees.map((employee) => {
//         return {
//             name: `${employee.first_name} ${employee.last_name}`,
//             value: employee.id
//         }
//     });

//     const answers = await inquirer.prompt([
//         {
//             type: "list",
//             name: "role_id",
//             choices: roleChoices,
//             message: "Please select a role"
//         },
//         {
//             type: "list",
//             name: "manager_id",
//             choices: managerChoices,
//             message: "Please select a manager"
//         }
//     ])


//     console.log("done");
// }