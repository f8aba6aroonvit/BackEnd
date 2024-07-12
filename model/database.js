const mysql = require('mysql2')
const mySqlPool = mysql.createPool({
    host : "localhost",
    user : "root",
    password:"",
    database : "mmorpg"
})
module.exports= mySqlPool.promise()