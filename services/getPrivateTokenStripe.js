const conexao = require('../infraestrutura/conexao');

const getPrivateTokenStripe = (id_oficina, callback) => {
  const sql = `SELECT privateTokenStripe FROM oficinas WHERE oficinas.id = ?`;

  const result = conexao.query(sql, [id_oficina], (erro, resultados) => {
    if (erro) {
      callback(erro, null);
    } else {
      callback(null, resultados[0].privateTokenStripe);
    }
  });
}

module.exports = getPrivateTokenStripe;