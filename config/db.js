require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
}).promise();

connection.connect()
  .then(() => {
    console.log('Conectado a MySQL con promesas');
  })
  .catch(err => {
    console.error('Error al conectar a MySQL:', err);
  });

module.exports = connection;
