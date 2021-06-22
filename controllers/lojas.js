const Loja = require("../models/lojas");

module.exports = app => {

    app.post('/lojas/pedidos', (req, res) => {
        
        
    });
   
    app.get('/lojas/:nome/produtos', (req, res) => {
        //console.log(req.params.nome);
        const nome_loja = req.params.nome;
        Loja.listaProdutos(nome_loja, res)
    });
}