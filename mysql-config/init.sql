CREATE DATABASE IF NOT EXISTS policy_details;
USE policy_details;


CREATE TABLE IF NOT EXISTS login_details(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    firstname VARCHAR(50), 
    lastname VARCHAR(50), 
     dob DATE,
     email VARCHAR(100),
    coverage_amount INT,
    country VARCHAR(50),
    policy VARCHAR(250),
    gender VARCHAR(50)
    );