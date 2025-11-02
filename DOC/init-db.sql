-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente quando o container do PostgreSQL for criado pela primeira vez

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Este arquivo pode ser usado para criar tabelas iniciais, inserir dados de seed, etc.
-- As migrations do Alembic serão responsáveis pela criação do schema completo

