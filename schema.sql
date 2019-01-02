DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(5, 2),
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Pants', 'Clothing', 25, 20),
('Shirt', 'Clothing', 20, 30),
('Hat', 'Clothing', 15, 20),
('Television', 'Electronics', 500, 5),
('Nintendo Switch', 'Electronics', 250, 8),
('FIFA 2019', 'Electronics', 60, 15),
('Banana', 'Food', 1.50, 100),
('Count Chocula Cereal', 'Food', 5, 25),
('Lunchables', 'Food', 7, 20),
('Bread', 'Food', 3, 40);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL,
    overhead_costs INTEGER(20) NOT NULL,
    PRIMARY KEY (department_id)
);

ALTER TABLE products
    ADD product_sales INTEGER(20) DEFAULT 0;

INSERT INTO departments (department_name, overhead_costs)
VALUES ('Clothing', 500),
('Electronics', 2000),
('Food', 1000);

SELECT * FROM bamazon.products;
SELECT * FROM bamazon.departments;