const moment = require('moment');
const conexao = require('../infraestrutura/conexao');
let jwt = require('jsonwebtoken');

class Usuario {

    adiciona(usuario, res) {
        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

        const usuarioDatado = { ...usuario, data_cad };

        //Verifica se existe um usuário cadastrado com o email informado.
        let sql = `SELECT * FROM usuarios WHERE usuarios.email = ?`;

        conexao.query(sql, [usuario.email], (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ status: 400, msg: "Já existem um usuário cadastrado, com o email informado." });
                } else {
                    //Cadastro do usuário
                    sql = 'INSERT INTO usuarios SET ?';
                    conexao.query(sql, usuarioDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            res.status(201).json({ status: 200, msg: "Cadastrado com sucesso" });
                        }
                    });
                }

            }
        })

    }

    lista(res) {
        const sql = 'SELECT * FROM usuarios';
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(201).json(resultados);
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM usuarios where usuarios.id = ?`;
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