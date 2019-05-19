var mysql = require('mysql')
var inquirer = require('inquirer')

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
            message: 'Welcome to Bamazon! Would you like to browse our store?',
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
    break
}