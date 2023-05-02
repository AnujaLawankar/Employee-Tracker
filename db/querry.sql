SELECT * FROM department;

SELECT * FROM role;


SELECT * FROM employee;



-- SELECT e.id, e.first_name, e.last_name, r.title, m.manager_name
-- FROM employee e
-- JOIN manager m ON e.manager_id = m.id
-- JOIN role r ON e.role_id = r.id;


SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dep_name, concat (m.first_name, " ", m.last_name) as manager
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
JOIN employee m ON e.manager_id = m.id;


SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dep_name, concat (m.first_name, " ", m.last_name) as manager
    FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id JOIN employee m ON e.manager_id = m.id