const ItensServicos = require('../models/itens_servicos');
const { json } = require('body-parser');

module.exports = app => {
    app.post('/itens_servicos', (req, res) => {
        const itemServico = req.body; 
        ItensServicos.adiciona(itemServico, res);
    });

    app.put('/itens_servicos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;
        ItensServicos.altera(id, valores, res);
    })
}