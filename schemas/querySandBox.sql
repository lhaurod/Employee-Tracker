USE employee_db;
-- VIEW ALL DEPARTMENTS**************
-- FORMATTED TABLE SHOWING DEPARTMENT NAMES AND DEPARTMENT IDs
SELECT
  id AS 'Department ID',
  name AS 'Department Name'
FROM
  department;
SELECT
  id,
  name
FROM
  department;
-- VIEW ALL ROLES**************
  -- FORMATTED TABLE SHOWING JOB TITLES, ROLE ID, DEPARTMENT THE ROLE BELONGS TO, AND SALARY FOR THAT ROLE
SELECT
  title AS Title,
  role.id,
  department.name AS Department,
  salary AS "Annual Salary USD"
FROM
  role
  LEFT JOIN department ON role.department_id = department.id
ORDER BY
  role.id;
-- VIEW ALL EMPLOYEES **************
  -- FORMATTED TABLE SHOWING EMPLOYEE IDs, FIRST NAMES, LAST NAMES, JOB TITLES, DEPARTMENTS, SALARIES, AND MANAGERS THEY REPORT TO
SELECT
  employee.id as 'Employee ID',
  employee.first_name AS 'First Name',
  employee.last_name AS 'Last Name',
  role.title AS 'Role',
  role.id AS 'Role ID',
  department.name AS 'Department Name',
  department.id AS 'Department ID',
  role.salary AS "Annual Salary USD",
  manager.last_name AS 'Reports To',
  manager.id AS 'Manager Employee ID'
FROM
  employee
  INNER JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY
  employee.role_id;
-- ADD A DEPARTMENT **************
  -- PROMPTED TO ENTER THE NAME OF THAT DEPARTMENT AND THAT DEPARTMENT IS ADDED TO THE DATABASE
INSERT INTO
  department (name) VALUE ('Security');
-- ADD A ROLE**************
  -- PROMPTED TO ENTER THE NAME, SALARY, AND DEPARTMENT FOR THE ROLE AND THAT ROLE IS ADDED TO THE DATABASE
INSERT INTO
  role (title, salary, department_id) VALUE ('Head of Security', 55000, 7);
-- ADD AN EMPLOYEE**************
  -- PROMPTED TO ENTER THE EMPLOYEE's FIRST NAME, LAST NAME, ROLE, MANAGER, and THAT EMPLOYEE IS ADDED TO THE DATABASE
INSERT INTO
  employee (first_name, last_name, role_id, manager_id) VALUE ('Kenneth', 'Watson', 17, 2);
-- UPDATE AN EMPLOYEE ROLE**************
  -- PROMPTED TO SELECT AND EMPLOYEE TO UPDATE AND THEIR NEW ROLE, AND THIS INFORMATION IS UPDATED IN THE DATABASE
UPDATE
  employee
SET
  role_id = 5
WHERE
  id = 9;
-- UPDATE AN EMPLOYEE's MANAGER**************
UPDATE
  employee
SET
  manager_id = 1
WHERE
  id = 4;
-- VIEW EMPLOYEES BY MANAGER**************
  -- view ALL employees grouped by manager
SELECT
  manager.first_name AS 'Manager First Name',
  manager.last_name AS 'Manager Last Name',
  manager.id AS 'Manager Employee ID',
  employee.first_name AS 'First Name',
  employee.last_name AS 'Last Name',
  employee.id AS 'Employee ID',
  role.title AS 'Role',
  role.id AS 'Role ID'
FROM
  employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY
  employee.manager_id ASC;
-- view ONLY employees reporting to a specific manager
SELECT
  manager.last_name AS 'Manager',
  employee.first_name AS 'First Name',
  employee.last_name AS 'Last Name',
  employee.id AS 'Employee ID',
  role.title AS 'Role',
  role.id AS 'Role ID'
FROM
  employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
WHERE
  employee.manager_id = 1
ORDER BY
  employee.last_name DESC;
-- VIEW EMPLOYEES BY DEPARTMENT**************
  -- View only employees in a specific department
SELECT
  department.name AS 'Department',
  employee.first_name AS 'First Name',
  employee.last_name AS 'Last Name',
  employee.id AS 'Employee ID',
  role.title AS 'Role',
  role.id AS 'Role ID',
  manager.last_name AS 'Reports To',
  manager.id AS 'Manager ID'
FROM
  employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
WHERE
  department.id = 2
ORDER BY
  employee.last_name DESC;
-- DELETE DEPARTMENT**************
  -- DELETES ALL ROLES AND EMPLOYEES IN THE DEPARTMENT
DELETE FROM
  department
WHERE
  id = 3;
-- DELETE ROLES**************
  -- WILL ALSO DELETE ALL EMPLOYEES WHOSE employee.role_id MATCHES THE ROLE BEING DELETED. PROMPT TO WARN FIRST. 
DELETE FROM
  role
WHERE
  id = 17;
-- DELETE EMPLOYEES
  -- DOES NOT RENDER ANY FIELDS NULL BUT MAY RENDER SOME ROLES UNFILLED. IF ANY ROLES UNFILLED, PROMPT TO EITHER LEAVE NULL, ADD NEW EMPLOYEE FOR THE ROLE, OR DELETE ROLE.
DELETE FROM
  employee
WHERE
  id = 25;
-- SHOW THE SUM TOTAL OF EMPLOYEE SALARIES BY DEPARTMENT
  -- See budget by department for ALL departments
SELECT
  name AS 'Department',
  SUM(role.salary) AS 'Department Annual Budget'
FROM
  department
  LEFT JOIN role ON department.id = role.department_id
GROUP BY
  department.id;
-- See budget by department for INDIVIDUAL departments
SELECT
  name AS 'Department',
  SUM(role.salary) AS 'Department Annual Budget'
FROM
  department
  LEFT JOIN role ON department.id = role.department_id
WHERE
  department.id = 1;
SELECT
  *
FROM
  role;
SELECT
  *
FROM
  employee;
  
  
SELECT 
last_name AS LastName
FROM employee 
WHERE role_id < 4;
