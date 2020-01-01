const mysql = require('mysql')

const connect = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'skripswi'
})

connect.connect((err) => {
  if (err) throw err;
})

module.exports = connect