const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'db4free.net',
    user: 'vefix_atend',
    password: 'ubuntu040696',
    database: 'vefix_teste'
});

module.exports = conexao

