var mysql = require('mysql');
var cTable = require('console.table');
var inquirer = require('inquirer');



var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'noseno',
    database: 'bamazon'
});

connection.connect();

connection.query('SELECT * FROM bamazon.products', function (error, results, fields) {
    if (error) throw error;

    results.forEach(element => {
        console.table(element);
    });
    inquirer
        .prompt([
            {
                message: "What is de id of the product you wish to buy?",
                type: "input",
                name: "productToBuy",
                validate: function validate(name) {
                    return isFinite(parseInt(name));
                }
            },
            {
                message: "How many untis do you wish to buy?",
                type: "input",
                name: "unitsToBuy",
                validate: function validate(name) {
                    return isFinite(parseInt(name));
                }
            }
        ])

        .then(answers => {
            var itemSelected = answers.productToBuy;
            var numberOfPruducts = answers.unitsToBuy;

            connection.query('SELECT * FROM bamazon.products WHERE item_id = ?', [itemSelected], function (error, results, fields) {
                var currentStock = results[0].stock_quantity;
                var totalCost = results[0].price * numberOfPruducts;

                if (error) throw error;

                else if (currentStock >= numberOfPruducts) {
                    connection.query(" UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ? ", [numberOfPruducts, itemSelected], function (error, results, fields) {
                        if (error) throw error;
                        console.log("The total cost is: $" + totalCost);
                        connection.end();
                    })

                } else {
                    console.log("Insufficient quantity!")
                    connection.end();
                }
            })
        });
});


