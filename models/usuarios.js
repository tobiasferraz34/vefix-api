const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

let jwt = require('jsonwebtoken');

class Usuario {

    login(email, senha, res) {
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
                    res.status(201).send({ auth: true, token: token, id: id, nome: nome, email: email, uf: uf, cidade: cidade });
                } else {
                    res.status(400).json("Verifique se o seu email ou senha estão corretos!");
                }

            }
        });
    }

    adiciona(usuario, res) {
        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

        const usuarioDatado = { ...usuario, data_cad };

        //Verifica se existe um usuário cadastrado com o email informado.
        let sql = `SELECT * FROM Usuarios WHERE Usuarios.email = ?`;

        conexao.query(sql, [usuario.email], (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ status: 400, msg: "Já existem um usuário cadastrado, com o email informado." });
                } else {
                    //Cadastro do usuário
                    sql = 'INSERT INTO Usuarios SET ?';
                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 201, msg: "Cadastrado com sucesso" });
                        }
                    });
                }

            }
        })

    }

    lista(res) {
        const sql = 'SELECT * FROM Usuarios';
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(resultados);
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Usuarios where Usuarios.id = ?`;
        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(resultados);
            }
        });
    }
}

module.exports = new Usuario;