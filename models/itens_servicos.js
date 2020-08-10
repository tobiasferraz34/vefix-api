const moment = require('moment');
const conexao = require("../infraestrutura/conexao");


class ItensServicos {
    adiciona(itemServico, res) {
        const data_horaCad = moment().format('YYYY-MM-DD hh:mm:ss');

        const itemServicoDatado = {...itemServico, data_horaCad}

        const sql = `INSERT INTO itens_servicos SET ?`
        conexao.query(sql, itemServicoDatado, (erro, resultados) => {
            if(erro) {
                return res.status(400).json({status: 400, msg: erro});
            } 
            res.status(200).json({ msg: "Item de servico cadastrado com sucesso", status: 200 });
        });
    }

    altera(id, valores, res) {
        const sql = `UPDATE itens_servicos SET ? WHERE itens_servicos.id = ?`;

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro) {
                res.status(400).json({status: 400, msg: erro})
            } else {
                res.status(200).json({status: 200, msg: "Atualizado com sucesso."});
            }
        })

    }
}

module.exports = new ItensServicos;