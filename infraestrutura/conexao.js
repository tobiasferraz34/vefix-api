const mysql = require('mysql');

const conexao = mysql.createConnection({
    host: 'mysql669.umbler.com',
    user: 'vefix',
    password: 'vefix6287',
    database: 'vefix'
});

module.exports = conexao

