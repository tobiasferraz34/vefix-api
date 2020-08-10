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
                    res.status(400).json({ status: 400, msg: "Já existe um usuário cadastrado, com o email informado." });
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
        });
    }

    lista(res) {
        const sql = `SELECT usuarios.id, usuarios.nome, usuarios.email,
        usuarios.senha, usuarios.nivel_acesso, 
        date_format(usuarios.data_cad, '%d/%m/%y Às %Hh%i') AS data_cad
        FROM usuarios ORDER BY usuarios.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    listaAtendimentos(id_usuario, res) {
        const sql = `SELECT usuarios.id, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
        veiculos.placa, oficinas.nome AS oficina,  atendimentos.id AS id_atendimento,atendimentos.servico, 
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
        atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status,
        date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
        FROM atendimentos 
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        WHERE atendimentos.id_cliente = ?
        ORDER BY atendimentos.id desc`;

        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    listaVeiculos(id_usuario, res) {
        const sql = `SELECT veiculos.id, veiculos.ano, veiculos.anoModelo, 
        veiculos.chassi, veiculos.cor, veiculos.marca, veiculos.modelo,
        veiculos.municipio, veiculos.placa, veiculos.situacao,
        veiculos.uf, veiculos.data_cad
        FROM usuarios 
        INNER JOIN usuariosxveiculos ON usuarios.id = usuariosxveiculos.id_usuario
        INNER JOIN veiculos ON usuariosxveiculos.id_veiculo = veiculos.id
        WHERE usuarios.id = ? ORDER BY veiculos.id DESC`

        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if(erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM usuarios WHERE usuarios.id = ?`;
        conexao.query(sql, [id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }
}

module.exports = new Usuario;