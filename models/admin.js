const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

class Admin {

  listaUsuarios(res) {
    const sql = `SELECT usuarios.id, usuarios.nome, usuarios.email,
    usuarios.senha, usuarios.nivel_acesso, usuarios.celular, usuarios.senha,
    date_format(usuarios.data_cad, '%d/%m/%y Às %Hh%i') AS data_cad
    FROM usuarios ORDER BY usuarios.id DESC`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }

  //Lista de oficinas em geral
  listaOficinas(res) {
    const sql = `SELECT oficinas.id, oficinas.nome, oficinas.email, oficinas.cpf_cnpj, 
        oficinas.cep, oficinas.estado, oficinas.cidade, oficinas.bairro,oficinas.logradouro, 
        oficinas.telefone, oficinas.logo, oficinas.senha, oficinas.publicTokenStripe, oficinas.privateTokenStripe, GROUP_CONCAT(servicos.id ORDER BY servicos.id) AS id_servicos, 
        GROUP_CONCAT(servicos.nome) AS servicos, 
         date_format(oficinas.data_cad, '%d/%m/%y Às %Hh%i') AS data_cad
        FROM oficinas 
        INNER JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
        INNER JOIN servicos ON oficinasxservicos.id_servico = servicos.id
        GROUP BY oficinas.id 
        ORDER BY oficinas.id DESC`;
    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }

  listaVeiculos(res) {
    const sql = `SELECT usuarios.nome as dono, usuarios.id, veiculos.id AS id_veiculo,
    veiculos.placa, veiculos.ano, 
    veiculos.anoModelo, veiculos.chassi, veiculos.cor, 
    veiculos.marca, veiculos.modelo,
    veiculos.municipio, veiculos.situacao,
    veiculos.uf, date_format(veiculos.data_cad, '%d/%m/%y as %Hh%i') AS data_cad
    FROM veiculos
    INNER JOIN usuariosxveiculos ON veiculos.id = usuariosxveiculos.id_veiculo
    INNER JOIN usuarios ON usuariosxveiculos.id_usuario = usuarios.id
    ORDER BY veiculos.id desc`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }

  listaAtendimentos(placaVeiculo, marcaVeiculo, modeloVeiculo, servico, dt_agend, res) {
    const sql = `SELECT usuarios.id, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
    veiculos.placa, oficinas.nome AS oficina,  atendimentos.id AS id_atendimento,atendimentos.servico, 
    date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
    atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status,
    date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
    FROM atendimentos 
    INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
    INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
    INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
    WHERE atendimentos.id <> 0 ${placaVeiculo} ${marcaVeiculo} ${modeloVeiculo} ${servico} ${dt_agend}   
    ORDER BY veiculos.id DESC`;

    conexao.query(sql, (erro, resultados) => {
        if(erro) {
            res.status(400).json();
        } else {
            res.status(200).json({ status: 200, resultados});
        }
    })
  }

  listaPedidos(res) {
    const sql = `SELECT usuarios.nome as cliente, usuarios.email, usuarios.celular as contato, usuarios.estado, usuarios.cidade, usuarios.cep, usuarios.bairro, usuarios.logradouro, usuarios.complemento, 
    GROUP_CONCAT(DISTINCT enderecos_entregas.logradouro, ", ", enderecos_entregas.bairro, ", ", enderecos_entregas.cidade, ", ", enderecos_entregas.estado, ", ", enderecos_entregas.cep, ", ",enderecos_entregas.complemento) AS endereco_entrega,
    DATE_FORMAT(pedidos.data,'%d/%m/%Y') as data_solicitacao, pedidos.forma_pagamento, pedidos.forma_envio, pedidos.total, GROUP_CONCAT(items_pedidos.nome, " ") as itens_pedidos, 
    sum(items_pedidos.quantidade) as quantidade_itens
    FROM pedidos 
    LEFT JOIN usuarios on usuarios.id = pedidos.id_usuario 
    LEFT JOIN items_pedidos ON items_pedidos.id_pedido = pedidos.id 
    LEFT JOIN enderecos_entregas ON enderecos_entregas.id_pedido = pedidos.id 
    GROUP BY pedidos.id
    ORDER BY pedidos.id DESC`;

    conexao.query(sql, (erro, resultados) => {
        if(erro) {
            res.status(400).json();
        } else {
            res.status(200).json({ status: 200, resultados});
        }
    })
  }

  listaOrdensServicos(res) {
    const sql = `SELECT ordem_servicos.id AS id_os, ordem_servicos.responsavel_servico,
    date_format(ordem_servicos.dt_inicial, '%d/%m/%Y') AS dt_inicial1,
    date_format(ordem_servicos.dt_final, '%d/%m/%Y') AS dt_final2, 
    date_format(ordem_servicos.dt_inicial, '%Y-%m-%d') AS dt_inicial3,
    date_format(ordem_servicos.dt_final, '%Y-%m-%d') AS dt_final4,
    ordem_servicos.descricao_servico, ordem_servicos.status AS status_ordemServico,
    atendimentos.id AS id_atendimento, atendimentos.servico, atendimentos.status AS status_atendimento,  
    date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamentoAtendimento,
    atendimentos.hora_agendamento AS hora_agendamentoAtendimento
    FROM ordem_servicos
    INNER JOIN atendimentos ON ordem_servicos.id_atendimento = atendimentos.id
    ORDER BY ordem_servicos.id DESC`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }
}

module.exports = new Admin();
