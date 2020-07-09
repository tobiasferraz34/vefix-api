const conexao = require('../infraestrutura/conexao');
const moment = require('moment');

class Veiculo {

    adiciona(veiculo, res) {
        const { ano, anoModelo, chassi, cor, marca, modelo, municipio, placa, situacao, uf } = veiculo;

        if (!ano || !anoModelo || !chassi || !cor || !marca || !modelo
            || !municipio, !! !placa || !situacao || !uf) {
            res.status(400).json({ status: 400, msg: "Por favor, preencher todos os campos" });
        } else {
            const data_cad = moment().format('YYYY-MM-DD hh:mm:ss');
            const veiculoDatado = { ano, anoModelo, chassi, cor, marca, modelo, municipio, placa, situacao, uf, data_cad }

            let sql = `SELECT * FROM VEICULOS WHERE veiculos.placa = ?`;
            conexao.query(sql, [veiculo.placa], (erro, resultados) => {
                if (erro) {
                    res.status(400).json({ status: 400, msg: erro });
                } else {
                    if (resultados.length > 0) {    
                        res.status(400).json({ status: 400, msg: "Já existem um veiculo cadastrado, com a placa informada." });
                    } else {
                        //Cadastro do veiculo
                        sql = 'INSERT INTO veiculos SET ?';
                        conexao.query(sql, veiculoDatado, (erro, resultados) => {
                            if (erro) {
                                res.status(400).json(erro);
                            } else {
                                //Recuperando o id do veiculo cadastrado
                                sql = `INSERT INTO usuariosxveiculos (id_usuario, id_veiculo) VALUES (?, ?);`;
                                conexao.query(sql, [veiculo.id_usuario, resultados.insertId],(erro, resultados) => {
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

    buscaPorId(id, res) {
        const sql = `SELECT veiculos.id, veiculos.ano, veiculos.anoModelo, 
        veiculos.chassi, veiculos.cor, veiculos.marca, veiculos.modelo,
        veiculos.municipio, veiculos.placa, veiculos.situacao,
        veiculos.uf, veiculos.data_cad
        FROM usuarios 
        INNER JOIN usuariosxveiculos ON usuarios.id = usuariosxveiculos.id_usuario
        INNER JOIN veiculos ON usuariosxveiculos.id_veiculo = veiculos.id
        WHERE usuarios.id = ?`

        conexao.query(sql, [id], (erro, resultados) => {
            if(erro) {
                res.status(400).json({ status: 400, msg: erro });
            } else {
                res.status(200).json({ status: 200, resultados });
                console.log(resultados)
            }
        });
    }


}

module.exports = new Veiculo;