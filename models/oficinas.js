const conexao = require('../infraestrutura/conexao')
const moment = require('moment');
const jwt = require('jsonwebtoken');

class Oficina {

    login(oficina, res) {
        //Verificando se já existe uma oficina cadastrada com o email e senha informados.
        let sql = `SELECT * FROM oficinas WHERE EMAIL = ? AND SENHA = ?`;

        conexao.query(sql, [oficina.email, oficina.senha], (erro, resultados) => {
            if(erro) throw erro;

            if(resultados.length > 0) {
                
                let id = ``;

                resultados.map(oficina => {
                    id = oficina.id;
                }) 

                const token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: 300 // expires in 5min
                });

                res.status(200).json({auth: true, token, status: 200});
            } else {
                res.status(400).json({msg: "Verifique se o seu email ou senha estão corretos!", status: 400});
            }
        })
    }

    adiciona(oficina, res) {
        const { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, servicos, telefone } = oficina;

        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');
        const oficinaDatada = { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, telefone, data_cad };

        //Verifica se existe alguma oficina cadastrada com o email informado
        let sql = `SELECT * FROM oficinas WHERE oficinas.EMAIL = ?`;

        conexao.query(sql, [email],(erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe uma oficina cadastrada, com o email informado.", status: 400 })
                } else {
                    //Cadastro das oficinas
                    sql = `INSERT INTO oficinas SET ?`;
                    conexao.query(sql, oficinaDatada, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            //Recuperando o id da ultima oficina cadastrada
                            sql = `select oficinas.id from oficinas
                            where oficinas.id = (select max(oficinas.id) from oficinas)`;

                            conexao.query(sql, (erro, resultados) => {
                                if (erro) {
                                    res.status(400).json(erro);
                                } else {
                                    if (resultados.length > 0) {

                                        let id_oficina = 0;
                                        let oficina_servicos = []

                                        resultados.map(oficina => {
                                            id_oficina = oficina.id
                                        });

                                        if (id_oficina !== 0) {
                                            servicos.map(servico => {
                                                oficina_servicos.push([id_oficina, servico])
                                            })
                                        }

                                        //Matrizes aninhadas de elementos [ [15, 3], [15, 4] ] 
                                        //oficina_servicos é uma matriz de matrizes agrupadas em uma matriz
                                        sql = `INSERT INTO oficinasxservicos (id_oficina, id_servico) VALUES ?`;
                                        conexao.query(sql, [oficina_servicos], (erro, resultados) => {
                                            if (erro) {
                                                res.status(400).json(erro);
                                            } else {
                                                res.status(200).json({ msg: "Oficina cadastrada com sucesso", status: 200 });
                                            }
                                        })
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

module.exports = new Oficina;