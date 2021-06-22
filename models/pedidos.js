const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Pedido {
  adiciona(pedido, res) {
    const {
      nome,
      email,
      celular,
      senha,
      confirmarSenha,
      estado,
      cidade,
      cep,
      bairro,
      logradouro,
      complemento,
      total,
      forma_pagamento,
      forma_envio,
      itemsPedidos,
      nome_oficina,
    } = pedido;

    if (
      email ||
      celular ||
      senha ||
      confirmarSenha ||
      estado ||
      cidade ||
      cep ||
      bairro ||
      logradouro ||
      total ||
      forma_pagamento ||
      forma_envio
    ) {
      if (senha === confirmarSenha) {
        if (itemsPedidos.length > 0) {
          let arrayItemsPedido = [];

          const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

          const usuarioDatado = {
            nome,
            email,
            celular,
            senha,
            estado,
            cidade,
            cep,
            bairro,
            logradouro,
            complemento,
            data_cad,
          };

          //Verifica se existe um usuário cadastrado com o email informado.
          let sql = `SELECT * FROM usuarios WHERE usuarios.email = ?`;

          conexao.query(sql, [email], (erro, resultados) => {
            if (erro) {
              res.status(400).json({ status: 400, msg: erro });
            } else {
              if (resultados.length > 0) {
                // res.status(400).json({
                //   status: 400,
                //   msg: 'Já existe um usuário cadastrado, com o email informado.',
                // });

                sql = `SELECT oficinas.id FROM oficinas WHERE oficinas.nome = ?`;
                const id_usuario = resultados[0].id;
                conexao.query(sql, [nome_oficina], (erro, resultados) => {
                  if (erro) {
                    res.status(400).json(erro);
                  } else {
                    console.log(resultados[0].id);
                    //res.status(200).json({ status: 200, resultados: resultados })

                    const id_oficina = resultados[0].id;
                    const data = moment().format('YYYY-MM-DD');
                    const pedido = {
                      id_usuario,
                      id_oficina,
                      data,
                      total,
                      forma_pagamento,
                      forma_envio,
                      data_cad,
                    };

                    sql = 'INSERT INTO pedidos SET ?';
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
                        conexao.query(
                          sql,
                          [arrayItemsPedido],
                          (erro, resultados) => {
                            if (erro) {
                              res.status(400).json(erro);
                            } else {
                              res
                                .status(201)
                                .json({
                                  status: 200,
                                  msg: `${nome} seu pedido foi cadastrado com sucesso, identificamos que você já está cadastrado na base de dados do sistema. Obrigado e boas compras.`,
                                });
                            }
                          }
                        );
                        //res.status(201).json({ status: 200, msg: 'Cadastrado com sucesso' });
                      }
                    });
                  }
                });
              } else {
                //Cadastro do usuário
                sql = 'INSERT INTO usuarios SET ?';
                conexao.query(sql, usuarioDatado, (erro, resultados) => {
                  if (erro) {
                    res.status(400).json(erro);
                  } else {
                    sql = `SELECT oficinas.id FROM oficinas WHERE oficinas.nome = ?`;
                    const id_usuario = resultados.insertId;
                    conexao.query(sql, [nome_oficina], (erro, resultados) => {
                      if (erro) {
                        res.status(400).json(erro);
                      } else {
                        console.log(resultados[0].id);
                        //res.status(200).json({ status: 200, resultados: resultados })

                        const id_oficina = resultados[0].id;
                        const data = moment().format('YYYY-MM-DD');
                        const pedido = {
                          id_usuario,
                          id_oficina,
                          data,
                          total,
                          forma_pagamento,
                          forma_envio,
                          data_cad,
                        };

                        sql = 'INSERT INTO pedidos SET ?';
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

                            console.log(arrayItemsPedido);

                            sql =
                              'INSERT INTO items_pedidos (id_pedido, id_produto, nome, preco_unitario, quantidade, subTotal, data_cad) VALUES ?';
                            conexao.query(
                              sql,
                              [arrayItemsPedido],
                              (erro, resultados) => {
                                if (erro) {
                                  res.status(400).json(erro);
                                } else {
                                  res
                                    .status(201)
                                    .json({
                                      status: 200,
                                      msg: `${nome} seu pedido foi cadastrado com sucesso, identificamos que esse é o seu primeiro pedido. Obrigado e boas compras.`
                                    });
                                }
                              }
                            );
                            //res.status(201).json({ status: 200, msg: 'Cadastrado com sucesso' });
                          }
                        });
                      }
                    });
                    //res.status(201).json({ status: 200, msg: "Cadastrado com sucesso" });
                  }
                });
              }
            }
          });
        } else {
          res.status(400).json({
            status: 400,
            msg: 'por favor, adicionar items ao carrinho de compras',
          });
        }
      } else {
        res
          .status(400)
          .json({ status: 400, msg: 'por favor, informe senhas iguais.' });
      }
    } else {
      res.status(400).json({
        status: 400,
        msg: 'por favor, preencher os campos que estão vazios para finalizar o seu pedido.',
      });
    }
  }
}

module.exports = new Pedido();
