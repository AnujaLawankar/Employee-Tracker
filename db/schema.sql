DROP DATABASE IF EXISTS cms_db;

CREATE DATABASE cms_db;

USE cms_db;

CREATE TABLE  department( 
id INT NOT NULL AUTO_INCREMENT,
dep_name VARCHAR(30),
PRIMARY KEY (id)
);


CREATE TABLE  role( 
id INT NOT NULL AUTO_INCREMENT, 
title VARCHAR(30), 
salary DECIMAL, 
department_id INT,
PRIMARY KEY (id),
 FOREIGN KEY (department_id)
  REFERENCES department(id)
  ON DELETE SET NULL);


  CREATE TABLE manager(
    id INT AUTO_INCREMENT,
    manager_name VARCHAR(30),
    PRIMARY KEY (id));

CREATE TABLE  employee( 
id INT NOT NULL AUTO_INCREMENT, 
first_name VARCHAR(30),
 last_name VARCHAR(30),
  role_id INT ,
   manager_id INT ,
PRIMARY KEY (id),
FOREIGN KEY (role_id)
  REFERENCES role(id)
  ON DELETE SET NULL,
  
  FOREIGN KEY (manager_id)
  REFERENCES manager(id)
  ON DELETE SET NULL);
