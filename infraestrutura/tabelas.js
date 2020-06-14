class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarAtendimentos();
        this.criarOficinas();
        this.criarServicos();
        this.extrairDadosServicos();
        this.criarOficiasXServicos();
        this.criarUsuarios();
    }

    criarAtendimentos() {
        const sql = 'CREATE TABLE IF NOT EXISTS atendimentos (id int NOT NULL AUTO_INCREMENT,' + 
        'cliente varchar(50) NOT NULL, pet varchar(20), servico varchar(20) NOT NULL, data datetime NOT NULL,' + 
        'dataCriacao datetime NOT NULL, status varchar(20) NOT NULL, observacoes text, PRIMARY KEY(id))'

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de atendimento criada com sucesso")
            }
        });
    }

    criarUsuarios() {
        const sql = `CREATE TABLE IF NOT EXISTS usuarios (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(100) NOT NULL DEFAULT '0',
            email varchar(255) NOT NULL DEFAULT '0',
            senha varchar(255) NOT NULL DEFAULT '0',
            uf varchar(10) NOT NULL DEFAULT '0',
            cidade varchar(50) NOT NULL DEFAULT '0',
            data_cad datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de usuários criada com sucesso")
            }
        });
    }

    criarOficinas() {
        const sql = `CREATE TABLE IF NOT EXISTS oficinas (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(50) NOT NULL DEFAULT '0',
            email varchar(255) NOT NULL DEFAULT '0',
            cpf_cnpj varchar(255) NOT NULL DEFAULT '0',
            senha varchar(50) NOT NULL DEFAULT '0',
            estado varchar(15) DEFAULT NULL,
            cidade varchar(25) DEFAULT NULL,
            cep varchar(25) DEFAULT NULL,
            bairro varchar(25) DEFAULT NULL,
            logradouro varchar(25) DEFAULT NULL,
            complemento varchar(25) DEFAULT NULL,
            latitude varchar(20) NOT NULL DEFAULT '0',
            Longitude varchar(20) NOT NULL DEFAULT '0',
            telefone varchar(20) NOT NULL DEFAULT '0',
            data_cad datetime DEFAULT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de oficinas criada com sucesso")
            }
        });
    }

    criarServicos() {
        const sql = `CREATE TABLE IF NOT EXISTS servicos (
            id int(11) NOT NULL AUTO_INCREMENT,
            nome varchar(50) NOT NULL DEFAULT '0',
            status varchar(10) NOT NULL DEFAULT 'ATIVO',
            data_horaMovto datetime NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de serviços criada com sucesso")
            }
        });
    }

    extrairDadosServicos() {
        const sql = `INSERT INTO servicos (nome, status, data_horaMovto) VALUES
        ('REVISÃO', 'ATIVO', '2020-06-05 15:43:41'),
        ('MECANICA EM GERAL', 'ATIVO', '2020-06-05 15:43:57'),
        ('ELÉTRICA', 'ATIVO', '2020-06-05 15:44:14'),
        ('FUNILARIA/PINTURA', 'ATIVO', '2020-06-05 15:44:45');`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("extração de dados da tabela de serviços criada com sucesso")
            }
        });
    }

    criarOficiasXServicos() {
        const sql = `CREATE TABLE IF NOT EXISTS oficinasxservicos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_oficina int(11) NOT NULL DEFAULT 0,
            id_servico int(11) NOT NULL DEFAULT 0,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de oficinas x serviços criada com sucesso")
            }
        });
    }

}


module.exports = new Tabelas