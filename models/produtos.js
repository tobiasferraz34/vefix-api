const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Produto {
  adiciona() {}

  altera(id, valores, res) {
    const { image, nome, preco, quantidade, descricao } = valores;

    let produto = { nome, preco, quantidade, descricao };

    if (image.length > 0) {
      produto = { image, nome, preco, quantidade, descricao };
    }

    const sql = 'UPDATE produtos SET ? WHERE id=?';
    conexao.query(sql, [produto, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res
          .status(200)
          .json({
            msg: `Produto ${valores.nome} atualizado com sucesso.`,
            status: 200,
          });
      }
    });
  }

  deleta(id, res) {
    const sql = 'DELETE FROM produtos WHERE id=?';

    conexao.query(sql, id, (erro, resultados) => {
        if(erro) {
            res.status(400).json();
        } else {
            res
          .status(200)
          .json({
            msg: `Produto excluido com sucesso.`,
            status: 200,
          });
        }
    });
}
}

module.exports = new Produto();
