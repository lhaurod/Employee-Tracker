USE employee_db;

INSERT INTO department(name) 
	VALUES 
	('Management'), 
    ('Engineering'), 
	('Sales'), 
    ('Customer Service'), 
    ('Technical Support'), 
    ('Human Resources'); 
    
SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
	VALUES
    ('CEO', 500000, 1),
    ('Manager', 150000, 1),
    ('Supervisor', 75000, 1),
    ('Engineer I', 50000, 2),
    ('Engineer II', 75000, 2),
    ('Senior Engineer', 100000, 2),
    ('Telemarketer', 45000, 3),
    ('Sales Developer', 65000, 3),
    ('Marketing Consultant', 75000, 3),
    ('Customer Service Agent', 45000, 4),
    ('Customer Service Trainer', 45000, 4),
    ('Technical Support Specialist', 55000, 5),
    ('Database Administrator', 55000, 5),
    ('Human Resources Generalist', 55000, 6),
    ('Talent Acquisition Specialist', 55000, 6);
    
SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
	VALUES
    ('Sharyn', 'Pawloski', 1, NULL), 
    ('Lavonda', 'Juneau', 2, 1), 
    ('Lanelle', 'Badger', 2, 1), 
    ('Edra', 'Rudie', 3, 2), 
    ('Monet', 'Piscopo', 3, 2), 
    ('Ray', 'Moorefield', 3, 3), 
    ('Larry', 'Ripley', 3, 3), 
	('Julie', 'Mowry', 3, 3), 
    ('Johnie', 'Henault', 4, 4),
    ('Zachariah', 'Merriman', 5, 4),
    ('Krystal', 'Tippit', 6, 4),
    ('Josephine', 'Selders', 7, 5),
    ('Mauro', 'Cutshaw', 8, 5),
    ('Clyde', 'Mayeda', 8, 5),
    ('Jasmin', 'Drinnon', 9, 5),
    ('Sean', 'Kurz', 10, 6),
    ('Kathie', 'Tolar', 10, 6),
    ('Sherman', 'Haverly', 10, 6),
    ('Micha', 'Carmon', 11, 6),
    ('Ghislaine', 'Bumpus', 12, 7),
    ('Filiberto', 'Hammontree', 12, 7),
    ('Tyisha', 'Lightsey', 13, 7),
    ('Myung', 'Blackmer', 14, 8),
    ('Sarina', 'Karl', 15, 8);
    
    SELECT * FROM employee;
     
    
    
    
    
    
    
    
    
    
    
    