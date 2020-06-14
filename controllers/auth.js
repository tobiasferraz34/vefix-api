const Auth = require('../models/auth');


module.exports = app => {
    app.post('/login', (req, res) => {
        const [email, senha] = [req.body.email, req.body.senha];
        Auth.login(email, senha, res);
    });

    app.get('/logout', (req, res) => {
        res.status(201).send({ auth: false, token: null });
    });
}

