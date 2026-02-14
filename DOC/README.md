# Protótipos

Grupo 4 : https://lovable.dev/projects/53a874af-4b34-4642-9650-1aa87a038300

Grupo 2 : https://www.figma.com/design/HD1vK6dSyNRxFuPE80wTmp/Prot%C3%B3tipos-de-tela---Hist%C3%B3rias-de-usu%C3%A1rio?node-id=0-1&p=f&t=NPTbITXMapNmKEhC-0

---

# Letrar IA - Guia de Instalação e Execução

## Visão Geral

O projeto possui dois serviços principais:
- **Backend** (FastAPI + PostgreSQL) disponível em `http://localhost:8888`
- **Frontend** (React/Vite) disponível em `http://localhost:5174`

A aplicação utiliza transcrição automática (Whisper) e geração de insights via **Google Gemini**. Após gravar e transcrever um áudio, as métricas são calculadas automaticamente e um insight é persistido no banco e exibido na interface.

## Pré-requisitos

- Git instalado
- Docker Engine 24+ e Docker Compose Plugin
- Python 3.11 ou 3.12 com `pip`
- Node.js 18 ou superior com `npm`
- `ffmpeg` instalado no sistema (requisito do Whisper). Em distribuições Debian/Ubuntu: `sudo apt-get install ffmpeg`
- Conta no Google AI Studio com acesso ao modelo Gemini e chave ativa

## 1. Clonar o repositório

```bash
git clone git@github.com:castromir/DesignSoftwareLetrarIA.git
cd DesignSoftwareLetrarIA/DOC
```

## 2. Configurar variáveis de ambiente

### Backend (`DOC/backend/.env`)

1. Copie o modelo:
   ```bash
   cd backend
   cp env.example .env
   ```
2. Ajuste os campos obrigatórios no arquivo `.env`:
   - `DATABASE_URL`: URL do PostgreSQL. O valor padrão do exemplo funciona com o banco do Docker (`postgresql+asyncpg://letraria_user:letraria_password@localhost:55432/letraria_db`).
   - `SECRET_KEY`: gere uma chave segura (`openssl rand -hex 32`) e substitua o valor.
   - `CORS_ORIGINS`: inclua as origens utilizadas no frontend (ex.: `["http://localhost:5174"]`).
   - `ENVIRONMENT=development` e `DEBUG=true` para desenvolvimento local.
   - `OPENAI_API_KEY`: opcional se for utilizar a API oficial da OpenAI; o projeto usa Whisper local, mas a variável é lida.
   - `GOOGLE_GENAI_API_KEY`: chave gerada no Google AI Studio (obrigatória para geração automática de insights).
   - `GOOGLE_GENAI_MODEL=gemini-2.5-flash` (este modelo está homologado no projeto).
   - `GOOGLE_GENAI_LOCATION=us-central1` (região recomendada para o modelo).
3. Volte para a pasta raiz:
   ```bash
   cd ..
   ```

### Frontend (`DOC/Código protótipo/.env.local`)

1. Crie o arquivo de ambiente:
   ```bash
   cd "Código protótipo"
   echo "VITE_API_URL=http://localhost:8888" > .env.local
   cd ..
   ```
2. Ajuste a URL caso execute o backend em outro host ou porta.

## 3. Executar com Docker (recomendado)

1. Subir banco, backend e frontend:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```
   - PostgreSQL disponível na porta **55432**
   - Backend FastAPI na porta **8888**
   - Frontend Vite na porta **5174**
2. Aplicar migrations:
   ```bash
   docker exec letraria-backend-dev alembic upgrade head
   ```
3. Popular dados iniciais:
   ```bash
   docker exec letraria-backend-dev python /app/run_seed.py
   ```
   O seed cria usuários profissionais, alunos, trilhas e atividades para testes.
4. Confirmar status:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```
   Todos os serviços devem exibir `Up`.

## 4. Executar localmente sem Docker (opcional)

### Banco de dados

- Utilize o PostgreSQL do Docker compondo apenas o serviço de banco:
  ```bash
  docker compose -f docker-compose.dev.yml up -d db
  ```
  ou configure um PostgreSQL local com as credenciais do `.env`.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python run_seed.py              # opcional, popula dados de teste
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
```

Certifique-se de que a pasta `uploads/recordings` seja gravável; ela é criada automaticamente ao iniciar o serviço.

### Frontend

```bash
cd "Código protótipo"
npm install
npm run dev -- --host --port 5174
```

O frontend irá ler `VITE_API_URL` para apontar para o backend.

## 5. Verificar funcionamento

1. Acesse `http://localhost:5174` e faça login com um dos profissionais criados pelo seed (por exemplo, `professor@letraria.com` / `prof123`).
2. Grave uma leitura na tela de histórias. Após o envio:
   - O áudio é armazenado.
   - O Whisper realiza a transcrição automática (verifique a saída no terminal se for a primeira execução, pois o modelo será baixado).
   - O serviço de análise calcula métricas (acurácia, fluência, prosódia, PPM).
   - O Gemini gera um insight automaticamente usando RAG com diagnóstico, histórico e métricas; o conteúdo é salvo e exibido em “Insights da IA”.
3. Consulte os detalhes em `Gravações` → `Ver métricas` para confirmar duração correta, palavras com erro e pontos de melhoria da IA.

## 6. Integrações de IA e transcrição

- **Whisper local**: já incluído em `requirements.txt`. Exige `ffmpeg` instalado e baixa o modelo na primeira execução.
- **Google Gemini**:
  - Crie uma chave no [Google AI Studio](https://aistudio.google.com/) e copie para `GOOGLE_GENAI_API_KEY`.
  - Use o modelo `gemini-2.5-flash` e região `us-central1`.
  - O backend registra logs em caso de erro (`GeminiServiceError`); consulte o console do servidor para entender falhas de prompt, credenciais ou limites.
- **CORS**: ao rodar em desenvolvimento, o backend inclui automaticamente `http://localhost:5174` quando `ENVIRONMENT=development`. Ajuste `CORS_ORIGINS` se publicar em outro domínio.

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
```bash
docker exec letraria-backend-dev python /app/run_seed.py
```

### Executar Seeders Individuais
```bash
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
