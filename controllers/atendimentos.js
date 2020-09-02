const Atendimento = require('../models/atendimentos');
const Auth = require('../models/auth');
const niveisAcesso = require('../services/niveisAcesso');

module.exports = app => {
    app.get('/atendimentos', Auth.verificaJWT, (req, res) => {
        if(Auth.verificaNivelAcesso(req.nivelAcesso, niveisAcesso.admin)) {
            res.status(401).send({ auth: false, message: 'Você não possui permissão' });
        }

        const placaVeiculo = req.query.placaVeiculo ? `AND veiculos.placa = '${req.query.placaVeiculo}'`: '';
        const marcaVeiculo = req.query.marcaVeiculo ? `AND veiculos.marca LIKE '%${req.query.marcaVeiculo}%'`: '';
        const modeloVeiculo = req.query.modeloVeiculo ? `AND veiculos.modelo LIKE '%${req.query.modeloVeiculo}%'`: '';
        const servico = req.query.servico ? `AND atendimentos.servico LIKE '%${req.query.servico}%'`: '';
        const dt_agend = req.query.dt_agend ? `AND atendimentos.data_agendamento = '${req.query.dt_agend}'`: '';

        Atendimento.lista(placaVeiculo, marcaVeiculo, modeloVeiculo, servico, dt_agend, res);    

    });

    app.get('/atendimentos/:id', (req, res) => {
        //console.log(req.params);
        const id = parseInt(req.params.id);
        Atendimento.buscaPorId(id, res);
    });

    app.post('/atendimentos', Auth.verificaJWT, (req, res) => {
        
        const id_cliente = req.userId;
        const atendimento = {...req.body, id_cliente};

        Atendimento.adiciona(atendimento, res);
    });
    
    app.patch('/atendimentos/:id', (req, res) => {''
        const id = parseInt(req.params.id);
        const valores = req.body;
        Atendimento.altera(id, valores, res);
    });

    app.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        Atendimento.deleta(id, res);
    });
}