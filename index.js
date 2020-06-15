//A responsabilidade desse arquivo é subir o servidor
const customExpress = require('./config/customExpress');
const conexao = require('./infraestrutura/conexao');
const Tabelas = require('./infraestrutura/tabelas');

conexao.connect(erro => {
    if (erro) {
        console.log(erro);
    } else {
        console.log("Conectado com sucesso");

        Tabelas.init(conexao);
        const app = customExpress();
        var port = process.env.PORT || 3000;
        app.listen(port, () => console.log("Servidor rodando na porta 4000"));
    }
})


