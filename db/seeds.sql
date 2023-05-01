INSERT INTO department(dep_name)
VALUES ('Computer Department'),
       ('Electronic Department'),
       ('Chemical Department'),
       ('CIVIL Department'),
       ('Mechanical Department');

INSERT INTO  role(title, salary, department_id )
VALUES ( "Web Devloper", 5000.00, 3 ),
        ( "Wireman", 4000.00, 5),
        ( "Product Engineer", 3000.00, 2),
        ( "Software tester", 1000.00, 1),
             ( "Motor Engineer", 3000.00, 5);


INSERT INTO manager( manager_name)
VALUES ( "Nikhil"),
( "Amol"),
( "Shobha"),
("Krushanrao"),
( "Renu");

INSERT INTO employee( first_name, last_name,  role_id, manager_id)
VALUES ( "Anuja", "Lawankar",2, 4),
           ("Agniv", "Shinde", 5, 3),
            ( "Janvi", "Lawankar", 4, 2),
         ( "Yash",  "shinde", 3, 5),
         ( "Saransh", "Lawankar", 1, 2);

