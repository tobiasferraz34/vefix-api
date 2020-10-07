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
        const id_atendimento = req.query.id_atendimento ?  `AND atendimentos.id = '${req.query.id_atendimento}'` : "";
        const servico = req.query.servico ?  `AND atendimentos.servico like '%${req.query.servico}%'` : "";
        const cliente =  req.query.cliente ?  `AND usuarios.nome like '%${req.query.cliente}%'` : "";
        const placaVeiculo = req.query.placaVeiculo ? `AND veiculos.placa = '${req.query.placaVeiculo}'` : "";
        const modeloVeiculo = req.query.modeloVeiculo ? `AND veiculos.modelo like '%${req.query.modeloVeiculo}%'` : "";
        const statusAtendimento = req.query.statusAtendimento ? `AND atendimentos.status = '${req.query.statusAtendimento}'` : "";
    
        Oficina.listaAtendimentos(req.userId, dataAtual, id_atendimento, servico, cliente, placaVeiculo, modeloVeiculo, statusAtendimento, res);
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
        Oficina.buscaPorId(req.userId, res);
    });
}