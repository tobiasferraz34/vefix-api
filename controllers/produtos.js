const Produto = require('../models/produtos');
const Auth = require('../models/auth');

module.exports = app => {

    app.post('/produtos', Auth.verificaJWT, (req, res) => {
        const produto = req.body;
        Produto.adiciona(produto, res);
    });

    app.put('/produtos/:id', Auth.verificaJWT, (req, res) => {''
        const id = parseInt(req.params.id);
        const valores = req.body;
        //console.log(valores);
        Produto.altera(id, valores, res);
    });

    app.delete('/produtos/:id', Auth.verificaJWT, (req, res) => {
        const id = parseInt(req.params.id);
        Produto.deleta(id, res);
    });
    
}