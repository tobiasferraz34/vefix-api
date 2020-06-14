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

        const PORT = 19333 || 4000;


        app.listen({PORT}, () => console.log(`Servidor rodando na porta ${PORT}`));
    }
})


