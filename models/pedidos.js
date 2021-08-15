const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Pedido {
  adiciona(pedido, res) {
    const {
      id_oficina,
      id_usuario,
      total,
      estado,
      cidade,
      cep,
      bairro,
      logradouro,
      complemento,
      forma_pagamento,
      forma_envio,
      itemsPedidos,
    } = pedido;

    if (itemsPedidos.length > 0) {
      let arrayItemsPedido = [];
      const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

      const data = moment().format('YYYY-MM-DD');
      const pedido = {
        id_usuario,
        id_oficina,
        total,
        data,
        forma_pagamento,
        forma_envio,
        data_cad,
      };

      let sql = 'INSERT INTO pedidos SET ?';
      conexao.query(sql, pedido, (erro, resultados) => {
        if (erro) {
          res.status(400).json(erro);
        } else {
          const id_pedido = resultados.insertId;

          itemsPedidos.map((itemPedido) => {
            arrayItemsPedido.push([
              id_pedido,
              itemPedido.id,
              itemPedido.nome,
              itemPedido.preco_unitario,
              itemPedido.quantidade,
              itemPedido.subTotal,
              data_cad,
            ]);
          });

          //console.log(arrayItemsPedido);

          sql =
            'INSERT INTO items_pedidos (id_pedido, id_produto, nome, preco_unitario, quantidade, subTotal, data_cad) VALUES ?';
          conexao.query(sql, [arrayItemsPedido], (erro, resultados) => {
            if (erro) {
              res.status(400).json(erro);
            } else {
              //console.log(resultados)

              const endereco_entrega = {
                data_cad,
                estado,
                cidade,
                cep,
                bairro,
                logradouro,
                complemento,
                id_pedido,
              };

              sql = 'INSERT INTO enderecos_entregas SET ?';
              conexao.query(sql, endereco_entrega, (erro, resultados) => {
                if (erro) {
                  res.status(400).json(erro);
                } else {
                  res.status(201).json({
                    status: 200,
                    msg: `O seu pedido foi cadastrado com sucesso, identificamos que você já está cadastrado na base de dados do sistema. Obrigado e boas compras.`,
                  });
                }
              });
            }
          });
        }
      });
    } else {
      res.status(400).json({
        status: 400,
        msg: 'por favor, adicionar items ao carrinho de compras',
      });
    }
  }
}

module.exports = new Pedido();
