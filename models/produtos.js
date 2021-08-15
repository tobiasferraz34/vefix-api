const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Produto {
  adiciona(produto, res) {}

  altera(id, valores, res) {
    const {
      image,
      nome,
      preco,
      quantidade,
      descricao,
      peso,
      comprimento,
      altura,
      largura,
      diametro,
    } = valores;

    let produto = {
      nome,
      preco,
      quantidade,
      descricao,
      peso,
      comprimento,
      altura,
      largura,
      diametro,
    };

    if (image.length > 0) {
      produto = {
        image,
        nome,
        preco,
        quantidade,
        descricao,
        peso,
        comprimento,
        altura,
        largura,
        diametro,
      };
    }

    const sql = 'UPDATE produtos SET ? WHERE id=?';
    conexao.query(sql, [produto, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json({
          msg: `Produto ${valores.nome} atualizado com sucesso.`,
          status: 200,
        });
      }
    });
  }

 
  deleta(id, res) {
    let sql = `SELECT * FROM produtos WHERE produtos.id = ? `;
    conexao.query(sql, [id], (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        if (resultados.length > 0) {
          sql = 'DELETE FROM produtos WHERE id=?';
          conexao.query(sql, id, (erro, resultados) => {
            if (erro) {
              res.status(400).json();
            } else {
              sql = `SELECT * FROM produtosxoficinas WHERE produtosxoficinas.id_produto = ? `;

              conexao.query(sql, [id], (erro, resultados) => {
                if (erro) {
                  res.status(400).json({ status: 400, msg: erro });
                } else {
                  if (resultados.length > 0) {
                    sql =
                      'DELETE FROM produtosxoficinas WHERE produtosxoficinas.id_produto = ?';

                    conexao.query(sql, [id], (erro, resultados) => {
                      if (erro) {
                        res.status(400).json({ status: 400, msg: erro });
                      } else {
                        sql = 'DELETE FROM produtos WHERE id=?';

                        res.status(200).json({
                          msg: `Produto excluido com sucesso.`,
                          status: 200,
                        });
                      }
                    });
                  } else {
                    res.status(400).json({
                      msg: 'O produto não encontrado.',
                      status: 400,
                    });
                  }
                }
              });
            }
          });
        } else {
          res.status(400).json({
            msg: 'O produto não encontrado.',
            status: 400,
          });
        }
      }
    });
  }
}

module.exports = new Produto();
