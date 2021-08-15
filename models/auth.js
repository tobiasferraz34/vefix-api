const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
let jwt = require('jsonwebtoken');

class Auth {

    login(auth, res) {
        const { email, senha, nivelAcesso } = auth;
        //Cliente 
        if (parseInt(nivelAcesso) === 1 || parseInt(nivelAcesso) === 3) {
            const sql = `select * from usuarios where usuarios.email = ? and usuarios.senha = ?`
            conexao.query(sql, [email, senha], (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    if (resultados.length > 0) {
                        let id = '';
                        let nome = '';
                        let email = ''
                        let nivelAcesso = '';

                        resultados.map(usuario => {
                            id = usuario.id
                            nome = usuario.nome
                            email = usuario.email
                            nivelAcesso = usuario.nivel_acesso
                        });

                        const token = jwt.sign({ id, nivelAcesso, email }, process.env.SECRET, {
                            expiresIn: '1h' // expires in 5min
                        });

                        res.status(201).send({ auth: true, token: token, id, nome, email, nivelAcesso, status: 200});
                    } else {
                        res.status(400).json({ status: 400, msg: "Verifique se o seu email, senha ou nivel de acesso estão corretos!" });
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
                        expiresIn: '1h' // expires in 5min
                    });

                    res.status(200).json({ auth: true, token, nivelAcesso: 2, status: 200 });
                } else {
                    res.status(400).json({ msg: "Verifique se o seu email ou senha estão corretos!", status: 400 });
                }
            })
        }
    }

    verificaJWT(req, res, next) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;
        
        if(!token) {
            res.status(401).send({ auth: false, message: 'Acesso Restrito.' });
        } else {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Token Inválido.', status: 500 });
    
                // se tudo estiver ok, salva no request para uso posterior
                req.userId = decoded.id;
                req.nivelAcesso = decoded.nivelAcesso
                req.email = decoded.email
                
                next();
            });
        }
    }

    verificaNivelAcesso(userNivelAcesso, nivelAcesso) {
        if(userNivelAcesso !== nivelAcesso) {
            return true;
        }
        return false;
    }

    
}



module.exports = new Auth;