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

```DOC/README.md#L1-20
git clone git@github.com:castromir/DesignSoftwareLetrarIA.git
cd DesignSoftwareLetrarIA/DOC
```

### 2. Iniciar os Serviços com Docker

Subir todos os serviços (banco de dados, backend e frontend):

```DOC/README.md#L21-40
docker-compose -f docker-compose.dev.yml up -d
```

Este comando irá:
- Criar e iniciar o container do PostgreSQL na porta **55432**
- Criar e iniciar o container do Backend (FastAPI) na porta **8888**
- Criar e iniciar o container do Frontend (React/Vite) na porta **5174**

### 2.1 (Importante) Criar a extensão `pg_trgm` no PostgreSQL

Algumas funcionalidades (como buscas por similaridade ou índices trigram) exigem a extensão `pg_trgm`. Execute este passo após o banco subir e antes de aplicar migrations que dependam da extensão.

Executar no container do banco (recomendado):

```DOC/README.md#L41-60
docker exec -it letraria-db-dev-new psql -U letraria_user -d letraria_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

Observações:
- O nome do container do banco no `docker-compose.dev.yml` é `letraria-db-dev-new`.
- Se preferir executar sem tty, remova `-it`.
- Se você receber erro de permissão, verifique se está executando como um superuser do PostgreSQL (a imagem oficial do Postgres normalmente já permite isso através do usuário `postgres` ou do usuário criado via env vars).

### 3. Executar as Migrations do Banco de Dados

Aplicar as migrations para criar as tabelas no banco:

```DOC/README.md#L61-80
docker exec letraria-backend-dev alembic upgrade head
```

Este comando irá criar todas as tabelas definidas nos models SQLAlchemy.

### 3.1 Gerar uma nova migration (quando necessário)

Se você alterou os models ou está inicializando o projeto sem migrações, gere uma migration com:

```DOC/README.md#L81-100
docker exec letraria-backend-dev alembic revision --autogenerate -m "Create all tables"
```

Depois aplique:

```DOC/README.md#L101-120
docker exec letraria-backend-dev alembic upgrade head
```

### 4. Popular o Banco com Dados Iniciais (Seeders)

Executar o seed para criar usuários iniciais:

```DOC/README.md#L121-140
docker exec letraria-backend-dev python /app/run_seed.py
```

Este comando criará:
- 4 usuários (1 admin + 3 profissionais)
- 6 alunos (vinculados ao primeiro profissional)
- 6 atividades (vinculadas aos alunos do profissional)

### 5. Verificar se os Serviços Estão Rodando

Verificar o status dos containers:

```DOC/README.md#L141-160
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
- **Email:** `professor@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** Maria Silva
- **Função:** Professora de Alfabetização
- **Username:** maria.silva

- **Email:** `joao.santos@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** João Santos
- **Função:** Coordenador Pedagógico
- **Username:** joao.santos

- **Email:** `ana.paula@letraria.com`
- **Senha:** `prof123`
- **Role:** Professional
- **Nome:** Ana Paula
- **Função:** Professora de Reforço
- **Username:** ana.paula

## Seeders Disponíveis

O projeto possui seeders para popular o banco de dados com dados iniciais:

### Executar Todos os Seeders
```DOC/README.md#L161-180
docker exec letraria-backend-dev python /app/run_seed.py
```

### Executar Seeders Individuais
```DOC/README.md#L181-200
# Apenas usuários e profissionais
docker exec letraria-backend-dev python -c "import asyncio; from seeds.seed_users import seed_users; asyncio.run(seed_users())"

# Apenas alunos
docker exec letraria-backend-dev python -c "import asyncio; from seeds.seed_students import seed_students; asyncio.run(seed_students())"

# Apenas atividades
docker exec letraria-backend-dev python -c "import asyncio; from seeds.seed_activities import seed_activities; asyncio.run(seed_activities())"
```

### Alunos Criados pelo Seeder

Os seguintes alunos são criados automaticamente e associados ao primeiro profissional encontrado:

1. **João Augusto**
   - Matrícula: 2024001
   - Idade: 12 anos
   - Gênero: Masculino
   - Observações: Aluno dedicado e participativo nas atividades de leitura.

2. **Ana Clara**
   - Matrícula: 2024002
   - Idade: 11 anos
   - Gênero: Feminino
   - Observações: Excelente progresso em atividades de escrita criativa.

3. **Júlia**
   - Matrícula: 2024003
   - Idade: 11 anos
   - Gênero: Feminino
   - Observações: Necessita atenção especial com sílabas complexas.

4. **Manuela Oliveira**
   - Matrícula: 2024004
   - Idade: 10 anos
   - Gênero: Feminino
   - Observações: Bom desempenho em atividades de leitura.

5. **Pedro Santos**
   - Matrícula: 2024005
   - Idade: 12 anos
   - Gênero: Masculino
   - Observações: Requer reforço em atividades de escrita.

6. **Beatriz Lima**
   - Matrícula: 2024006
   - Idade: 11 anos
   - Gênero: Feminino
   - Observações: Pronta para atividades de nível avançado.

### Atividades Criadas pelo Seeder

O seeder de atividades cria automaticamente 6 atividades para cada profissional que possui alunos cadastrados:

1. **Leitura de palavras com R**
   - Tipo: Leitura
   - Dificuldade: Fácil
   - Status: Concluída
   - Alunos: 3 alunos vinculados

2. **Leitura de frases simples**
   - Tipo: Leitura
   - Dificuldade: Médio
   - Status: Em andamento
   - Alunos: 2 alunos vinculados

3. **Escrita de palavras com sílabas complexas**
   - Tipo: Escrita
   - Dificuldade: Médio
   - Status: Pendente
   - Alunos: 3 alunos vinculados

4. **Leitura de texto narrativo**
   - Tipo: Leitura
   - Dificuldade: Difícil
   - Status: Pendente
   - Alunos: 3 alunos vinculados

5. **Produção de texto criativo**
   - Tipo: Escrita
   - Dificuldade: Difícil
   - Status: Pendente
   - Alunos: 2 alunos vinculados

6. **Leitura de palavras com L**
   - Tipo: Leitura
   - Dificuldade: Fácil
   - Status: Concluída
   - Alunos: 2 alunos vinculados

**Nota:** As atividades são criadas apenas para profissionais que possuem alunos cadastrados. Cada atividade é vinculada aos alunos através da tabela `student_activities`.

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
- **Usuário:** letraria_user
- **Senha:** letraria_password

## Comandos Úteis

### Parar os Serviços

```DOC/README.md#L201-220
docker-compose -f docker-compose.dev.yml down
```

### Parar e Remover Volumes (apaga dados do banco)

```DOC/README.md#L221-240
docker-compose -f docker-compose.dev.yml down -v
```

### Ver Logs dos Serviços

```DOC/README.md#L241-260
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

```DOC/README.md#L261-280
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend
docker-compose -f docker-compose.dev.yml restart db
```

### Criar Nova Migration

```DOC/README.md#L281-300
docker exec letraria-backend-dev alembic revision --autogenerate -m "Nome da migration"
```

### Verificar Estado das Migrations

```DOC/README.md#L301-320
docker exec letraria-backend-dev alembic current
docker exec letraria-backend-dev alembic history
```

### Reexecutar Seeder (limpar usuários antes)

Para reexecutar o seeder, primeiro é necessário limpar os usuários do banco:

```DOC/README.md#L321-340
# Conectar ao banco e remover usuários
docker exec -it letraria-db-dev-new psql -U letraria_user -d letraria_db -c "DELETE FROM users;"

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

## Troubleshooting Rápido

- Extensão `pg_trgm` não existe: execute o comando de criação da extensão no container do banco conforme indicado na seção 2.1.
- `alembic revision --autogenerate` não detecta mudanças: confirme que os models são importados e registrados no `alembic/env.py`, e que a `DATABASE_URL` do container backend aponta para o serviço do banco.
- Permissão negada no Postgres: verifique usuário e privilégios; usar o usuário criado pelas variáveis de ambiente do `docker-compose` (ou `postgres` se necessário).
- Se o container do banco não subir, verifique volumes e logs:
```DOC/README.md#L341-360
docker logs letraria-db-dev-new -f
```
