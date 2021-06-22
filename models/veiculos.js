const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

class Veiculo {
    
    adiciona(veiculo, res) {
        const { ano, cor, marca, modelo, placa, motorizacao} = veiculo;

        if (!ano || !cor || !marca || !modelo ||  !placa || !motorizacao) {
            res.status(400).json({ status: 400, msg: "Por favor, preencher todos os campos" });
        } else {
            const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');
            const veiculoDatado = { ano, cor, marca, modelo, placa, motorizacao, data_cad }

            let sql = `SELECT * FROM veiculos WHERE veiculos.placa = ?`;
            conexao.query(sql, [veiculo.placa], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    if (resultados.length > 0) {    
                        res.status(400).json({ status: 400, msg: "Já existe um veiculo cadastrado, com a placa informada." });
                    } else {
                        //Cadastro do veiculo
                        sql = 'INSERT INTO veiculos SET ?';
                        conexao.query(sql, veiculoDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                //Recuperando o id do veiculo cadastrado
                                sql = `INSERT INTO usuariosxveiculos (id_usuario, id_veiculo) VALUES (?, ?);`;
                                conexao.query(sql, [veiculo.userId, resultados.insertId],(erro, resultados) => {
                                    if (erro) {
                                        res.status(400).json(erro);
                                    } else {
                                        res.status(200).json({ status: 200, msg: "Veiculo cadastrado com sucesso" });
                                    }
                                })

                            }
                        });
                    }
                }
            })
        }
    }

    lista(res) {
        const sql = `SELECT usuarios.nome as dono, usuarios.id, veiculos.id AS id_veiculo,
        veiculos.placa, veiculos.ano, 
        veiculos.anoModelo, veiculos.chassi, veiculos.cor, 
        veiculos.marca, veiculos.modelo,
        veiculos.municipio, veiculos.situacao,
        veiculos.uf, date_format(veiculos.data_cad, '%d/%m/%y as %Hh%i') AS data_cad
        FROM veiculos
        INNER JOIN usuariosxveiculos ON veiculos.id = usuariosxveiculos.id_veiculo
        INNER JOIN usuarios ON usuariosxveiculos.id_usuario = usuarios.id
        ORDER BY veiculos.id desc`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ status: 200, resultados});
            }
        })
    }

    buscaPorId(id, res) {
        
    }


}

module.exports = new Veiculo;