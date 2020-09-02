const Avaliacao = require('../models/avaliacao');
 
module.exports = app => {
    app.post('/avaliacao', (req, res) => {
        const avaliacao = req.body;
        Avaliacao.adiciona(avaliacao, res);
    });

    app.get('/avaliacao/oficinas', (req, res) => {
        Avaliacao.listaOficinas(res);
    });
}