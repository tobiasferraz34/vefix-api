const moment = require('moment');
const conexao = require('../infraestrutura/conexao');

class Atendimento {

    adiciona(atendimento, res) {

        const {id_veiculo, id_cliente, id_oficina, servico, observacao, hora_agendamento} = atendimento;

        let dataCriacao = moment().format('YYYY-MM-DD');
        const data_agendamento = moment(atendimento.data_agendamento, 'YYYY-MM-DD').format('YYYY-MM-DD');

        console.log(dataCriacao + " " + data_agendamento);
        
        const dataValida = moment(data_agendamento).isSameOrAfter(dataCriacao); //true ou false

        if(dataValida) {
            dataCriacao = moment().format('YYYY-MM-DD hh:mm:ss');
            const atendimentoDatado = {id_veiculo, id_cliente, id_oficina, servico, observacao, dataCriacao, data_agendamento, hora_agendamento }
            const sql = 'INSERT INTO atendimentos SET ?'
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json({status: 400, msg: erro});
                } else {
                    res.status(200).json({status: 200, msg: "Cadastrado com sucesso"});
                }
            });
        } else {
            res.status(400).json({status: 400, msg: 'A data deve ser maior ou igual a data atual'});
        }
    }

    lista(placaVeiculo, marcaVeiculo, modeloVeiculo, servico, dt_agend, res) {
        const sql = `SELECT usuarios.id, usuarios.nome AS usuario, veiculos.id AS id_veiculo, veiculos.marca, veiculos.modelo,
        veiculos.placa, oficinas.nome AS oficina,  atendimentos.id AS id_atendimento,atendimentos.servico, 
        date_format(atendimentos.data_agendamento, '%d/%m/%y') AS data_agendamento,
        atendimentos.hora_agendamento, atendimentos.observacao, atendimentos.status,
        date_format(atendimentos.dataCriacao, '%d/%m/%y Às %Hh%i') AS dataCriacao
        FROM atendimentos 
        INNER JOIN veiculos ON atendimentos.id_veiculo = veiculos.id
        INNER JOIN oficinas ON atendimentos.id_oficina = oficinas.id
        INNER JOIN usuarios ON atendimentos.id_cliente = usuarios.id
        WHERE atendimentos.id <> 0 ${placaVeiculo} ${marcaVeiculo} ${modeloVeiculo} ${servico} ${dt_agend}   
        ORDER BY veiculos.id DESC`;

        conexao.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json();
            } else {
                res.status(200).json({ status: 200, resultados});
            }
        })
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE Atendimentos.id = ${id}`;

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0];
            if(erro) {
                res.status(400).json();
            } else {
                res.status(200).json(atendimento);
            }
        });
    } 
    
    altera(id, valores, res) {
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        }

        const sql = 'UPDATE atendimentos SET ? WHERE id=?';
        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json({...valores, id});
            }
        })
    }
    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id=?';

        conexao.query(sql, id, (erro, resultados) => {
            if(erro) {
                res.status(400).json();
            } else {
                res.status(200).json({id});
            }
        });
    }
}

module.exports = new Atendimento;