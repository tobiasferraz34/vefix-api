const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Loja {

    listaProdutos(nome_loja, res) {
        //Verifica se existe alguma oficina cadastrada com o email informado
        let sql = `SELECT * FROM oficinas WHERE oficinas.nome = ?`;

        conexao.query(sql, [nome_loja], (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                if (resultados.length > 0) {
                    //res.status(200).json({ msg: "oficina cadastrada com o nome informado.", status: 200 })
                    //console.log(resultados[0].id);

                    const id_oficina = resultados[0].id;

                    sql = `SELECT * FROM produtos WHERE produtos.id_oficina = ? ORDER BY produtos.id DESC`;

                    conexao.query(sql, [id_oficina], (erro, resultados) => {
                        if (erro) {
                            res.status(400).json(erro)
                        } else {
                            if (resultados.length > 0) {
                                res.status(200).json({ status: 200, resultados: resultados })
                            } else {
                                res.status(400).json({ msg: "Nenhum resultado encontrado.", status: 400 })
                                
                            }
                        }
                    });
                } else {
                    res.status(400).json({ msg: "Nenhum resultado encontrado.", status: 400 })
                }
            }
        });
    }
    
}



module.exports = new Loja;