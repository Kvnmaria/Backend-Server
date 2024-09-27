const mysql = require('mysql');
const dotenv = require('dotenv');

/*
Loads the .env file content into process.env
 Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }
 @returns — an object with a parsed key if successful or error key if an error occurred
*/
dotenv.config();

// Creating a Database Connection 
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// Connecting to the MySql Database
function databaseConnection() {
    return new Promise((resolve, reject) => {

        con.connect(err => {
            if (!err) {
                resolve(true)
            } else {
                reject(err)
            }
        })
        return;
    })
}

module.exports = {
    con,
    databaseConnection
};