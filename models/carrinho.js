const moment = require('moment');
const conexao = require("../infraestrutura/conexao");

class Carrinho {
    adiciona(itemPedido, res) {
        //const data_horaCad = moment().format('YYYY-MM-DD hh:mm:ss');
        console.log(itemPedido);

        const { 
            id_oficina,
            id,
            url,
            nome,
            preco_unitario,
            quantidade,
            subTotal,
            peso,
            altura,
            largura,
            comprimento,
            diametro,
            id_usuario} = itemPedido;

        const id_produto = id;

        const itemPedidoComIdProduto = {id_oficina,
            id_produto,
            url,
            nome,
            preco_unitario,
            quantidade,
            subTotal,
            peso,
            altura,
            largura,
            comprimento,
            diametro,
            id_usuario} 

            let sql = `SELECT carrinho.id,carrinho.id_produto,carrinho.id_oficina,carrinho.id_usuario,
            carrinho.url,carrinho.nome, carrinho.preco_unitario, carrinho.quantidade, carrinho.subTotal,
            carrinho.peso, carrinho.altura, carrinho.largura, carrinho.comprimento, carrinho.diametro,
            oficinas.nome as loja
            FROM carrinho 
            INNER JOIN oficinas ON carrinho.id_oficina = oficinas.id
            WHERE id_produto = ? and id_usuario = ? and id_oficina = ?`;

            conexao.query(sql, [id_produto, id_usuario, id_oficina], (erro, resultados) => {
                if(erro) {
                    res.status(400).json({"status": 400, erro});
                } else {
                    //console.log(resultados);
                    if(!resultados.length > 0) {
                        sql = `INSERT INTO carrinho SET ?`;
                        conexao.query(sql, itemPedidoComIdProduto, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json({ status: 400, msg: erro });                                                                                                                                                                                                                                                                                                                                                  
                            } else {
                                res.status(200).json({ status: 200, msg: "Produto adicionado com sucesso." });
                            }
                        });
                    }
                }
            });
    }

    altera(id_item, valores, res) {
        //console.log(valores)
        const sql = 'UPDATE carrinho SET ? WHERE id = ?';
        conexao.query(sql, [valores, id_item], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id_item, status: 200, msg: "Produto adicionado com sucesso." });
            }
        })
    }

    deleta(id, res) {
        const sql = 'DELETE FROM carrinho WHERE id = ?';

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, erro});
            } else {
                res.status(200).json({status: 200, id});
            }
        });
    }

    listaItensPedido(id_usuario, res) {
        const sql = `SELECT carrinho.id,carrinho.id_produto,carrinho.id_oficina,carrinho.id_usuario,
        carrinho.url,carrinho.nome, carrinho.preco_unitario, carrinho.quantidade, carrinho.subTotal,
        carrinho.peso, carrinho.altura, carrinho.largura, carrinho.comprimento, carrinho.diametro,
        oficinas.nome as loja
        FROM carrinho 
        INNER JOIN oficinas ON carrinho.id_oficina = oficinas.id
        WHERE carrinho.id_usuario = ?`;

        conexao.query(sql, [id_usuario], (erro, resultados) => {
            if(erro) {
                res.status(400).json({"status": 400, erro});
            } else {
                res.status(200).json({"status": 200, resultados});
            }
        });
    }
}

module.exports = new Carrinho;