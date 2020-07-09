const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
require("dotenv-safe").config();
let jwt = require('jsonwebtoken');

class Auth {
    login(auth, res) {
        const { email, senha, nivelAcesso } = auth;

        //Cliente
        if (parseInt(nivelAcesso) === 1) {
            const sql = `select * from Usuarios where Usuarios.email = ? and Usuarios.senha = ?`
            conexao.query(sql, [email, senha], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    if (resultados.length > 0) {

                        let id = '';
                        let nome = '';
                        let email = '';
                        let uf = '';
                        let cidade = '';

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
                        res.status(201).send({ auth: true, token: token, status: 200, id: id, nome: nome, email: email, uf: uf, cidade: cidade });
                    } else {
                        res.status(400).json({ status: 400, msg: "Verifique se o seu email ou senha estão corretos!" });
                    }

                }
            });
        }

        //Oficina
        if (parseInt(nivelAcesso) === 2) {
            //Verificando se já existe uma oficina cadastrada com o email e senha informados.
            let sql = `SELECT * FROM oficinas WHERE EMAIL = ? AND SENHA = ?`;

            conexao.query(sql, [email, senha], (erro, resultados) => {
                if (erro) throw erro;

                if (resultados.length > 0) {

                    let id = ``;

                    resultados.map(oficina => {
                        id = oficina.id;
                    })

                    const token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: 300 // expires in 5min
                    });

                    res.status(200).json({ auth: true, token, id: id, status: 200 });
                } else {
                    res.status(400).json({ msg: "Verifique se o seu email ou senha estão corretos!", status: 400 });
                }
            })
        }

        //Administrador
        if (parseInt(nivelAcesso) === 3) {
            res.status(400).json({ status: 400, msg: "Em construção!" });
        }


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