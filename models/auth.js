const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
require("dotenv-safe").config();
let jwt = require('jsonwebtoken');

class Auth {
    login(email, senha, res) {
        const sql = `select * from Usuarios where Usuarios.email = '${email}' and Usuarios.senha = '${senha}'`
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                if (resultados.length > 0) {
                    
                    let id = '';
                    let nome = '';
                    let email = '';
                    let uf = '';
                    let cidade = ';'

                    resultados.map(usuario => {
                        id = usuario.id
                        nome = usuario.nome
                        email = usuario.email
                        uf = usuario.uf
                        cidade = usuario.cidade
                    });

                    const token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: 300 // expires in 5min
                    });
                    res.status(201).send({ auth: true, token: token, id: id, nome: nome, email: email, uf: uf, cidade: cidade});
                } else {
                    res.status(400).json("Verifique se o seu email ou senha estão corretos!");
                }

            }
        });
    }

    verificaJWT(req, res, next) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) return res.status(401).send({ auth: false, message: 'Acesso Restrito.' });

        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Token Inválido.' });

            // se tudo estiver ok, salva no request para uso posterior
            req.userId = decoded.id;
            next();
        });
    }
}

module.exports = new Auth;