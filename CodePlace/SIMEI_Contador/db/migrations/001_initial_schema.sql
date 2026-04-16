-- SIMEI Contador - Schema do Banco de Dados
-- MySQL 8.0

-- Tabela de Empresas
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    regime_tributario ENUM('simples_nacional', 'lucro_presumido', 'lucro_real') DEFAULT 'simples_nacional',
    cnae_principal VARCHAR(10),
    endereco JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_cnpj (cnpj),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    role ENUM('empresa', 'admin', 'super_usuario') DEFAULT 'empresa',
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Lançamentos Contábeis
CREATE TABLE IF NOT EXISTS lancamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor DECIMAL(15, 2) NOT NULL,
    data DATE NOT NULL,
    documento VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_empresa_data (empresa_id, data),
    INDEX idx_tipo (tipo),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Guias (DAS, DARF, etc.)
CREATE TABLE IF NOT EXISTS guias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo ENUM('DAS', 'DARF', 'GPS', 'OUTROS') NOT NULL,
    competencia VARCHAR(7) NOT NULL, -- YYYY-MM
    valor DECIMAL(15, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status ENUM('pendente', 'pago', 'vencido') DEFAULT 'pendente',
    codigo_barras VARCHAR(100),
    anexo VARCHAR(20),
    aliquota_efetiva DECIMAL(5, 2),
    detalhamento JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    INDEX idx_empresa_competencia (empresa_id, competencia),
    INDEX idx_vencimento (data_vencimento),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Documentos
CREATE TABLE IF NOT EXISTS documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    caminho VARCHAR(500) NOT NULL,
    tamanho INT,
    mimetype VARCHAR(100),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entidade VARCHAR(50) NOT NULL,
    entidade_id INT NOT NULL,
    acao ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    usuario_id INT,
    dados_anteriores JSON,
    dados_novos JSON,
    ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_entidade (entidade, entidade_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_data (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Configurações Globais
CREATE TABLE IF NOT EXISTS configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor JSON NOT NULL,
    descricao TEXT,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
