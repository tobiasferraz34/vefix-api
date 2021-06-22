const PreAtendimento = require('../models/pre_atendimento');

module.exports = app => {
    app.post('/pre_atendimento', (req, res) => {
        const atendimento = req.body; 
        PreAtendimento.adiciona(atendimento, res);
    });
}