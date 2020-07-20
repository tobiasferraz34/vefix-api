const Oficina = require('../models/oficinas')
const Auth = require('../models/auth');
const niveisAcesso = require('../services/niveisAcesso');

module.exports = app => {

    app.post('/oficinas', (req, res) => {
        const oficina = req.body;
        Oficina.adiciona(oficina, res);
    });

    app.get('/oficinas', Auth.verificaJWT, (req, res) => {
        if(Auth.verificaNivelAcesso(req.nivelAcesso, niveisAcesso.admin)) {
            res.status(401).send({ auth: false, message: 'Você não possui permissão' });
        } else {
            Oficina.lista(res)
        }
    });

    app.get('/oficinas/:uf', Auth.verificaJWT,(req, res) => {
        const uf = req.params.uf;
        Oficina.listaOficinasPorEstado(uf, res)
    });

    app.get('/oficinas/:id/atendimentos', Auth.verificaJWT, (req, res) => {
        Oficina.listaAtendimentos(req.userId, res);
    })
}