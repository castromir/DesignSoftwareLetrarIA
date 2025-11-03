# Protótipos

Grupo 4 : https://lovable.dev/projects/53a874af-4b34-4642-9650-1aa87a038300

Grupo 2 : https://www.figma.com/design/HD1vK6dSyNRxFuPE80wTmp/Prot%C3%B3tipos-de-tela---Hist%C3%B3rias-de-usu%C3%A1rio?node-id=0-1&p=f&t=NPTbITXMapNmKEhC-0

---

# Letrar IA - Guia de Instalação e Execução

## Pré-requisitos

- Docker e Docker Compose instalados
- Git instalado

## Passo a Passo de Instalação

### 1. Clonar o Repositório

```bash
git clone git@github.com:castromir/DesignSoftwareLetrarIA.git
cd DesignSoftwareLetrarIA/DOC
```

### 2. Iniciar os Serviços com Docker

Subir todos os serviços (banco de dados, backend e frontend):

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Este comando irá:
- Criar e iniciar o container do PostgreSQL na porta **55432**
- Criar e iniciar o container do Backend (FastAPI) na porta **8888**
- Criar e iniciar o container do Frontend (React/Vite) na porta **5174**

### 3. Executar as Migrations do Banco de Dados

Aplicar as migrations para criar as tabelas no banco:

```bash
docker exec letraria-backend-dev alembic upgrade head
```

Este comando irá criar todas as tabelas definidas nos models SQLAlchemy.

### 4. Popular o Banco com Dados Iniciais (Seeders)

Executar o seed para criar usuários iniciais:

```bash
docker exec letraria-backend-dev python /app/run_seed.py
```

Este comando criará 4 usuários no banco de dados.

### 5. Verificar se os Serviços Estão Rodando

Verificar o status dos containers:

```bash
docker-compose -f docker-compose.dev.yml ps
```

Todos os serviços devem estar com status `Up`.

## Credenciais de Acesso

Após executar os seeders, os seguintes usuários estarão disponíveis para login:

### Administrador
- **Email:** `admin@letraria.com`
- **Senha:** `admin123`
- **Role:** Admin

### Professores (3 usuários)
- **Email:** `professor1@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** Ana Silva

- **Email:** `professor2@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** Carlos Santos

- **Email:** `professor3@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** Maria Oliveira

## Acessar a Aplicação

### Frontend
- URL: http://localhost:5174
- Interface web da aplicação

### Backend API
- URL: http://localhost:8888
- Documentação interativa (Swagger): http://localhost:8888/docs
- Documentação alternativa (ReDoc): http://localhost:8888/redoc

### Banco de Dados
- **Host:** localhost
- **Porta:** 55432
- **Database:** letraria_db
- **Usuário:** letrarIA
- **Senha:** 123

## Comandos Úteis

### Parar os Serviços

```bash
docker-compose -f docker-compose.dev.yml down
```

### Parar e Remover Volumes (apaga dados do banco)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Ver Logs dos Serviços

```bash
# Logs de todos os serviços
docker-compose -f docker-compose.dev.yml logs -f

# Logs apenas do backend
docker logs letraria-backend-dev -f

# Logs apenas do frontend
docker logs letraria-frontend-dev -f

# Logs apenas do banco
docker logs letraria-db-dev-new -f
```

### Reiniciar um Serviço Específico

```bash
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend
docker-compose -f docker-compose.dev.yml restart db
```

### Criar Nova Migration

```bash
docker exec letraria-backend-dev alembic revision --autogenerate -m "Nome da migration"
```

### Verificar Estado das Migrations

```bash
docker exec letraria-backend-dev alembic current
docker exec letraria-backend-dev alembic history
```

### Reexecutar Seeder (limpar usuários antes)

Para reexecutar o seeder, primeiro é necessário limpar os usuários do banco:

```bash
# Conectar ao banco e remover usuários
docker exec -it letraria-db-dev-new psql -U letrarIA -d letraria_db -c "DELETE FROM users;"

# Executar o seeder novamente
docker exec letraria-backend-dev python /app/run_seed.py
```

## Estrutura de Portas

- **Frontend:** 5174
- **Backend API:** 8888
- **PostgreSQL:** 55432

## Notas Importantes

- As alterações no código do backend e frontend são aplicadas automaticamente devido ao hot reload configurado
- Os dados do banco são persistidos em volumes Docker e não serão perdidos ao reiniciar os containers
- Para limpar completamente e recriar tudo, use `docker-compose -f docker-compose.dev.yml down -v` e depois `docker-compose -f docker-compose.dev.yml up -d`
