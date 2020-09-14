const moment = require('moment');
const conexao = require("../infraestrutura/conexao");

class Avaliacao {
    adiciona(avaliacao, res) {
        const data_horaCad = moment().format('YYYY-MM-DD hh:mm:ss');
        const { id_usuario, id_oficina, id_atendimento, pontuacao } = avaliacao;

        const avaliacao_datado = { ...id_usuario, id_oficina, pontuacao, data_horaCad }
        let sql = `INSERT INTO avaliacao SET ?`;
        conexao.query(sql, avaliacao_datado, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                if (resultados.insertId > 0) {

                    //Atualizando o campo avaliado do atendimento
                    sql = `UPDATE atendimentos SET atendimentos.avaliado = 'SIM' 
                    WHERE atendimentos.id = ?`;

                    conexao.query(sql, [id_atendimento], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro);
                            console.log(erro);
                        }
                    });
                }
                res.status(200).json({ status: 200, msg: "Avaliação realizada com sucesso." });
            }
        });
    }

    listaOficinas(res) {
        const sql = `SELECT oficinas.id, oficinas.nome
        FROM oficinas ORDER BY oficinas.id DESC`;
        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        })
    }
}

module.exports = new Avaliacao;