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

    //Lista de oficinas em geral
    lista(res) {
        const sql = `SELECT oficinas.id, oficinas.nome, oficinas.email, oficinas.cpf_cnpj, 
        oficinas.cep, oficinas.estado, oficinas.cidade, oficinas.bairro,oficinas.logradouro, 
        oficinas.telefone, GROUP_CONCAT(servicos.id ORDER BY servicos.id) AS id_servicos, 
        GROUP_CONCAT(servicos.nome) AS servicos, 
         date_format(oficinas.data_cad, '%d/%m/%y Às %Hh%i') AS data_cad
        FROM oficinas 
        INNER JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
        INNER JOIN servicos ON oficinasxservicos.id_servico = servicos.id
        WHERE oficinas.estado = 'PB'
        GROUP BY oficinas.id 
        ORDER BY oficinas.id DESC`;
        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    //lista de oficinas por estado
    listaOficinasPorEstado(uf, res) {
        const sql = `SELECT oficinas.id, oficinas.nome, oficinas.bairro,oficinas.logradouro, 
        oficinas.telefone, GROUP_CONCAT(servicos.id ORDER BY servicos.id) AS id_servicos, 
        GROUP_CONCAT(servicos.nome) AS servicos
        FROM oficinas 
        INNER JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
        INNER JOIN servicos ON oficinasxservicos.id_servico = servicos.id
        WHERE oficinas.estado = ?
        GROUP BY oficinas.nome `;

        conexao.query(sql, [uf], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    listaAtendimentos(id_oficina, res) {
        const sql = `SELECT usuarios.id, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
        veiculos.placa, oficinas.id AS id_oficina, oficinas.nome AS oficina,  atendimentos.id AS id_atendimento,atendimentos.servico, 
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
        atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status,
        date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
        FROM atendimentos 
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        WHERE atendimentos.id_oficina = ?
        ORDER BY veiculos.id desc`;

        conexao.query(sql, [id_oficina], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })

    }
}

module.exports = new Oficina;