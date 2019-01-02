var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("hellos")
    choices();
})

function choices() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(function(answer) {
        switch (answer.choice) {
            case 'View Products For Sale':
                viewAll();
                break;
            case 'View Low Inventory':
                viewLow();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
                // console.log('add to inventory')
            case 'Add New Product':
                addProduct();
                // console.log('add new product')
                break;
        }
    })
}

function viewAll() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        // console.log(results);
        for (i=0; i<results.length; i++) {
            var id = results[i].item_id;
            var name = results[i].product_name;
            var price = results[i].price;
            var stock = results[i].stock_quantity;
            var itemDisplay = '---------------------------\nItem ID: ' + id + '\nProduct Name: ' + name + '\nPrice: ' + price + '\nStock Quantity: ' + stock + '\n'
            console.log(itemDisplay);
        }
        choices();
    })
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
        if (err) throw err;
        // console.log(results);
        for (i=0; i<results.length; i++) {
            var id = results[i].item_id;
            var name = results[i].product_name;
            var price = results[i].price;
            var stock = results[i].stock_quantity;
            var itemDisplay = 'Item ID: ' + id + '\nProduct Name: ' + name + '\nPrice: ' + price + '\nStock Quantity: ' + stock + '\n---------------------------'
            console.log(itemDisplay);
        }
        choices();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'product',
                message: 'Select product:',
                choices: function() {
                    var choiceArray = [];
                    for (i=0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name)
                    }
                    return choiceArray;
                }
            },
            {
                type: 'input',
                name: 'howMany',
                message: 'How much inventory are you adding?'
            }
        ]).then(function(answer) {
            var itemChoice;
            for (i=0; i < results.length; i++) {
                if (answer.product === results[i].product_name) {
                    itemChoice = results[i]
                    break
                }
            }
            var newQuant = parseInt(itemChoice.stock_quantity) + parseInt(answer.howMany)
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, itemChoice.item_id], function(err) {
                if (err) throw err;
                console.log('The new quantity for ' + answer.product.toLowerCase() + ' is ' + newQuant + '.')
            })
            choices();
        })
    })
}

function addProduct() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'product',
                type: 'input',
                message: 'Product name: '
            },
            {
                name: 'department',
                type: 'list',
                message: 'Product department: ',
                choices: function() {
                    var choiceArr = [];
                    for (i=0; i < results.length; i++) {
                        choiceArr.push(results[i].department_name)
                    }
                    choiceArr = choiceArr.filter((x, i, a) => a.indexOf(x) == i)
                    return choiceArr;
                }
            },
            {
                name: 'price',
                type: 'input',
                message: 'Product price: ',
            },
            {
                name: 'stock',
                type: 'input',
                message: "Quantity in stock: "
            }
        ]).then(function(answer) {
            connection.query("INSERT INTO products SET ?", 
        {
            product_name: answer.product,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.stock
        }, function(err) {
            if (err) throw err;
            console.log('The new product ' + answer.product + ' has been added.')
        })
        choices();
        })
    })
        
}