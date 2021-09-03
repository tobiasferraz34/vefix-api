const Oficina = require('../models/oficinas')
const Auth = require('../models/auth');
const oficinas = require('../models/oficinas');

module.exports = app => {

    app.get('/oficinas/:id/perfil', Auth.verificaJWT, (req, res) => {
        Oficina.buscaPorId(req.userId, res);
    });

    app.post('/oficinas', (req, res) => {
        const oficina = req.body;
        console.log(req.body);
        Oficina.adiciona(oficina, res);
    });

    app.put('/oficinas/:id', Auth.verificaJWT, (req, res) => {
        const id_oficina = req.params.id;
        const valores = req.body;
        Oficina.altera(id_oficina, valores, res);
    });

    app.get('/oficinas', (req, res) => {
        if(req.query.nome) return Oficina.buscaPorNome(req.query.nome, res);
        oficinas.lista(res);
    });

    app.get('/oficinas/:id/produtos', (req, res) => {
        const id_oficina = req.params.id;
        Oficina.listaProdutosPorIdOficina(id_oficina, res);
    });

    app.get('/oficinas/:id/clientes', Auth.verificaJWT, (req, res) => {
        const id_oficina = req.userId;
        Oficina.listaClientesPorIdOficina(id_oficina, res);
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

    app.get('/oficinas/:id/pedidos', Auth.verificaJWT, (req, res) => {
        Oficina.listaPedidos(req.userId, res);
    });

    app.get('/oficinas/:uf/:municipio', Auth.verificaJWT,(req, res) => {
        const uf = req.params.uf;
        const municipio = req.params.municipio;
        Oficina.listaOficinasPorEstadoEMunicipio(uf, municipio, res);
    });

    app.post('/oficinas/:id/produtos', Auth.verificaJWT, (req, res) => {
        const id_oficina = req.userId;
        const produto = req.body;
        //console.log(produto);
        Oficina.adicionarProdutos(id_oficina, produto, res);
    });

    

}