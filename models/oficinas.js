const conexao = require('../infraestrutura/conexao')
const moment = require('moment');
const jwt = require('jsonwebtoken');

class Oficina {
    
    adiciona(oficina, res) {
        const { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, servicos, telefone } = oficina;

        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');
        const oficinaDatada = { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, telefone, data_cad };

        //Verifica se existe alguma oficina cadastrada com o email informado
        let sql = `SELECT * FROM oficinas WHERE oficinas.EMAIL = ?`;

        conexao.query(sql, [email], (erro, resultados) => {
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
                            if (resultados.insertId > 0) {
                                //Recuperando o id da ultima oficina cadastrada
                                let id_oficina = resultados.insertId;
                                let oficina_servicos = []

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
            }
        });
    }
}

module.exports = new Oficina;