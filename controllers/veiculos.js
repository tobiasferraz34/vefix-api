const veiculos = require('../models/veiculos');
const auth = require('../models/auth');
const niveisAcesso = require('../services/niveisAcesso');

module.exports = app => {
    app.post('/veiculos', auth.verificaJWT, (req, res) => {
        const userId =  req.userId;
        const veiculo = {...req.body, userId};
        veiculos.adiciona(veiculo, res);
    });

    app.get('/veiculos', auth.verificaJWT,(req, res) => {
        
        if(auth.verificaNivelAcesso(req.nivelAcesso, niveisAcesso.admin)) {
            res.status(401).send({ auth: false, message: 'Você não possui permissão' });
        }  
        
        veiculos.lista(res);
    });

    app.get('/veiculos/:id', auth.verificaJWT, (req, res) => {
        const userId =  req.userId;
        veiculos.buscaPorId(userId, res)
    })
}