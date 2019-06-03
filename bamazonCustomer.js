var mysql = require('mysql')
var inquirer = require('inquirer')
var colors = require('colors')

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon_DB'
})

connection.connect(function (err) {
    if (err) throw err
    start()
})

function start() {
    inquirer
        .prompt({
            name: 'welcome',
            type: 'list',
            message: 'Welcome to Bamazon!\n Would you like to browse our store?'.green,
            choices: ['YES', 'EXIT']
        })
        .then(function (answer) {
            if (answer.welcome === 'YES') {
                showItems()
            } else {
                connection.end()
            }
        })
}

function showItems() {
    connection.query('SELECT * FROM items', function(err, res) {
        if (err) throw err;

        console.log("\nExisting Inventory: ");

        for(var i = 0; i < res.length; i++){
        console.log("---------------------------------------------------------------------------------")
        console.log("ID ".green + res[i].id + " | " + "Product: ".green + res[i].item_name + " | " + "Category: ".green + res[i].category + " | " + "Qty: ".green + res[i].quantity + " | " + "Price: ".green + res[i].price)
        console.log("---------------------------------------------------------------------------------");
        }
        userPurchase();
    })
}

function userPurchase() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'id',
            message: 'Enter the ID of the item that you would like to purchase: '.green,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like? '.green,
            filter: Number
        }
    ]).then(function(input) {
        var product = input.id;
        var inputQuantity = input.quantity;
        var queryDB = 'SELECT * FROM items WHERE ?';

        connection.query(queryDB, {id: product}, function(err, data) {
            if(err) throw err;

            if(data.length === 0) {
                console.log('Please select a valid item ID.');
                showItems();
            } else {
                var itemData = data[0];

                if(inputQuantity <= itemData.quantity) {
                    console.log('Item is in stock! Order being placed.');
                    var updateQueryDB = 'UPDATE items SET quantity = ' + (itemData.quantity - inputQuantity) + ' WHERE id = ' + product;

                    connection.query(updateQueryDB, function(err, data) {
                        if(err) throw err;

                        console.log('You order has been placed! The total is: $' + itemData.price * inputQuantity);
                        exit();
                    })
                } else {
                    console.log('Not enough items in stock, please modify your order.');
                    showItems();
                }
            }
        })
    })
}

function exit() {
  inquirer
    .prompt({
      name: "goodbye",
      type: "list",
      message: "Would you like to buy anything else?",
      choices: ["YES", "EXIT"]
    })
    .then(function(answer) {
      if (answer.goodbye === "YES") {
        showItems();
      } else {
        connection.end();
      }
    });
}