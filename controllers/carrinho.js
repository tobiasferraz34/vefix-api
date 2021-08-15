const Auth = require('../models/auth');
const Carrinho = require('../models/carrinho');


module.exports = app => {
    app.post('/carrinho', Auth.verificaJWT, (req, res) => {
        const id_usuario = req.userId;
        const itemPedido = {...req.body.itemPedido, id_usuario};
        Carrinho.adiciona(itemPedido, res);
    });

    app.put('/carrinho/:id', Auth.verificaJWT, (req, res) => {
        const id_item = parseInt(req.params.id);
        const valores = req.body;
        Carrinho.altera(id_item, valores, res);
    });

    app.get('/carrinho/:id', Auth.verificaJWT, (req, res) => {
        const id_usuario = req.userId;
        Carrinho.listaItensPedido(id_usuario, res);
    });

    app.delete('/carrinho/:id', (req, res) => {
        const id = parseInt(req.params.id);
        Carrinho.deleta(id, res);
    });
}

