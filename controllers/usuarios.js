const Usuario = require('../models/usuarios');
const Auth = require('../models/auth');

module.exports = app => {

    app.post('/usuarios', (req, res) => {
        const usuario = req.body;
        Usuario.adiciona(usuario, res);
    });

    app.get('/usuarios', Auth.verificaJWT, (req, res) => {
        console.log(req.userId)
        Usuario.lista(res);
    });

    app.get('/usuarios/:id', Auth.verificaJWT,(req, res) => {
        const id = req.params.id;
        Usuario.buscaPorId(id, res);
    })

}