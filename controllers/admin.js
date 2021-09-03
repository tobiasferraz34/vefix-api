const Admin = require('../models/admin');
const Auth = require('../models/auth');

module.exports = (app) => {

  app.get('/admin/:id/usuarios', Auth.verificaJWT, (req, res) => {
    Admin.listaUsuarios(res);
  });

  app.get('/admin/:id/oficinas', Auth.verificaJWT, (req, res) => {
    Admin.listaOficinas(res);
  });

  app.get('/admin/:id/veiculos', Auth.verificaJWT, (req, res) => {
    Admin.listaVeiculos(res);
  });

  app.get('/admin/:id/atendimentos', Auth.verificaJWT, (req, res) => {
    //console.log(req.userId);
    const placaVeiculo = req.query.placaVeiculo ? `AND veiculos.placa = '${req.query.placaVeiculo}'`: '';
    const marcaVeiculo = req.query.marcaVeiculo ? `AND veiculos.marca LIKE '%${req.query.marcaVeiculo}%'`: '';
    const modeloVeiculo = req.query.modeloVeiculo ? `AND veiculos.modelo LIKE '%${req.query.modeloVeiculo}%'`: '';
    const servico = req.query.servico ? `AND atendimentos.servico LIKE '%${req.query.servico}%'`: '';
    const dt_agend = req.query.dt_agend ? `AND atendimentos.data_agendamento = '${req.query.dt_agend}'`: '';

    Admin.listaAtendimentos(placaVeiculo, marcaVeiculo, modeloVeiculo, servico, dt_agend, res);
    
  });

  app.get('/admin/:id/pedidos', Auth.verificaJWT, (req, res) => {
    Admin.listaPedidos(res);
  });

  app.get('/admin/:id/ordens_servicos', Auth.verificaJWT, (req, res) => {
    Admin.listaOrdensServicos(res);
  });
  
};
