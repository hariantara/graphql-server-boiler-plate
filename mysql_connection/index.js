const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
// create the connection to database
const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    port     : process.env.DB_PORT,
    debug    : false,
    promise  : bluebird
});

module.exports = connection
