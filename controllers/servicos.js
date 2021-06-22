
const Servico = require('../models/servicos');

module.exports = app => {

    app.get('/servicos', (req, res) => {
        Servico.listaServicos(res);
    });

    app.get('/servicos/:id/oficinas', (req, res) => {
        const id = req.params.id;
        //console.log(id)
        Servico.listaOficinas(id, res);
    });
}