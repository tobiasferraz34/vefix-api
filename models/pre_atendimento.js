const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class PreAtendimento {
  adiciona(atendimento, res) {
    //console.log(atendimento);
    const {
      nome,
      email,
      celular,
      senha,
      confirmarSenha,
      anoModelo,
      chassi,
      cor,
      marca,
      modelo,
      municipio,
      placa,
      situacao,
      uf,
      hora_agendamento,
      observacao,
      id_oficina,
      motorizacao
    } = atendimento;

    if (senha === confirmarSenha) {
      const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');

      const usuarioDatado = { nome, email, celular, senha, data_cad };

      //Ano do veiculo
      const ano = atendimento.ano === 'null' ? 0 : atendimento.ano;

      const veiculoDatado = {
        ano,
        anoModelo,
        chassi,
        cor,
        marca,
        modelo,
        municipio,
        placa,
        situacao,
        uf,
        data_cad,
        motorizacao
      };

      //Verifica se existe um usuário cadastrado com o email informado.
      let sql = `SELECT * FROM usuarios WHERE usuarios.email = ?`;

      conexao.query(sql, [usuarioDatado.email], (erro, resultados) => {
        if (erro) {
          res.status(400).json({ status: 400, msg: erro });
        } else {
          if (resultados.length > 0) {
            res.status(400).json({
              status: 400,
              msg: 'Já existe um usuário cadastrado com o email informado.',
            });
          } else {
            //Cadastro do usuário
            //res.status(201).json({ status: 200, msg: 'Cadastrado com sucesso' });

            sql = `SELECT * FROM veiculos WHERE veiculos.placa = ?`;
            conexao.query(sql, [veiculoDatado.placa], (erro, resultados) => {
              if (erro) {
                res.status(400).json({ status: 400, msg: erro });
              } else {
                if (resultados.length > 0) {
                  res.status(400).json({
                    status: 400,
                    msg: 'Já existe um veiculo cadastrado com a placa informada.',
                  });
                } else {
                  sql = 'INSERT INTO usuarios SET ?';
                  conexao.query(sql, usuarioDatado, (erro, resultados) => {
                    if (erro) {
                      res.status(400).json(erro);
                    } else {
                      //console.log(resultados.insertId);

                      const id_cliente = resultados.insertId;

                      //res.status(201).json({ status: 200, msg: id_usuario });
                      //console.log(veiculoDatado);
                      sql = 'INSERT INTO veiculos SET ?';
                      conexao.query(sql, veiculoDatado, (erro, resultados) => {
                        if (erro) {
                          res.status(400).json(erro);
                        } else {
                          const id_veiculo = resultados.insertId;

                          //res.status(201).json({ status: 200, msg: 'Cadastrado com sucesso' });
                          sql = `INSERT INTO usuariosxveiculos (id_usuario, id_veiculo) VALUES (?, ?);`;
                          conexao.query(
                            sql,
                            [id_cliente, resultados.insertId],
                            (erro, resultados) => {
                              if (erro) {
                                res.status(400).json(erro);
                              } else {
                                //res.status(201).json({ status: 200, msg: id_veiculo });

                                let dataCriacao = moment().format('YYYY-MM-DD');

                                const servico = atendimento.servico.toString();

                                let data_agendamento = '';

                                let atendimentoDatado = {
                                  id_veiculo,
                                  id_cliente,
                                  id_oficina,
                                  servico,
                                  observacao,
                                  dataCriacao,
                                };

                                if (
                                  atendimento.data_agendamento &&
                                  atendimento.hora_agendamento
                                ) {
                                  data_agendamento = moment(
                                    atendimento.data_agendamento,
                                    'YYYY-MM-DD'
                                  ).format('YYYY-MM-DD');

                                  const dataValida =
                                    moment(data_agendamento).isSameOrAfter(
                                      dataCriacao
                                    ); //true ou false

                                  if (!dataValida) {
                                    res.status(400).json({
                                      status: 400,
                                      msg: 'A data deve ser maior ou igual a data atual',
                                    });
                                  }

                                  atendimentoDatado = {
                                    id_veiculo,
                                    id_cliente,
                                    id_oficina,
                                    servico,
                                    observacao,
                                    dataCriacao,
                                    data_agendamento,
                                    hora_agendamento,
                                  };
                                }

                                const sql = 'INSERT INTO atendimentos SET ?';
                                conexao.query(
                                  sql,
                                  atendimentoDatado,
                                  (erro, resultados) => {
                                    if (erro) {
                                      res
                                        .status(400)
                                        .json({ status: 400, msg: erro });
                                    } else {
                                      res.status(200).json({
                                        status: 200,
                                        msg: 'Cadastrado com sucesso',
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        }
      });
    } else {
      res.status(400).json({
        status: 400,
        msg: 'Por favor, informe senhas iguais.',
      });
    }
  }
}

module.exports = new PreAtendimento();
