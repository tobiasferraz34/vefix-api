const Pedido = require('../models/pedidos');

module.exports = app => {

    app.post('/pedidos', (req, res) => {
        //console.log(req.body);
        const pedido = req.body;
        Pedido.adiciona(pedido, res);
    });

    app.get('/pedidos/:id', (req, res) => {
        console.log(req.body);
    });
   
   
}