require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "r00tr00t",
    database: "login_system"
});

connection.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao banco de dados', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

module.exports = connection;