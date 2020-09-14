const conexao = require('../infraestrutura/conexao')
const moment = require('moment');

class OrdemServicos {

    adiciona(ordem_servico, res) {
        const { id_atendimento, responsavel_servico, descricao_servico } = ordem_servico;
        const data_cad = moment().format('YYYY-MM-DD');
        const hora_cad = moment().format('HH:mm:ss');
        const dtAgendServico = moment(ordem_servico.dtAgendServico, 'DD/MM/YY').format('YYYY-MM-DD')
        const dt_inicial = moment(ordem_servico.dt_inicial, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const dt_final = moment(ordem_servico.dt_final, 'YYYY-MM-DD').format('YYYY-MM-DD');

        //Validação da data de cadastro
        const dtCadValida = moment(data_cad).isSameOrAfter(dtAgendServico);
        if (!dtCadValida) return res.status(400).json({ msg: "Data de cadastro do registro tem que ser maior ou igual, que a data de agendamento do serviço.", status: 400 });

        //Validação da data de inicio da ordem de serviço
        const dtInicialValida = moment(dt_inicial).isSameOrAfter(dtAgendServico);
        if (!dtInicialValida) return res.status(400).json({ msg: "Data inicial tem que ser maior ou igual, que a data de agendamento do serviço.", status: 400 });

        //Validação da data final da ordem de serviço
        const dtFinalValida = moment(dt_final).isSameOrAfter(dt_inicial);
        if (!dtFinalValida) return res.status(400).json({ msg: "Data final tem que ser maior ou igual, que a data inicial do serviço.", status: 400 });

        let sql = `SELECT * FROM ordem_servicos WHERE ordem_servicos.id_atendimento = ?`;
        conexao.query(sql, [id_atendimento], (erro, resultados) => {
            if (erro) res.status(400).json(erro)

            if (resultados.length > 0) {
                res.status(400).json({ msg: "Já existe uma ordem de serviço cadastrada, para este atendimento.", status: 400 })
            } else {
                const ordem_servicoDatado = { id_atendimento, dt_inicial, dt_final, responsavel_servico, descricao_servico, data_cad, hora_cad };

                sql = `INSERT INTO ordem_servicos SET ?`;
                console.log(ordem_servicoDatado)

                conexao.query(sql, ordem_servicoDatado, (erro, resultados) => {
                    if (erro) {
                        res.status(400).json(erro);
                    } else {
                        console.log(resultados.insertId)
                        sql = `UPDATE atendimentos SET atendimentos.status = 'EM ANDAMENTO' 
                        WHERE atendimentos.id = ?`;

                        if (resultados.insertId > 0) {
                            conexao.query(sql, [id_atendimento], (erro, resultados) => {
                                if (erro) res.status(400).json(erro);
                            })
                        }
                        res.status(200).json({ msg: "Ordem Serviço cadastrada com sucesso", status: 200 });
                    }
                });
            }
        });

    }

    altera(id, valores, res) {
        let sql = ``;
        const { id_atendimento, status, descricao_servico } = valores;


        const dtAgendServico = moment(valores.dtAgendServico, 'DD/MM/YY').format('YYYY-MM-DD')
        const dt_inicial = moment(valores.dt_inicial, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const dt_final = moment(valores.dt_final, 'YYYY-MM-DD').format('YYYY-MM-DD');

        //Validação da data de inicio da ordem de serviço
        const dtInicialValida = moment(dt_inicial).isSameOrAfter(dtAgendServico);
        if (!dtInicialValida) return res.status(400).json({ msg: "Data inicial tem que ser maior ou igual, que a data de agendamento do serviço.", status: 400 });

        //Validação da data final da ordem de serviço
        const dtFinalValida = moment(dt_final).isSameOrAfter(dt_inicial);
        if (!dtFinalValida) return res.status(400).json({ msg: "Data final tem que ser maior ou igual, que a data inicial do serviço.", status: 400 });



        const ordem_servico = { dt_inicial, dt_final, descricao_servico, status };

        sql = `UPDATE ordem_servicos SET ? WHERE ordem_servicos.id = ?`;

        conexao.query(sql, [ordem_servico, id], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro })
            } else {
                sql = `UPDATE atendimentos SET atendimentos.status = 'CONCLUIDO' 
                        WHERE atendimentos.id = ?`;
                //Verifica se o status da ordem de servico já foi concluido.
                if (status === "CONCLUIDO") {
                    console.log(status)
                    conexao.query(sql, [id_atendimento], (erro, resultados) => {
                        if(erro) res.status(400).json({ status: 400, msg: erro });
                    });
                }

                res.status(200).json({ status: 200, msg: "Atualizado com sucesso." });
            }
        });
    }

    listaItensServico(id_os, res) {
        const sql = `SELECT itens_servicos.id, itens_servicos.id_os,
        itens_servicos.nome_item, itens_servicos.valor_item
        FROM itens_servicos
        WHERE itens_servicos.id_os = ? ORDER BY itens_servicos.id DESC`;

        conexao.query(sql, [id_os], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        })
    }
}

module.exports = new OrdemServicos;