-- Script para criar a tabela de produtos no Supabase (usando camelCase para bater com o código)
-- Execute este script no SQL Editor do seu projeto Supabase

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  "precoCusto" NUMERIC(10, 2) DEFAULT 0,
  "precoVenda" NUMERIC(10, 2) DEFAULT 0,
  "estoqueAtual" INTEGER DEFAULT 0,
  "estoqueMinimo" INTEGER DEFAULT 0,
  "leadTimeDias" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Row Level Security) - opcional, mas recomendado
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso público (apenas para testes, ajuste depois!)
CREATE POLICY "Permitir tudo para todos" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Inserir dados iniciais
INSERT INTO products (nome, "precoCusto", "precoVenda", "estoqueAtual", "estoqueMinimo", "leadTimeDias")
VALUES 
('Faca Chef Santoku 18cm — Aço Damasco', 0, 0, 0, 0, 0),
('Faca Paring 9cm — Cabo Olmo', 0, 0, 0, 0, 0),
('Faca Bread 20cm — Série Artesão', 0, 0, 0, 0, 0),
('Faca Utility 15cm — Carbono Forjado', 0, 0, 0, 0, 0),
('Kit 3 Facas — Presente Premium', 0, 0, 0, 0, 0),
('Faca Filet 16cm — Aço Inox 67 Camadas', 0, 0, 0, 0, 0),
('Faca Nakiri 17cm — Cabo Ébano', 0, 0, 0, 0, 0),
('Chaira Diamantada 26cm', 0, 0, 0, 0, 0);
