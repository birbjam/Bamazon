DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE items(
    id INT(11) AUTO_INCREMENT,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(45) NOT NULL,
    quantity INT default 0,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id)
);