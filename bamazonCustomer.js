// Setting up dependencies
var mysql = require('mysql')
var inquirer = require('inquirer')
var colors = require('colors')

// Setting up a connection to the mySQL database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeUser',
    password: '',
    database: 'bamazon_DB'
})

// Error handling for the database connection. If no error,
// runs the application.
connection.connect(function (err) {
    if (err) throw err
    start()
})

// The start function which prompts the user if they'd like
// to look at the existing inventory
function start() {
    inquirer
        .prompt({
            name: 'welcome',
            type: 'list',
            message: 'Welcome to Bamazon!\n Would you like to browse our store?'.green,
            choices: ['YES', 'EXIT']
        })

        // If the user answers yes, the inventory is displayed
        // via the showItems function. If the user chooses to
        // exit, the connection ends and exits the application.
        .then(function (answer) {
            if (answer.welcome === 'YES') {
                showItems()
            } else {
                connection.end()
            }
        })
}

// Defining the showItems function that pulls from the 'items' table.
function showItems() {
    connection.query('SELECT * FROM items', function(err, res) {
        // Error handling.
        if (err) throw err;

        console.log("\nExisting Inventory: ");
        
        // Loops through the items in the table and displays each item.
        for(var i = 0; i < res.length; i++){
        console.log("---------------------------------------------------------------------------------")
        console.log("ID ".green + res[i].id + " | " + "Product: ".green + res[i].item_name + " | " + "Category: ".green + res[i].category + " | " + "Qty: ".green + res[i].quantity + " | " + "Price: ".green + "$" + res[i].price)
        console.log("---------------------------------------------------------------------------------");
        }
        // Once the items table is displayed, runs the userPurchase function.
        userPurchase();
    })
}

// Defining the userPurchase function which asks the user first which item they would like
// and then how many of the item.
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
    ])
    // Based on the input the user provides, the function selects that particular item.
    .then(function(input) {
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
                
                // Conditional statement that checks to make sure there is enough of the item in stock.
                if(inputQuantity <= itemData.quantity) {
                    console.log('Item is in stock! Order being placed.');
                    var updateQueryDB = 'UPDATE items SET quantity = ' + (itemData.quantity - inputQuantity) + ' WHERE id = ' + product;

                    // Updates the quantity of the item in the table.
                    connection.query(updateQueryDB, function(err, data) {
                        if(err) throw err;
                        
                        // Lets the user know the order has been placed and adds up the total.
                        console.log('You order has been placed! \nThe total is: $' + itemData.price * inputQuantity);
                        // Runs the exit function.
                        exit();
                    })
                }
                // If there is not enough quantity of stock, it will log a message and 
                // run the showItems function again so that the user can select a valid amount. 
                else {
                    console.log('Not enough items in stock, please modify your order.');
                    showItems();
                }
            }
        })
    })
}


// Exit function that prompts the user if they'd like to buy anything else or if they'd like
// to exit the application.
function exit() {
  inquirer
    .prompt({
      name: "goodbye",
      type: "list",
      message: "Would you like to buy anything else?",
      choices: ["YES", "EXIT"]
    })
    // If the user wants to buy additional things, the showItems function is run again.
    .then(function(answer) {
      if (answer.goodbye === "YES") {
        showItems();
      } else {
          // If they choose EXIT, the connection ends.
        connection.end();
      }
    });
}