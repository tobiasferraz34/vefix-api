const mysql = require('mysql');

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vefix'
});

module.exports = conexao

