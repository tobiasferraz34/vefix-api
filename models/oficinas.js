const conexao = require('../infraestrutura/conexao')
const moment = require('moment');

class Oficina {
    
    adiciona(oficina, res) {
        const { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, servicos, telefone, logo } = oficina;

        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');
        const oficinaDatada = { nome, email, cpf_cnpj, senha, estado, cidade, cep, bairro, logradouro, complemento, telefone, logo, data_cad };

        //Verifica se existe alguma oficina cadastrada com o email informado
        let sql = `SELECT * FROM oficinas WHERE oficinas.EMAIL = ?`;

        conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe uma oficina cadastrada com o email informado.", status: 400 })
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

                                    const arrayOficina = servicos.split(',');

                                    arrayOficina.map(servico => {
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

    buscaPorId(id, res) {
        const sql = `SELECT oficinas.id, oficinas.nome, oficinas.email, oficinas.cpf_cnpj,
        oficinas.estado, oficinas.cidade, oficinas.cep, oficinas.bairro,
        oficinas.logradouro, oficinas.complemento, oficinas.senha, oficinas.telefone,
        GROUP_CONCAT(servicos.id ORDER BY servicos.nome desc) AS servico_id, 
        GROUP_CONCAT(servicos.nome) AS servico_nome
        FROM oficinas
        LEFT JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
        LEFT JOIN servicos ON oficinasxservicos.id_servico = servicos.id
        WHERE oficinas.id = ?
        `;
        conexao.query(sql, [id], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    //lista de oficinas por estado
    listaOficinasPorEstadoEMunicipio(uf, municipio, res) {
        const sql = `SELECT oficinas.id, oficinas.nome, oficinas.bairro,oficinas.logradouro, 
        oficinas.telefone, GROUP_CONCAT(DISTINCT servicos.id
        ORDER BY servicos.id) AS id_servicos, GROUP_CONCAT(DISTINCT servicos.nome)
        AS servicos, FORMAT(SUM(avaliacao.pontuacao) / 5, 1) AS pontuacao 
        FROM oficinas
        INNER JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
        INNER JOIN servicos ON oficinasxservicos.id_servico = servicos.id
        LEFT JOIN avaliacao ON oficinasxservicos.id_oficina = avaliacao.id_oficina
        WHERE oficinas.estado = ? AND oficinas.cidade = ?
        GROUP BY oficinas.id`;

        conexao.query(sql, [uf, municipio], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    //Lista de atendimentos por oficina
    listaAtendimentos(id_oficina, dataAtual, id_atendimento, servico, cliente, placaVeiculo, modeloVeiculo, statusAtendimento, res) {

        const sql = `SELECT atendimentos.id AS id_atendimento, usuarios.id AS id_usuario, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
        veiculos.placa, oficinas.id AS id_oficina, oficinas.nome AS oficina, atendimentos.servico, 
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
        atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status,
        date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
        FROM atendimentos 
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        WHERE atendimentos.id_oficina = ? ${dataAtual} ${id_atendimento} ${servico} ${cliente} ${placaVeiculo} ${modeloVeiculo} ${statusAtendimento}
        ORDER BY atendimentos.id desc`;

        conexao.query(sql, [id_oficina], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })

    }

    //Lista de ordem de servicos por oficina
    listaOrdemServicos(id_oficina, res) {
        const sql = `SELECT ordem_servicos.id AS id_os, ordem_servicos.responsavel_servico,
        date_format(ordem_servicos.dt_inicial, '%d/%m/%Y') AS dt_inicial1,
        date_format(ordem_servicos.dt_final, '%d/%m/%Y') AS dt_final2, 
        date_format(ordem_servicos.dt_inicial, '%Y-%m-%d') AS dt_inicial3,
        date_format(ordem_servicos.dt_final, '%Y-%m-%d') AS dt_final4,
        ordem_servicos.descricao_servico, ordem_servicos.status AS status_ordemServico,
        atendimentos.id AS id_atendimento, atendimentos.servico, atendimentos.status AS status_atendimento,  
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamentoAtendimento,
        atendimentos.hora_agendamento AS hora_agendamentoAtendimento,usuarios.id AS id_usuario, usuarios.nome AS cliente, if(usuarios.celular > 0, usuarios.celular, '') AS celularCliente,
        veiculos.id AS id_veiculo, veiculos.placa, veiculos.marca, veiculos.modelo
        FROM ordem_servicos
        INNER JOIN atendimentos ON ordem_servicos.id_atendimento = atendimentos.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        WHERE oficinas.id =  ? ORDER BY ordem_servicos.id DESC `;

        conexao.query(sql, [id_oficina], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    listaPedidos(id_oficina, res) {
        const sql = `SELECT usuarios.nome as cliente, DATE_FORMAT(pedidos.data,'%d/%m/%Y')  as data_solicitacao, pedidos.forma_pagamento, pedidos.forma_envio, 
        GROUP_CONCAT(" ", items_pedidos.nome, " ", items_pedidos.preco_unitario) as items_pedidos 
        FROM pedidos
        LEFT JOIN usuarios on usuarios.id = pedidos.id_usuario
        LEFT JOIN items_pedidos ON items_pedidos.id_pedido = pedidos.id
        WHERE pedidos.id_oficina = ?
        GROUP BY pedidos.id`;

        conexao.query(sql, [id_oficina], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro});
            } else {
                res.status(200).json({status: 200, resultados});
            }
        })
    }

    adicionarProdutos(id_oficina, produto, res) {

        const {image, nome, preco, quantidade, descricao} = produto;
        const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

        const produtoDatado = {image, nome, preco, quantidade, descricao, data_cad, id_oficina};

        let sql = `SELECT * FROM produtos WHERE produtos.nome = ? and produtos.id_oficina = ?`;

        conexao.query(sql, [nome, id_oficina], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                if (resultados.length > 0) {
                    res.status(400).json({ msg: "Já existe um produto cadastrado com o nome informado.", status: 400 })
                } else {
                    //Cadastro das oficinas
                    sql = `INSERT INTO produtos SET ?`;
                    conexao.query(sql, produtoDatado, (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                        } else {
                            if (resultados.insertId > 0) {
                                //Recuperando o id da ultima oficina cadastrada
                                const id_produto = resultados.insertId;
                                //console.log(id_produto , id_oficina);

                                res.status(200).json({ msg: "Produto cadastrado com sucesso", status: 200 });

                            }
                        }
                    });
                }
            }
        });

    }

    listaProdutosPorIdOficina(id_oficina, res) {
        const sql = `SELECT * FROM produtos WHERE produtos.id_oficina = ? ORDER BY produtos.id DESC`;

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