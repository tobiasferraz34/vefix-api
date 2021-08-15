const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Loja {
  listaProdutos(nome_loja, res) {
    //Verifica se existe alguma oficina cadastrada com o email informado
    let sql = `SELECT * FROM oficinas WHERE oficinas.nome = ?`;

    conexao.query(sql, [nome_loja], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        if (resultados.length > 0) {
          //res.status(200).json({ msg: "oficina cadastrada com o nome informado.", status: 200 })
          //console.log(resultados[0].id);

          const id_oficina = resultados[0].id;

          sql = `SELECT * FROM produtosxoficinas
          INNER JOIN produtos ON produtosxoficinas.id_produto = produtos.id
          WHERE produtosxoficinas.id_oficina = ? 
          ORDER BY produtosxoficinas.id_produto DESC`;

          conexao.query(sql, [id_oficina], (erro, resultados) => {
            if (erro) {
              res.status(400).json(erro);
            } else {
              if (resultados.length > 0) {
                res.status(200).json({ status: 200, resultados: resultados });
              } else {
                res
                  .status(400)
                  .json({ msg: 'Nenhum resultado encontrado.', status: 400 });
              }
            }
          });
        } else {
          res
            .status(400)
            .json({ msg: 'Nenhum resultado encontrado.', status: 400 });
        }
      }
    });
  }

  buscarInformacoes(nome, res) {
    const sql = `SELECT distinct oficinas.id as id_oficina, oficinas.nome as nome_oficina, oficinas.email, oficinas.estado, oficinas.cidade, oficinas.cep, 
    oficinas.bairro, oficinas.logradouro, oficinas.logo, oficinas.telefone, oficinas.publicTokenStripe, GROUP_CONCAT(servicos.nome, " ") AS servicos
    FROM oficinas 
    INNER JOIN oficinasxservicos ON oficinas.id = oficinasxservicos.id_oficina
    INNER JOIN servicos ON oficinasxservicos.id_servico = servicos.id
    WHERE oficinas.nome = ?
    GROUP BY oficinas.id`;

    conexao.query(sql, [nome], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        if (resultados.length > 0) {
          res.status(200).json({ status: 200, resultado: resultados[0] });
        } else {
          res
            .status(400)
            .json({ msg: 'Nenhum resultado encontrado.', status: 400 });
        }
      }
    });
  }
}

module.exports = new Loja();
