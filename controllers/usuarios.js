const Usuario = require('../models/usuarios');
const auth = require('../models/auth');
const niveisAcesso = require('../services/niveisAcesso');

module.exports = app => {

    app.post('/usuarios', (req, res) => {
        const usuario = req.body;
        Usuario.adiciona(usuario, res);
    });

    app.get('/usuarios', auth.verificaJWT, (req, res) => {
        if(auth.verificaNivelAcesso(req.nivelAcesso, niveisAcesso.admin)) {
            res.status(401).send({ auth: false, message: 'Você não possui permissão' });
        }
        Usuario.lista(res);
    });

    app.get('/usuarios/:id', auth.verificaJWT, (req, res) => {
        const id = req.userId;
        Usuario.buscaPorId(id, res);
    });

    app.get('/usuarios/:id/atendimentos', auth.verificaJWT, (req, res) => {
        const placaVeiculo = req.query.placaVeiculo ? `AND veiculos.placa = '${req.query.placaVeiculo}'` : ''; 
        const nomeOficina = req.query.nomeOficina ? `AND oficinas.nome = '${req.query.nomeOficina}'` : '';
        const servico = req.query.servico ? `AND atendimentos.servico = '${req.query.servico}'` : ''; 
        const dt_agend = req.query.dt_agend ? `AND atendimentos.data_agendamento = '${req.query.dt_agend}'` : '';
        Usuario.listaAtendimentos(req.userId, placaVeiculo, nomeOficina, servico, dt_agend, res);
    });

    app.get('/usuarios/:id/veiculos', auth.verificaJWT, (req, res) => {
        Usuario.listaVeiculos(req.userId, res);
    });

    app.put('/usuarios/:id', auth.verificaJWT, (req, res) => {
        const id = req.params.id;
        const valores = req.body;
        Usuario.altera(id, valores, res);
    })

}