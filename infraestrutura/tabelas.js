class Tabelas {
    init(conexao) {
        this.conexao = conexao;
        this.criarAtendimentos();
        this.criarOficinas();
        this.criarServicos();
        this.criarOficiasXServicos();
        this.criarUsuarios();
        this.criarVeiculos();
        this.criarUsuarioXVeiculos();
        this.criarOrdemServicos();
        this.criarItensServicos();
        this.criarAvaliacao();
        this.criarProdutos();
        this.criarPedidos();
        this.criarItemsPedidos();

    }

    criarAtendimentos() {
        const sql = `CREATE TABLE IF NOT EXISTS atendimentos (
        id int NOT NULL AUTO_INCREMENT,
        id_cliente INT NOT NULL DEFAULT '0',
        id_veiculo INT NOT NULL DEFAULT '0',
        id_oficina INT NOT NULL DEFAULT '0',
        servico varchar(50) NOT NULL, 
        data_agendamento DATE NOT NULL,
        hora_agendamento TIME NOT NULL,
        observacao text, 
        dataCriacao datetime NOT NULL,     
        status varchar(20) NOT NULL DEFAULT 'AGENDADO',
        avaliado VARCHAR(5) NULL DEFAULT 'NAO',
        PRIMARY KEY(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

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
            celular varchar(20) NOT NULL DEFAULT '0',
            senha varchar(255) NOT NULL DEFAULT '0',
            data_cad datetime NOT NULL,
            nivel_acesso INT NOT NULL DEFAULT '1',
            estado	varchar(255) NULL DEFAULT '0',
            cidade	varchar(255) NULL DEFAULT '0',
            cep	varchar(255) NULL DEFAULT '0',
            bairro	varchar(255) NULL DEFAULT '0',
            logradouro	varchar(255) NULL DEFAULT '0',
            complemento	varchar(255) NULL DEFAULT '0',	
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
            logo varchar(255) DEFAULT NULL,
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

    criarVeiculos() {
        const sql = `CREATE TABLE IF NOT EXISTS veiculos (
            id int(11) NOT NULL AUTO_INCREMENT,
            ano int(11) NOT NULL DEFAULT 0,
            anoModelo int(11) NULL DEFAULT 0,
            chassi varchar(15) NULL DEFAULT 0,
            cor varchar(10) NOT NULL DEFAULT 0,
            marca varchar(50) NOT NULL DEFAULT 0,
            modelo varchar(50) NOT NULL DEFAULT 0,
            municipio varchar(20) NULL DEFAULT 0,
            placa varchar(10) NOT NULL DEFAULT 0,
            situacao varchar(15) NULL DEFAULT 0,
            uf varchar(10) NULL DEFAULT 0,
            motorizacao varchar(50) NOT NULL DEFAULT 0,
            data_cad DATETIME NOT NULL,  
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de veiculos criada com sucesso")
            }
        });
    }

    criarUsuarioXVeiculos() { 
        const sql = `CREATE TABLE IF NOT EXISTS usuariosxveiculos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_usuario int(11) NOT NULL DEFAULT 0,
            id_veiculo int(11) NOT NULL DEFAULT 0,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de usuarios x veiculos criada com sucesso")
            }
        });
    }

    criarOrdemServicos() {
        const sql = `CREATE TABLE IF NOT EXISTS ordem_servicos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_atendimento int(11) NOT NULL DEFAULT 0,
            responsavel_servico varchar(50) NOT NULL DEFAULT 0,
            dt_inicial DATE NOT NULL,
            dt_final DATE NOT NULL,
            descricao_servico varchar(300) NOT NULL DEFAULT 0,
            data_cad DATE NOT NULL,
            hora_cad TIME NOT NULL,
            status varchar(50) NOT NULL DEFAULT 'ABERTO',
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de ordem serviços criada com sucesso")
            }
        });
    }

    criarItensServicos() {
        const sql = `CREATE TABLE IF NOT EXISTS itens_servicos (
            id int(11) NOT NULL AUTO_INCREMENT,
            id_os int(11) NOT NULL DEFAULT 0,
            nome_item varchar(50) NOT NULL DEFAULT 0,
            valor_item DOUBLE NOT NULL DEFAULT 0,
            data_horaCad DATETIME NOT NULL,
            PRIMARY KEY(id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        

        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de itens de serviços criada com sucesso")
            }
        });
    }

    criarAvaliacao() {
        const sql = `CREATE TABLE IF NOT EXISTS avaliacao (
            id INT NOT NULL AUTO_INCREMENT,
            pontuacao INT NOT NULL DEFAULT '0',
            id_oficina INT NOT NULL DEFAULT '0',
            id_usuario INT NOT NULL DEFAULT '0',
            data_horaCad DATETIME NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de avaliação criada com sucesso")
            }
        });
    }

    criarProdutos() {
        const sql = `CREATE TABLE IF NOT EXISTS produtos (
            id INT NOT NULL AUTO_INCREMENT,
            nome varchar(255) NULL DEFAULT '0',
            preco double NOT NULL DEFAULT 0,
            quantidade int NOT NULL DEFAULT '0',
            descricao text NOT NULL,
            image text NOT NULL,
            data_cad DATETIME NOT NULL,
            id_oficina	int NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de produtos criada com sucesso")
            }
        });
    }

    criarPedidos() {
        const sql = `CREATE TABLE IF NOT EXISTS pedidos (
            id INT NOT NULL AUTO_INCREMENT,
            id_usuario INT NOT NULL DEFAULT '0',
            id_oficina INT NOT NULL DEFAULT '0',
            data DATE NOT NULL,
            status varchar(15) NOT NULL DEFAULT 'ATIVO',
            total double NOT NULL DEFAULT 0,
            forma_pagamento	varchar(100) NOT NULL DEFAULT '0',
            forma_envio	varchar(100) NOT NULL DEFAULT '0',
            data_cad DATETIME NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de pedidos criada com sucesso")
            }
        });
    }

    criarItemsPedidos() {
        const sql = `CREATE TABLE IF NOT EXISTS items_pedidos (
            id INT NOT NULL AUTO_INCREMENT,
            id_pedido INT NOT NULL DEFAULT '0',
            id_produto INT NOT NULL DEFAULT '0',
            nome varchar(255) NOT NULL DEFAULT '0',
            preco_unitario	double NOT NULL DEFAULT 0,
            quantidade INT NOT NULL DEFAULT '0',
            subTotal double NOT NULL DEFAULT 0,
            data_cad DATETIME NOT NULL,
            PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        
        this.conexao.query(sql, (erro) => {
            if(erro) {
                console.log(erro);
            } else {
                console.log("Tabela de items_pedidos criada com sucesso")
            }
        });
    }



}


module.exports = new Tabelas