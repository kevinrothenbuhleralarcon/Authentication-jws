const mysql = require("mysql")
const dotenv = require("dotenv")
const dbURI = dotenv.parse(process.env.MYSQL_URI)

const connection = mysql.createConnection(dbURI)

connection.connect(err => {
    if (err) {
        console.log("BD connection error: " + err.stack)
        return;
    }

    console.log("Connected in DB")
})

module.exports = connection


