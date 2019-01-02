var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    choices();
})

function choices() {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            choices: ['View Product Sales by Department', 'Create New Department'],
            message: 'What would you like to do?'
        }
    ]).then(function(answer) {
        switch (answer.choice) {
            case 'View Product Sales by Department':
                viewSales();
                break;
            case 'Create New Department':
                createDepartment();
                break;
        }
    })
}

function viewSales() {
    connection.query("SELECT department_id, department_name, overhead_costs, product_sales, product_sales - overhead_costs as profit FROM (SELECT departments.department_id, departments.department_name, departments.overhead_costs, COALESCE(SUM(products.product_sales), 0) AS product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id) as t", function(err, results) {
        if (err) throw err;
        // console.table(results, ['department_id', 'department_name', 'overhead_costs']);
        console.table(results);
        another();
    })
    
}

function createDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Department Name: '
        },
        {
            type: 'input',
            name: 'overhead',
            message: 'Overhead Costs: '
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO departments SET department_name = ?, overhead_costs = ?", [answer.name, answer.overhead]
        // {
        //     department_name: answer.name,
        //     overhead_costs: answer.overhead
        // }
        , function(err) {
            if (err) throw err;
            console.log("Department successfully added.")
        })
        another();
    })
}

function another() {
    inquirer.prompt([
        {
            name: 'again',
            type: 'confirm',
            message: 'Would you like to do something else?'
        }
    ]).then(function(answer) {
        // if (err) throw err;
        if (answer.again) {
            choices();
        } else {
            console.log("Thank you, come again!")
        }
    })
}