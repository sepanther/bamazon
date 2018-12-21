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
            message: 'Enter the quantity that you would like to purchase: '
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
            // console.log(itemChoice);
            // console.log("Stock: " + itemChoice.stock_quantity)
            if (itemChoice.stock_quantity < parseInt(answer.quantity)) {
                console.log("Insufficient quantity!")
            } else {
                var newQuant = parseInt(itemChoice.stock_quantity) - parseInt(answer.quantity)
                connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuant, parseInt(answer.product)], function(err) {
                    if (err) throw err;
                    console.log("The new quantity is " + newQuant)
                } )
                console.log("Your total purchase: $" + itemChoice.price * parseInt(answer.quantity));
                // console.log(itemChoice);
                // connection.query("SELECT * FROM products", function(err, results) {
                //     for (i=0; i<results.length; i++) {
                //         var id = results[i].item_id;
                //         var name = results[i].product_name;
                //         var price = results[i].price;
                //         var stock = results[i].stock_quantity;
                //         var itemDisplay = 'Item ID: ' + id + '\nProduct Name: ' + name + '\nPrice: ' + price + '\nStock Quantity: ' + stock + '\n---------------------------'
                //         console.log(itemDisplay);
                // }})
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