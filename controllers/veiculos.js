const Veiculos = require('../models/veiculos');

module.exports = app => {
    app.post('/veiculos', (req, res) => {
        const veiculo = req.body;
        Veiculos.adiciona(veiculo, res);
    });

    app.get('/veiculos/:id', (req, res) => {
        const id = parseInt(req.params.id)
        Veiculos.buscaPorId(id, res)
    })
}