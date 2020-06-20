require("dotenv-safe").config({
    allowEmptyValues: true
});

console.log(process.env.DB_PASS);

//A responsabilidade desse arquivo é subir o servidor
const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

Tabelas.init(conexao);
const app = customExpress();
var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor rodando na porta 3000"));


