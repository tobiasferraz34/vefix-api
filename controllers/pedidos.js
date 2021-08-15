const Pedido = require('../models/pedidos');
const Auth = require('../models/auth');

module.exports = app => {

    app.post('/pedidos', Auth.verificaJWT, (req, res) => {
        const id_usuario = req.userId;
        const pedido = {... req.body, id_usuario };
        Pedido.adiciona(pedido, res);
    });

    app.get('/pedidos/:id', (req, res) => {
        console.log(req.body);
    });
   
   
}