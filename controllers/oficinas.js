const Oficina = require('../models/oficinas')

module.exports = app => {

    app.post('/oficinas', (req, res) => {
        const oficina = req.body;
        Oficina.adiciona(oficina, res);
    });
}