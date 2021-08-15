const Loja = require('../models/lojas');
const { calcularPrecoPrazo } = require('correios-brasil');

module.exports = (app) => {

  app.get('/lojas/:nome/produtos', (req, res) => {
    //console.log(req.params.nome);
    const nome_loja = req.params.nome;
    Loja.listaProdutos(nome_loja, res);
  });

  app.get('/lojas/:nome/informacoes', (req, res) => {
    //console.log(req.params.nome);
    const nome_loja = req.params.nome;
    Loja.buscarInformacoes(nome_loja, res);
  });

  app.post('/lojas/calcularfrete', (req, res) => {
    const args = req.body;
    console.log(args);

    calcularPrecoPrazo(args).then((response) => {
        res
        .status(200)
        .json({response});
    });
  });
};
