var mysql = require('mysql');
var inquirer = require('inquirer');

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
    getData();
})

function getData() {
    connection.query("SELECT * FROM products", function(err, results) {
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
        whatToPurchase();
    })
}

function whatToPurchase() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product',
            message: 'Enter the ID of the product you would like to purchase: '
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'Enter the quantity that you would like to purchase: ',
            validate: function(quant) {
                return Number.isInteger(parseInt(quant))
            }
        }
    ]).then(function(answer) {
        connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            var itemChoice;
            for (i=0; i<results.length; i++) {
                if (parseInt(answer.product) === results[i].item_id) {
                    itemChoice = results[i]
                    break;
                }
            }
            if (itemChoice.stock_quantity < parseInt(answer.quantity)) {
                console.log("Insufficient quantity!")
            } else {
                var newQuant = parseInt(itemChoice.stock_quantity) - parseInt(answer.quantity);
                var totalPurchase = itemChoice.price * parseInt(answer.quantity);
                var department = itemChoice.department_name
                connection.query("UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE item_id = ?", [newQuant, totalPurchase, parseInt(answer.product)], function(err) {
                    if (err) throw err;
                })
                var productSales;
                console.log("Your total purchase: $" + totalPurchase);
            }
            another();
        })
    })
}

function another() {
    inquirer.prompt([
        {
            name: 'again',
            type: 'confirm',
            message: 'Would you like to make another purchase?'
        }
    ]).then(function(answer) {
        // if (err) throw err;
        if (answer.again) {
            getData();
        } else {
            console.log("Thank you, come again!")
        }
    })
}