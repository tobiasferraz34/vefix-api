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
        } 
        
        Oficina.lista(res)
        
    });

    app.get('/oficinas/:id/atendimentos', Auth.verificaJWT, (req, res) => {
        const dataAtual =  req.query.dataAtual ?  `AND atendimentos.data_agendamento = '${req.query.dataAtual}'` : "";
        const placaVeiculo = req.query.placaVeiculo ? `AND veiculos.placa = '${req.query.placaVeiculo}'` : "";
        const modeloVeiculo = req.query.modeloVeiculo ? `AND veiculos.modelo like '%${req.query.modeloVeiculo}%'` : "";
    
        Oficina.listaAtendimentos(req.userId, dataAtual, placaVeiculo, modeloVeiculo, res);
    });

    app.get('/oficinas/:id/ordem_servicos', Auth.verificaJWT, (req, res) => {
        Oficina.listaOrdemServicos(req.userId, res);
    });

    app.get('/oficinas/:uf/:municipio', Auth.verificaJWT,(req, res) => {
        const uf = req.params.uf;
        const municipio = req.params.municipio;
        Oficina.listaOficinasPorEstadoEMunicipio(uf, municipio, res);
    });

    app.get('/oficinas/:id', Auth.verificaJWT, (req, res) => {
        console.log(req.userId)
        Oficina.buscaPorId(req.userId, res);
    });
}