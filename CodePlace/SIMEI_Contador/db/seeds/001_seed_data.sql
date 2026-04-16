-- SIMEI Contador - Dados de Seed para Desenvolvimento
-- Executar após as migrations

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, role) VALUES
('Administrador', 'admin@simei.com', '$2a$12$wGhRjgqa2O3j.2UxiOw.C.krlJ1jIH7ZGyO/pnAlo8lMNK1WEMp8K', 'super_usuario');

-- Inserir empresa de exemplo
INSERT INTO empresas (cnpj, razao_social, nome_fantasia, regime_tributario, cnae_principal, endereco) VALUES
('12345678000190', 'EMPRESA EXEMPLO LTDA', 'Exemplo', 'simples_nacional', '4711302', 
 '{"logradouro": "Rua Exemplo", "numero": "123", "bairro": "Centro", "cidade": "São Paulo", "uf": "SP", "cep": "01310100"}');

-- Vincular admin à empresa
UPDATE usuarios SET empresa_id = 1 WHERE id = 1;

-- Inserir usuário da empresa (senha: empresa123)
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, role) VALUES
(1, 'Usuário Empresa', 'usuario@exemplo.com', '$2a$12$LhFHPESuKPJEUnYPNHQczOgLYLzQX.cSi3mv5pfoLpDPvxcpAF5hy', 'empresa');

-- Inserir lançamentos de exemplo (últimos 6 meses)
INSERT INTO lancamentos (empresa_id, tipo, categoria, descricao, valor, data, created_by) VALUES
-- Mês atual
(1, 'receita', 'Vendas', 'Vendas de mercadorias', 45000.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1),
(1, 'receita', 'Serviços', 'Prestação de serviços', 12000.00, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 1),
(1, 'despesa', 'Aluguel', 'Aluguel do escritório', 3500.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 1),
(1, 'despesa', 'Folha', 'Salários e encargos', 18000.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 1),
(1, 'despesa', 'Fornecedores', 'Compra de mercadorias', 22000.00, DATE_SUB(CURDATE(), INTERVAL 8 DAY), 1),

-- Mês passado
(1, 'receita', 'Vendas', 'Vendas de mercadorias', 52000.00, DATE_SUB(CURDATE(), INTERVAL 35 DAY), 1),
(1, 'receita', 'Serviços', 'Prestação de serviços', 8500.00, DATE_SUB(CURDATE(), INTERVAL 40 DAY), 1),
(1, 'despesa', 'Aluguel', 'Aluguel do escritório', 3500.00, DATE_SUB(CURDATE(), INTERVAL 32 DAY), 1),
(1, 'despesa', 'Folha', 'Salários e encargos', 17500.00, DATE_SUB(CURDATE(), INTERVAL 35 DAY), 1),
(1, 'despesa', 'Fornecedores', 'Compra de mercadorias', 25000.00, DATE_SUB(CURDATE(), INTERVAL 38 DAY), 1),

-- 2 meses atrás
(1, 'receita', 'Vendas', 'Vendas de mercadorias', 48000.00, DATE_SUB(CURDATE(), INTERVAL 65 DAY), 1),
(1, 'receita', 'Serviços', 'Prestação de serviços', 10000.00, DATE_SUB(CURDATE(), INTERVAL 70 DAY), 1),
(1, 'despesa', 'Aluguel', 'Aluguel do escritório', 3500.00, DATE_SUB(CURDATE(), INTERVAL 62 DAY), 1),
(1, 'despesa', 'Folha', 'Salários e encargos', 17000.00, DATE_SUB(CURDATE(), INTERVAL 65 DAY), 1),

-- 3 meses atrás
(1, 'receita', 'Vendas', 'Vendas de mercadorias', 41000.00, DATE_SUB(CURDATE(), INTERVAL 95 DAY), 1),
(1, 'despesa', 'Aluguel', 'Aluguel do escritório', 3500.00, DATE_SUB(CURDATE(), INTERVAL 92 DAY), 1),
(1, 'despesa', 'Folha', 'Salários e encargos', 16500.00, DATE_SUB(CURDATE(), INTERVAL 95 DAY), 1);

-- Inserir guia DAS de exemplo
INSERT INTO guias (empresa_id, tipo, competencia, valor, data_vencimento, status, anexo, aliquota_efetiva) VALUES
(1, 'DAS', DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m'), 3200.50, 
 DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)), INTERVAL 20 DAY), 'pago', 'I', 5.60),
(1, 'DAS', DATE_FORMAT(CURDATE(), '%Y-%m'), 3450.00, 
 DATE_ADD(LAST_DAY(CURDATE()), INTERVAL 20 DAY), 'pendente', 'I', 5.75);

-- Configurações globais
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('aliquotas_simples', '{"I": [4.0, 7.3, 9.5, 10.7, 14.3, 19.0], "II": [4.5, 7.8, 10.0, 11.2, 14.7, 30.0]}', 'Alíquotas nominais dos anexos'),
('limite_simples', '{"anual": 4800000}', 'Limite de faturamento do Simples Nacional');
