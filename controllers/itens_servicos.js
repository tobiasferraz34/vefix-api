const ItensServicos = require('../models/itens_servicos');
const Auth = require('../models/auth');

module.exports = app => {
    app.post('/itens_servicos',  Auth.verificaJWT, (req, res) => {
        const itemServico = req.body; 
        ItensServicos.adiciona(itemServico, res);
    });

    app.put('/itens_servicos/:id',  Auth.verificaJWT, (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;
        ItensServicos.altera(id, valores, res);
    })
}