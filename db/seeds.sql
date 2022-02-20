INSERT INTO department (name)
VALUES 
("Finance"),
("Engineering"),
("legal"),
("Sales");



INSERT INTO role (title, salary, department_id)
VALUES 
("Salesperson", 80000, 4),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 160000, 1),
("Accountant", 125000, 1),
("Legal Team Lead", 250000, 3),
("Lawyer", 190000, 3);




INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES 
("Mike", "Cham", 1, NULL),
("Ashely", "Rodriguez", 2, 1),
 ("Kevin", "Tupik", 3, 1),
 ("Kunal", "Singh", 4, 1),
 ("Malin", "Brown", 5, 1),
 ("Sarah", "Lourd", 6, 1),
 ("Tom", "Allen", 7, 1);