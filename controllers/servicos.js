
const Servico = require('../models/servicos');
const Auth = require('../models/auth');

module.exports = app => {

    app.post('/servicos', Auth.verificaJWT, (req, res) => {
        const servico = req.body;
        console.log(servico);
        Servico.adiciona(servico, res);
    });

    app.put('/servicos/:id', Auth.verificaJWT, (req, res) => {''
        const id = parseInt(req.params.id);
        const valores = req.body;
        console.log(id, valores);
        Servico.altera(id, valores, res);
    });

    app.get('/servicos', (req, res) => {
        Servico.listaServicos(res);
    });

    app.get('/servicos/:id/oficinas', (req, res) => {
        const id = req.params.id;
        //console.log(id)
        Servico.listaOficinas(id, res);
    });
}