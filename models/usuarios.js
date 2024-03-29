const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

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
        usuarios.senha, usuarios.nivel_acesso, usuarios.celular,
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

    listaAtendimentos(id_usuario, placaVeiculo, nomeOficina, servico, dt_agend, res) {
        const sql = `SELECT usuarios.id as id_usuario, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
        veiculos.placa, oficinas.id as id_oficina, oficinas.nome AS oficina,  atendimentos.id AS id_atendimento, atendimentos.servico, 
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
        atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status, atendimentos.avaliado,
        date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
        FROM atendimentos 
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        WHERE atendimentos.id_cliente = ? ${placaVeiculo} ${nomeOficina} ${servico} ${dt_agend}
        ORDER BY atendimentos.id DESC`;

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
        veiculos.municipio, veiculos.placa, veiculos.situacao,  veiculos.motorizacao,
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

    altera(id, valores, res) {

        if(!valores.senha) {
            delete valores.senha
        }

        const sql = 'UPDATE usuarios SET ? WHERE id=?';
        conexao.query(sql, [valores, id],(erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro})
            } else {
                res.status(200).json({status: 200, msg: "Atualizado com sucesso."});
            }
        });
    }

    listaPedidos(id_usuario, res) {
        const sql = `SELECT GROUP_CONCAT(DISTINCT enderecos_entregas.logradouro, ", ", enderecos_entregas.bairro, ", ", enderecos_entregas.cidade, ", ", enderecos_entregas.estado, ", ", enderecos_entregas.cep) AS endereco_entrega,
        DATE_FORMAT(pedidos.data,'%d/%m/%Y') as data_solicitacao, pedidos.forma_pagamento, pedidos.forma_envio, pedidos.total, GROUP_CONCAT(items_pedidos.nome, "") as itens_pedidos, 
        sum(items_pedidos.quantidade) as quantidade_itens
        FROM pedidos 
        LEFT JOIN usuarios on usuarios.id = pedidos.id_usuario 
        LEFT JOIN items_pedidos ON items_pedidos.id_pedido = pedidos.id 
        LEFT JOIN enderecos_entregas ON enderecos_entregas.id_pedido = pedidos.id 
        WHERE usuarios.id = ?
        GROUP BY pedidos.id
        ORDER BY pedidos.id DESC`;
        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if (erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        });
    }


}

module.exports = new Usuario;