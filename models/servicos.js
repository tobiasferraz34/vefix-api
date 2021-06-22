const moment = require('moment');
const conexao = require("../infraestrutura/conexao");

class Servico {

    listaServicos(res) {
        const sql = `SELECT * FROM servicos ORDER BY nome`;

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

        conexao.query(sql,  [id_servico], (erro, resultados) => {
            if (erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
            }
        });
    }
}

module.exports = new Servico;