const OrdemServicos = require('../models/ordem_servicos');
const Auth = require('../models/auth');
module.exports = app => {

    app.post('/ordem_servicos', Auth.verificaJWT, (req, res) => {
        const ordem_servico = req.body;
        OrdemServicos.adiciona(ordem_servico, res)
    });

    app.put('/ordem_servicos/:id', (req, res) => {
        const id_os = req.params.id;
        const valores = req.body;
        console.log(valores);
        OrdemServicos.altera(id_os, valores, res)
    })

    app.get('/ordem_servicos/:id/itens_servicos', Auth.verificaJWT, (req, res) => {
        const id_os = req.params.id;
        OrdemServicos.listaItensServico(id_os, res);
    })
}