const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require('console.table')

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

// const PORT = process.envPORT || 3001;
// const app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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
          "Add new employee",
          "Update employee role",
          "Terminate employee",
          "View All roles",
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
      } else if (answer.startingQuestion === "Terminate employee") {
        terminateEmployee();
    } else if (answer.startingQuestion === "View All Roles") {
        viewAllRoles();
      } else if (answer.startingQuestion === "Quit prompts") {
        quitPrompts();
      } else if (answer.startingQuestion === "View All") {
        viewAll();
      } else {
        cpnnection.end();
      }
    });
}
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please state the employee's designated department",
      },
    ])
    .then(function (deaprtmentAnswer) {
      connection.query("INSERT INTO deapartments SET ?;", {
        department: deaprtmentAnswer.department,
      });
      inquirer
        .prompt([
          {
            name: "employeeRole",
            type: "imput",
            message: "What is the employee's role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the employee's salary?",
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("Salary must be a number.");
              return false;
            },
          },
          {
            name: "roleId",
            type: "input",
            message: "What the employee's role id?",
            validate: function (value) {
              if (isNaN(value) === false) {
                return true;
              }
              console.log("Please try again, must be a valid ID number.");
              return false;
            },
          },
        ])

        .then(function (addAnswer) {
          connection.query("INSERT INTO employee SET ?", {
            first_name: addAnswer.first,
            last_name: addAnswer.last,
            role_id: addAnswer.employeeId,
          });
          questions();
        });
    });
}

    function viewAll() {
    connection.query(
        "SELECT * FROM departments INNER JOIN employee ON role_id = departments.id inner join role on department_id = employee.id;",
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
    connection.query("SELECT * FROM departments", function (err, res) {
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

    function terminateEmployee() {
    inquirer
        .prompt([
        {
            name: "departName",
            type: "input",
            message: "Give the last name of the employee who was terminated",
        },
    ])
    .then(function (terminatedName) {
      connection.query("DELETE FROM employee WHERE ?;", {
        last_name: terminatedName.departName,
      });
      inquirer
        .prompt([
          {
            name: "departDepartment",
            type: "input",
            message: "What department did this employee work at?",
          },
        ])
        .then(function (terminatedDepartment) {
          connection.query("DELETE FROM departments WHERE ?", {
            department: terminatedDepartment.departDepartment,
          });
          inquirer
            .prompt([
              {
                name: "departRole",
                type: "input",
                message: "What role did employee play?",
              },
            ])
            .then(function (terminatedRole) {
              connection.query("DELETE FROM role WHERE ?", {
                title: terminatedRole.departRole,
              });
              console.log("Employee successfully terminated!");
              questions();
            });
        });
    });
}

    function updateEmployee() {
    inquirer
        .prompt([
        {
            name: "roleOrDept",
            type: "list",
            message: "Would you like to update employees role and/or deparment?",
            choices: ["Role", "Department"],
      },
    ])
    .then(function (roleOrDeptAnswer) {
      if (roleOrDeptAnswer.roleOrDept === "Role") {
        inquirer
          .prompt([
            {
              name: "roleId",
              type: "input",
              message:
                "What is the ID number for the employee who is being updated?",
            },
            {
              name: "newRole",
              type: "input",
              message: "What is the new role for this employee?",
            },
          ])
          .then(function (newRoleAnswer) {
            connection.query(
              "UPDATE role SET ? WHERE ?;",
              [
                {
                  title: newRoleAnswer.newRole,
                },
                {
                  department_id: newRoleAnswer.roleId,
                },
              ],
              function (err) {
                if (err) throw err;
                questions();
              }
            );
          });
      } else {
        inquirer
          .prompt([
            {
              name: "deptId",
              type: "input",
              message:
                "What is the ID number for the employee updating?",
            },
            {
              name: "newDept",
              type: "input",
              message: "What is the new department for this employee?",
            },
          ])
          .then(function (newDeptAnswer) {
            connection.query(
              "UPDATE departments SET ? WHERE ?;",
              [
                {
                  department: newDeptAnswer.newDept,
                },
                {
                  id: newDeptAnswer.deptId,
                },
              ],
              function (err) {
                if (err) throw err;
                questions();
              }
            );
          });
      }
    });
}
