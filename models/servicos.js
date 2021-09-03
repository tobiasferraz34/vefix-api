const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Servico {
    
  adiciona(servico, res) {
    const { nome, status } = servico;
    const data_horaMovto = moment().format('YYYY-MM-DD hh:mm:ss');
    const servicoDatado = { nome, status, data_horaMovto };

    //Verifica se existe um usuário cadastrado com o email informado.
    let sql = `SELECT * FROM servicos WHERE servicos.nome = ?`;

    conexao.query(sql, [nome], (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        if (resultados.length > 0) {
          res
            .status(400)
            .json({
              status: 400,
              msg: 'Já existe um serviço cadastrado, com o nome informado.',
            });
        } else {
          //Cadastro do usuário
          sql = 'INSERT INTO servicos SET ?';
          conexao.query(sql, servicoDatado, (erro, resultados) => {
            if (erro) {
              res.status(400).json(erro);
            } else {
              res
                .status(201)
                .json({ status: 200, msg: 'Cadastrado com sucesso' });
            }
          });
        }
      }
    });
  }

  altera(id, valores, res) {

    const { nome, status } = valores;
    const data_horaMovto = moment().format('YYYY-MM-DD hh:mm:ss');
    const servicoDatado = { nome, status, data_horaMovto };

    const sql = 'UPDATE servicos SET ? WHERE id= ?';

    conexao.query(sql, [servicoDatado, id],(erro, resultados) => {
        if(erro) {
            res.status(400).json({status: 400, msg: erro})
        } else {
            res.status(200).json({status: 200, msg: "Atualizado com sucesso."});
        }
    });
  }

  listaServicos(res) {
    const sql = `SELECT id, nome, status, date_format(data_horaMovto, '%d/%m/%y as %Hh%i') AS data_horaMovto FROM servicos ORDER BY nome`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }

  listaOficinas(id_servico, res) {
    const sql = `SELECT oficinas.id, oficinas.nome AS oficina, oficinas.email, oficinas.cpf_cnpj, oficinas.estado, oficinas.cidade, oficinas.cep, 
        oficinas.bairro, oficinas.logradouro, oficinas.complemento, oficinas.telefone, oficinas.logo, servicos.nome as servico,
        (SELECT GROUP_CONCAT(servicos.nome) from oficinasxservicos 
        INNER JOIN servicos on oficinasxservicos.id_servico = servicos.id
        WHERE oficinasxservicos.id_oficina = oficinas.id) AS outros_servicos
        FROM oficinasxservicos 
        INNER JOIN oficinas on oficinasxservicos.id_oficina = oficinas.id 
        INNER JOIN servicos on oficinasxservicos.id_servico = servicos.id
        WHERE oficinasxservicos.id_servico = ?
        ORDER BY oficinas.id DESC`;

    conexao.query(sql, [id_servico], (erro, resultados) => {
      if (erro) {
        res.status(400).json({ status: 400, msg: erro });
      } else {
        res.status(200).json({ status: 200, resultados });
      }
    });
  }
}

module.exports = new Servico();
