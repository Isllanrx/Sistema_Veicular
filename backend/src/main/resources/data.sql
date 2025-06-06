-- Inserir Fornecedores
INSERT INTO fornecedor (nome, empresa, email, telefone, endereco)
VALUES
('Tech Solutions', 'Tech Solutions Comércio de Eletrônicos', 'contato@techsolutions.com', '(11) 9999-8888', 'Av. Paulista, 1000'),
('Eletrônicos Brasil', 'Eletrônicos Brasil Distribuidora', 'vendas@eletronicos.com', '(11) 3333-4444', 'Rua Augusta, 500'),
('Mega Distribuidora', 'Mega Distribuidora de Tecnologia', 'atendimento@mega.com', '(11) 5555-6666', 'Av. Rebouças, 200'),
('Global Tech', 'Global Tech Importação e Exportação', 'comercial@globaltech.com', '(11) 7777-8888', 'Rua Oscar Freire, 300'),
('Inovação Digital', 'Inovação Digital Equipamentos', 'contato@inovacao.com', '(11) 2222-3333', 'Av. Brigadeiro Faria Lima, 1500'),
('Tech Express', 'Tech Express Informática', 'vendas@techexpress.com', '(11) 4444-5555', 'Rua Haddock Lobo, 400'),
('Digital Solutions', 'Digital Solutions Tecnologia', 'atendimento@digital.com', '(11) 6666-7777', 'Av. Berrini, 1000'),
('Tech Pro', 'Tech Pro Equipamentos', 'comercial@techpro.com', '(11) 8888-9999', 'Rua da Consolação, 600'),
('Inovação Tech', 'Inovação Tech Informática', 'contato@inovacaotech.com', '(11) 1111-2222', 'Av. Jabaquara, 800'),
('Tech Master', 'Tech Master Eletrônicos', 'vendas@techmaster.com', '(11) 3333-4444', 'Rua Vergueiro, 700');

-- Inserir Categorias
INSERT INTO categoria (nome, descricao, ativa)
VALUES
('Eletrônicos', 'Produtos eletrônicos em geral', true),
('Informática', 'Produtos de informática e computadores', true),
('Periféricos', 'Acessórios e periféricos para computadores', true),
('Redes', 'Equipamentos de rede e conectividade', true),
('Armazenamento', 'Dispositivos de armazenamento de dados', true);

-- Inserir Produtos
INSERT INTO produto (nome, descricao, preco, quantidade, fornecedor_id, categoria_id)
VALUES
('Notebook Dell XPS', 'Notebook Dell XPS 13 polegadas', 8999.90, 10, 1, 2),
('Monitor LG 27"', 'Monitor LED 27 polegadas Full HD', 1299.90, 15, 2, 1),
('Teclado Mecânico', 'Teclado mecânico RGB', 499.90, 20, 3, 3),
('Mouse Gamer', 'Mouse gamer com 6 botões', 299.90, 25, 4, 3),
('SSD 1TB', 'SSD SATA 1TB', 599.90, 30, 5, 5),
('Router Wi-Fi 6', 'Router Wi-Fi 6 AX3000', 799.90, 12, 6, 4),
('Webcam HD', 'Webcam 1080p', 399.90, 18, 7, 3),
('Headset Gamer', 'Headset com microfone', 599.90, 22, 8, 3),
('Impressora Laser', 'Impressora laser monocromática', 1299.90, 8, 9, 1),
('Tablet Samsung', 'Tablet Samsung Galaxy Tab S7', 2999.90, 15, 10, 1),
('HD Externo 2TB', 'HD Externo USB 3.0 2TB', 799.90, 20, 1, 5),
('Switch 24 Portas', 'Switch gerenciável 24 portas', 1499.90, 10, 2, 4),
('Memória RAM 16GB', 'Memória RAM DDR4 16GB', 499.90, 25, 3, 2),
('Placa de Vídeo', 'Placa de vídeo RTX 3060', 2999.90, 8, 4, 2),
('Fonte 750W', 'Fonte ATX 750W 80 Plus Gold', 899.90, 15, 5, 2);

-- Função para gerar data aleatória nos últimos 10 meses
CREATE OR REPLACE FUNCTION random_date() RETURNS TIMESTAMP AS $$
BEGIN
    RETURN CURRENT_TIMESTAMP - (random() * interval '300 days');
END;
$$ LANGUAGE plpgsql;

-- Inserir Movimentações
DO $$
DECLARE
    i INTEGER;
    produto_id INTEGER;
    quantidade INTEGER;
    tipo VARCHAR(10);
    data_mov TIMESTAMP;
BEGIN
    FOR i IN 1..100 LOOP
        -- Seleciona um produto aleatório
        SELECT id INTO produto_id FROM produto ORDER BY random() LIMIT 1;
        -- Gera quantidade aleatória entre 200 e 500
        quantidade := floor(random() * 301) + 200;
        -- Alterna entre ENTRADA e SAIDA
        tipo := CASE WHEN random() > 0.5 THEN 'ENTRADA' ELSE 'SAIDA' END;
        -- Gera data aleatória nos últimos 10 meses
        data_mov := CURRENT_DATE - (trunc(random() * 300)) * INTERVAL '1 day';
        -- Insere a movimentação
        INSERT INTO movimentacao (tipo, quantidade, observacao, data_criacao, usuario_id, produto_id)
        VALUES (
            tipo,
            quantidade,
            CASE WHEN tipo = 'ENTRADA' THEN 'Entrada de estoque' ELSE 'Saída de estoque' END,
            data_mov,
            1, -- Ajuste para um usuário válido existente
            produto_id
        );
    END LOOP;
END $$; 