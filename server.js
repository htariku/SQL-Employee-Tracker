const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "tracker",
});

connection.connect(function (err) {
  if (err) throw err;
  questions();
});


function questions() {
  //   console.log("connected");
  inquirer
    .prompt([
      {
        type: "list",
        name: "startingQuestion",
        message: "What would you like to do first?",
        choices: [
          "View All",
          "View All Departments",
          "View All Employees",
          "View All roles",
          "Add new department",
          "Add new role",
          "Add new employee",
          "Update employee role",
          // "Terminate employee",
          "Quit prompts",
        ],
      },
    ])
    .then((answer) => {
      if (answer.startingQuestion === "View All") {
        viewAll();
      } else if (answer.startingQuestion === "View All Departments") {
        viewAllDepartments();
      } else if (answer.startingQuestion === "View All Employees") {
        viewAllEmployees();
      } else if (answer.startingQuestion === "Add new employee") {
        addEmployee();
      } else if (answer.startingQuestion === "Update employee role") {
        updateEmployee();
      // } else if (answer.startingQuestion === "Terminate employee") {
      //   terminateEmployee();
      } else if (answer.startingQuestion === "View All roles") {
        viewAllRoles();
      } else if (answer.startingQuestion === "View All") {
        viewAll();
      } else if (answer.startingQuestion === "Add new role") {
        addRole();
      } else if (answer.startingQuestion === "Add new department") {
        addDepartment();
      } else {
        connection.end();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "what is the department you are adding?",
      },
    ])
    .then((answer) => {
      connection.query("INSERT INTO department SET ?", {
        name: answer.dept,
      });
      questions();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "what is the role title?",
      },
      {
        type: "input",
        name: "salary",
        message: "what is the salary?",
      },
      {
        type: "input",
        name: "departmentId",
        message: "what is the department ID?",
      },
    ])
    .then((answers) => {
      connection.query("INSERT INTO role SET ?", {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.departmentId,
      });
      questions();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first",
        message: "what is the employees first name?",
      },
      {
        type: "input",
        name: "last",
        message: "what is the employees last name?",
      },
      {
        type: "input",
        name: "roleId",
        message: "what is the employees role ID?",
      },
      {
        type: "input",
        name: "managerId",
        message: "what is the employees manager ID?",
      },
    ])
    .then((answers) => {
      connection.query("INSERT INTO employee SET ?", {
        first_name: answers.first,
        last_name: answers.last,
        role_id: answers.roleId,
        manager_id: answers.managerId,
      });
      questions();
    });
}

function viewAll() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      questions();
    }
  );
}

function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    questions();
  });
}



function updateEmployee() {
  inquirer.prompt([
    {
      type:'input',
      name:'employeeId',
      message:'What is the employees ID who is getting a new role?'
    },
    {
      type:'input',
      name:'roleId',
      message:'What is the role ID for the new role?'
    }
  ]).then(answers => {

    connection.query('UPDATE employee SET ? WHERE ?', [
      {
        role_id: answers.roleId
      },
      {
        id: answers.employeeId
      }
    ])
    questions()
  })
}
