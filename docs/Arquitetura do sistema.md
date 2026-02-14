# Arquitetura do Sistema Letrar IA

## Sumário

- [Visão Geral](#visão-geral)
- [Arquitetura Geral](#arquitetura-geral)
- [Backend](#backend)
- [Frontend](#frontend)
- [Banco de Dados](#banco-de-dados)
- [Integração com IA](#integração-com-ia)
- [Fluxos Principais](#fluxos-principais)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Etapas de Desenvolvimento](#etapas-de-desenvolvimento)

---

## Visão Geral

O **Letrar IA** é uma plataforma de alfabetização inteligente que utiliza Inteligência Artificial para análise de leitura, acompanhamento pedagógico e geração de insights personalizados. O sistema permite que profissionais da educação cadastrem alunos, criem trilhas de leitura, realizem gravações de áudio e recebam análises automáticas com recomendações pedagógicas.

### Objetivos do Sistema

- Facilitar o acompanhamento do progresso de alunos em alfabetização
- Fornecer análises automáticas de leitura através de IA
- Gerar insights pedagógicos personalizados
- Criar trilhas de aprendizado adaptadas ao perfil do aluno
- Produzir relatórios detalhados para profissionais da educação

---

## Arquitetura Geral

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React + Vite + TypeScript)                  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Páginas    │  │ Componentes  │  │   Hooks      │          │
│  │              │  │   Reutiliz.  │  │  Customizados │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                  │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  Services API   │                           │
│                    │   (HTTP/REST)   │                           │
│                    └───────┬─────────┘                           │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ HTTP/REST (JWT Auth)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                         BACKEND                                   │
│                    (FastAPI + Python)                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routes                             │   │
│  │  (auth, students, activities, recordings, diagnostics...)  │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │                    Services Layer                          │   │
│  │  (Lógica de Negócio: Auth, Recording, AI Insights...)     │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │                 Repositories Layer                         │   │
│  │  (Acesso a Dados: User, Student, Recording...)             │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                           │
│  ┌────────────────────▼─────────────────────────────────────┐   │
│  │                    Models (SQLAlchemy)                     │   │
│  │  (Entidades: User, Student, Trail, Recording...)          │   │
│  └────────────────────┬─────────────────────────────────────┘   │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ SQLAlchemy ORM (Async)
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                    BANCO DE DADOS                                 │
│                    (PostgreSQL 15+)                              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Users     │  │   Students   │  │  Recordings  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Trails    │  │  Activities  │  │ Diagnostics  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Reports    │  │ AI Insights  │  │   Progress   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└───────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SERVIÇOS EXTERNOS DE IA                      │
│                                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │   Whisper (Local)        │  │   Google Gemini API      │    │
│  │   Transcrição de Áudio   │  │   Geração de Insights    │    │
│  └──────────────────────────┘  └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Padrão Arquitetural

O sistema utiliza uma **Arquitetura em Camadas (Layered Architecture)** com os seguintes princípios:

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade única e bem definida
2. **Dependency Injection**: Dependências são injetadas através do FastAPI
3. **Repository Pattern**: Abstração do acesso a dados
4. **Service Layer Pattern**: Lógica de negócio isolada das rotas
5. **Async/Await**: Operações assíncronas para melhor performance

---

## Backend

### Tecnologias Principais

- **FastAPI 0.104.1**: Framework web assíncrono de alto desempenho
- **SQLAlchemy 2.0.23**: ORM com suporte completo a async
- **Alembic 1.12.1**: Gerenciamento de migrations do banco de dados
- **Pydantic V2**: Validação de dados e configurações
- **python-jose**: Geração e validação de tokens JWT
- **bcrypt**: Criptografia de senhas
- **asyncpg**: Driver PostgreSQL assíncrono

### Estrutura de Camadas

#### 1. Camada de Apresentação (API Routes)

Localização: `app/api/routes/`

Responsabilidades:
- Receber requisições HTTP
- Validar dados de entrada com Schemas Pydantic
- Chamar serviços apropriados
- Retornar respostas HTTP formatadas

Rotas Principais:
- `/auth` - Autenticação e autorização
- `/professionals` - Gerenciamento de profissionais
- `/students` - Gerenciamento de alunos
- `/activities` - Gerenciamento de atividades
- `/trails` - Gerenciamento de trilhas de leitura
- `/recording` - Upload e processamento de gravações
- `/transcription` - Transcrição de áudio
- `/ai_insights` - Insights gerados por IA
- `/diagnostics` - Diagnósticos de alunos
- `/reports` - Relatórios pedagógicos
- `/student_activities` - Atividades dos alunos

#### 2. Camada de Lógica de Negócio (Services)

Localização: `app/services/`

Responsabilidades:
- Implementar regras de negócio
- Orquestrar operações entre repositories
- Processar dados antes de persistir
- Integrar com serviços externos (IA, transcrição)

Serviços Principais:
- `auth_service.py` - Autenticação e geração de tokens
- `recording_service.py` - Processamento de gravações
- `whisper_service.py` - Transcrição de áudio com Whisper
- `genai/service.py` - Geração de insights com Google Gemini
- `ai_insight_service.py` - Gerenciamento de insights
- `diagnostic_service.py` - Lógica de diagnósticos
- `report_service.py` - Geração de relatórios

#### 3. Camada de Acesso a Dados (Repositories)

Localização: `app/repositories/`

Responsabilidades:
- Abstrair operações de banco de dados
- Executar queries SQLAlchemy
- Mapear resultados para models
- Gerenciar transações

Repositories Principais:
- `user_repository.py` - Operações com usuários
- `student_repository.py` - Operações com alunos
- `recording_repository.py` - Operações com gravações
- `trail_repository.py` - Operações com trilhas

#### 4. Camada de Dados (Models)

Localização: `app/models/`

Responsabilidades:
- Definir entidades do banco de dados
- Estabelecer relacionamentos entre entidades
- Configurar constraints e validações

Models Principais:
- `user.py` - Usuários (admin, professional)
- `student.py` - Alunos
- `trail.py` - Trilhas de leitura
- `recording.py` - Gravações de áudio
- `activity.py` - Atividades pedagógicas
- `diagnostic.py` - Diagnósticos
- `report.py` - Relatórios
- `ai_insight.py` - Insights de IA

### Autenticação e Autorização

#### Fluxo de Autenticação

1. **Login**: Cliente envia email e senha
2. **Validação**: Service verifica credenciais no banco
3. **Geração de Tokens**: Sistema gera access_token e refresh_token
4. **Resposta**: Tokens são retornados ao cliente

#### Tokens JWT

- **Access Token**: Expira em 30 minutos (configurável)
- **Refresh Token**: Expira em 7 dias (configurável)
- **Algoritmo**: HS256
- **Payload**: user_id, email, role

#### Middleware de Autenticação

- `get_current_user`: Valida token e retorna usuário
- `get_current_active_user`: Verifica se usuário está ativo
- `get_current_admin`: Verifica se usuário é admin

### Configuração

Arquivo: `app/config.py`

Principais configurações:
- `database_url`: URL de conexão com PostgreSQL
- `secret_key`: Chave secreta para JWT
- `cors_origins`: Origens permitidas para CORS
- `google_genai_api_key`: Chave da API do Google Gemini
- `whisper_model_size`: Tamanho do modelo Whisper (base, small, medium, large)

---

## Frontend

### Tecnologias Principais

- **React 18.3.1**: Biblioteca para construção de interfaces
- **Vite 6.3.5**: Build tool e dev server
- **TypeScript**: Tipagem estática
- **React Router DOM 7.9.6**: Roteamento
- **React Hook Form 7.55.0**: Gerenciamento de formulários
- **Shadcn/ui**: Componentes UI baseados em Radix UI
- **Tailwind CSS**: Estilização
- **Recharts 2.15.2**: Gráficos e visualizações

### Estrutura de Componentes

#### Organização por Features

```
src/
├── components/
│   ├── ui/                    # Componentes base (Shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── card.tsx
│   │   └── ...
│   │
│   └── features/               # Componentes por feature
│       ├── auth/
│       │   └── LoginPage.tsx
│       ├── students/
│       │   ├── StudentList.tsx
│       │   ├── StudentCard.tsx
│       │   └── AddStudentDialog.tsx
│       ├── activities/
│       ├── diagnostics/
│       ├── reading/
│       ├── reports/
│       └── trails/
│
├── pages/                      # Páginas principais
│   ├── AdminDashboard.tsx
│   └── ProfessionalHome.tsx
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts
│   ├── useStudents.ts
│   ├── useActivities.ts
│   └── index.ts
│
├── services/                   # Serviços de API
│   └── api.ts
│
├── utils/                      # Utilitários
│   ├── validation.ts
│   ├── format.ts
│   ├── constants.ts
│   └── helpers.ts
│
├── types/                      # Tipos TypeScript
│   └── index.ts
│
└── routes/                     # Configuração de rotas
    └── routes.tsx
```

### Rotas e Navegação

#### Estrutura de Rotas

- `/` - Redireciona para login
- `/login` - Página de autenticação
- `/admin` - Dashboard administrativo (protegida)
- `/professional` - Home do profissional (protegida)

#### Proteção de Rotas

- `ProtectedRoute`: Componente que verifica autenticação
- `requiredRole`: Propriedade para verificar role específica
- Redirecionamento automático para login se não autenticado

### Gerenciamento de Estado

#### Context API

- `AuthContext`: Gerencia estado de autenticação
- `UserContext`: Informações do usuário logado

#### Custom Hooks

- `useAuth`: Hook para autenticação (login, logout, currentUser)
- `useStudents`: Hook para gerenciar alunos
- `useActivities`: Hook para gerenciar atividades

### Integração com Backend

#### Service de API

Arquivo: `src/services/api.ts`

Funcionalidades:
- Configuração base do axios/fetch
- Interceptors para adicionar tokens JWT
- Tratamento de erros centralizado
- Refresh automático de tokens

#### Endpoints Principais

- `POST /auth/login` - Autenticação
- `POST /auth/refresh` - Renovar token
- `GET /students` - Listar alunos
- `POST /students` - Criar aluno
- `POST /recording` - Upload de gravação
- `GET /ai_insights` - Listar insights

---

## Banco de Dados

### Tecnologia

- **PostgreSQL 15+**: SGBD relacional
- **Extensões**:
  - `uuid-ossp`: Geração de UUIDs
  - `pg_trgm`: Busca full-text
  - `btree_gin`: Índices compostos

### Modelo de Dados

#### Entidades Principais

1. **Users** (Usuários)
   - Professores e administradores
   - Campos: id, email, password_hash, name, role, created_at

2. **Students** (Alunos)
   - Dados dos alunos cadastrados
   - Campos: id, professional_id, name, registration, age, birth_date, gender, special_needs, status

3. **Trails** (Trilhas de Leitura)
   - Trilhas pedagógicas personalizadas
   - Campos: id, title, description, difficulty, age_range_min, age_range_max, is_default

4. **TrailStories** (Histórias das Trilhas)
   - Histórias que compõem as trilhas
   - Campos: id, trail_id, title, content, letters_focus, phonemes_focus, order_position

5. **Recordings** (Gravações)
   - Gravações de áudio dos alunos
   - Campos: id, student_id, story_id, audio_file_path, duration_seconds, transcription, status

6. **RecordingAnalysis** (Análises de Gravação)
   - Métricas calculadas das gravações
   - Campos: id, recording_id, fluency_score, prosody_score, speed_wpm, accuracy_score, overall_score

7. **Activities** (Atividades)
   - Atividades pedagógicas
   - Campos: id, title, description, activity_type, difficulty, status

8. **StudentActivities** (Atividades dos Alunos)
   - Relacionamento entre alunos e atividades
   - Campos: id, student_id, activity_id, status, completed_at

9. **Diagnostics** (Diagnósticos)
   - Diagnósticos realizados nos alunos
   - Campos: id, student_id, conducted_by, diagnostic_type, overall_score, reading_level

10. **Reports** (Relatórios)
    - Relatórios pedagógicos gerados
    - Campos: id, student_id, generated_by, report_type, content

11. **AIInsights** (Insights de IA)
    - Insights gerados pelo Google Gemini
    - Campos: id, student_id, recording_id, type, priority, title, description

12. **StudentTrailProgress** (Progresso em Trilhas)
    - Acompanhamento do progresso dos alunos
    - Campos: id, student_id, trail_id, current_story_id, progress_percentage

13. **TextLibrary** (Biblioteca de Textos)
    - Textos disponíveis para atividades
    - Campos: id, title, content, difficulty, tags

### Relacionamentos

- **Users 1:N Students**: Um profissional gerencia N alunos
- **Users 1:N Trails**: Um profissional cria N trilhas
- **Students 1:N Recordings**: Um aluno faz N gravações
- **Trails 1:N TrailStories**: Uma trilha contém N histórias
- **Recordings 1:1 RecordingAnalysis**: Uma gravação tem uma análise
- **Students N:M Activities**: N alunos participam de M atividades
- **Students 1:N Diagnostics**: Um aluno possui N diagnósticos
- **Students 1:N AIInsights**: Um aluno recebe N insights

### Migrations

Ferramenta: **Alembic**

Localização: `alembic/versions/`

Comandos:
- `alembic revision --autogenerate -m "descrição"`: Criar nova migration
- `alembic upgrade head`: Aplicar migrations pendentes
- `alembic downgrade -1`: Reverter última migration
- `alembic current`: Ver migration atual
- `alembic history`: Ver histórico de migrations

---

## Integração com IA

### Serviços de IA Utilizados

#### 1. Whisper (Transcrição de Áudio)

**Tipo**: Modelo local (OpenAI Whisper)

**Responsabilidades**:
- Transcrever gravações de áudio para texto
- Suportar múltiplos idiomas (configurado para português)
- Processar arquivos de áudio em diversos formatos

**Implementação**:
- Localização: `app/services/whisper_service.py`
- Modelo padrão: `base` (configurável: tiny, base, small, medium, large)
- Cache de modelo: Modelo é carregado uma vez e reutilizado
- Processamento: Assíncrono para não bloquear requisições

**Fluxo**:
1. Upload de áudio via `/recording`
2. Arquivo salvo em `uploads/recordings/`
3. WhisperService processa o áudio
4. Transcrição salva no campo `transcription` da gravação

#### 2. Google Gemini (Geração de Insights)

**Tipo**: API Externa (Google AI Studio)

**Responsabilidades**:
- Gerar insights pedagógicos personalizados
- Analisar contexto do aluno (histórico, diagnósticos, métricas)
- Fornecer recomendações práticas para profissionais

**Implementação**:
- Localização: `app/services/genai/service.py`
- Modelo: `gemini-2.5-flash` (configurável)
- Região: `us-central1` (configurável)

**Fluxo de Geração de Insights**:

1. **Trigger**: Após análise de gravação ser concluída
2. **Coleta de Contexto**:
   - Dados do aluno (nome, idade, necessidades especiais)
   - Última gravação e suas métricas
   - Histórico de gravações anteriores
   - Diagnósticos anteriores
   - Insights anteriores
3. **Construção do Prompt**:
   - Contexto formatado em texto estruturado
   - Instruções específicas para o modelo
   - Formato de resposta esperado (JSON)
4. **Chamada à API**:
   - Envio do prompt para Google Gemini
   - Recebimento da resposta
   - Extração e validação do JSON
5. **Persistência**:
   - Insight salvo na tabela `ai_insights`
   - Vinculado ao aluno e à gravação
   - Disponibilizado na interface

**Estrutura do Insight**:
```json
{
  "type": "progress|attention_needed|suggestion",
  "priority": "low|medium|high",
  "title": "Título curto do insight",
  "description": "Descrição detalhada com orientação prática"
}
```

### Análise de Gravações

#### Métricas Calculadas

Após a transcrição, o sistema calcula automaticamente:

1. **Fluency Score** (0-100): Fluência na leitura
2. **Prosody Score** (0-100): Entonação e ritmo
3. **Speed WPM**: Palavras por minuto
4. **Accuracy Score** (0-100): Precisão na leitura
5. **Overall Score** (0-100): Pontuação geral

#### Processamento

Localização: `app/services/recording_service.py`

Etapas:
1. Upload e salvamento do áudio
2. Transcrição com Whisper
3. Comparação com texto original (se disponível)
4. Cálculo de métricas
5. Detecção de erros e pausas
6. Geração de insight com Gemini
7. Persistência de todos os dados

---

## Fluxos Principais

### 1. Fluxo de Autenticação

```
Cliente → POST /auth/login {email, password}
    ↓
Route (auth.py) → Valida entrada com LoginRequest
    ↓
AuthService → Busca usuário no banco
    ↓
AuthService → Verifica senha com bcrypt
    ↓
AuthService → Gera access_token e refresh_token
    ↓
Cliente ← Retorna tokens e dados do usuário
```

### 2. Fluxo de Upload e Análise de Gravação

```
Cliente → POST /recording (multipart/form-data)
    ↓
Route (recording.py) → Valida autenticação
    ↓
RecordingService → Salva arquivo de áudio
    ↓
RecordingService → Cria registro de Recording
    ↓
WhisperService → Transcreve áudio para texto
    ↓
RecordingService → Calcula métricas (fluency, accuracy, etc)
    ↓
RecordingService → Cria RecordingAnalysis
    ↓
GeminiService → Gera insight pedagógico
    ↓
AIInsightService → Salva insight no banco
    ↓
Cliente ← Retorna gravação com análise completa
```

### 3. Fluxo de Criação de Aluno

```
Cliente → POST /students {dados do aluno}
    ↓
Route (students.py) → Valida entrada e autenticação
    ↓
StudentService → Valida regras de negócio
    ↓
StudentRepository → Insere aluno no banco
    ↓
Cliente ← Retorna aluno criado
```

### 4. Fluxo de Geração de Relatório

```
Cliente → POST /reports {student_id, report_type}
    ↓
Route (reports.py) → Valida autenticação
    ↓
ReportService → Coleta dados do aluno
    ↓
ReportService → Gera conteúdo do relatório
    ↓
ReportRepository → Salva relatório
    ↓
Cliente ← Retorna relatório gerado
```

---

## Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Python | 3.11+ | Linguagem principal |
| FastAPI | 0.104.1 | Framework web |
| SQLAlchemy | 2.0.23 | ORM |
| Alembic | 1.12.1 | Migrations |
| Pydantic | 2.5.0 | Validação |
| python-jose | 3.3.0 | JWT |
| bcrypt | 4.1.2 | Hash de senhas |
| asyncpg | 0.29.0 | Driver PostgreSQL |
| openai-whisper | latest | Transcrição |
| google-genai | latest | Insights IA |

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.3.1 | Biblioteca UI |
| TypeScript | latest | Tipagem |
| Vite | 6.3.5 | Build tool |
| React Router | 7.9.6 | Roteamento |
| React Hook Form | 7.55.0 | Formulários |
| Shadcn/ui | latest | Componentes UI |
| Tailwind CSS | latest | Estilização |
| Recharts | 2.15.2 | Gráficos |

### Banco de Dados

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| PostgreSQL | 15+ | SGBD |

### DevOps

| Tecnologia | Uso |
|------------|-----|
| Docker | Containerização |
| Docker Compose | Orquestração |
| Alembic | Migrations |

---

## Estrutura de Diretórios

### Backend

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # Entry point FastAPI
│   ├── config.py                 # Configurações
│   ├── database.py               # Engine SQLAlchemy
│   │
│   ├── api/                      # Camada de Apresentação
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── professionals.py
│   │       ├── students.py
│   │       ├── activities.py
│   │       ├── trails.py
│   │       ├── recording.py
│   │       ├── transcription.py
│   │       ├── ai_insights.py
│   │       ├── diagnostics.py
│   │       ├── reports.py
│   │       └── student_activities.py
│   │
│   ├── models/                   # Camada de Dados
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── trail.py
│   │   ├── recording.py
│   │   ├── activity.py
│   │   ├── diagnostic.py
│   │   ├── report.py
│   │   ├── ai_insight.py
│   │   ├── progress.py
│   │   └── text_library.py
│   │
│   ├── schemas/                  # DTOs (Pydantic)
│   │   ├── auth.py
│   │   ├── student.py
│   │   ├── activity.py
│   │   └── ...
│   │
│   ├── services/                 # Camada de Lógica de Negócio
│   │   ├── auth_service.py
│   │   ├── recording_service.py
│   │   ├── whisper_service.py
│   │   ├── genai/
│   │   │   └── service.py
│   │   ├── ai_insight_service.py
│   │   ├── diagnostic_service.py
│   │   └── report_service.py
│   │
│   ├── repositories/             # Camada de Acesso a Dados
│   │   ├── user_repository.py
│   │   ├── student_repository.py
│   │   ├── recording_repository.py
│   │   └── ...
│   │
│   └── utils/                    # Utilitários
│       ├── dependencies.py       # Dependencies FastAPI
│       ├── jwt.py                # Funções JWT
│       └── password.py           # Hash de senhas
│
├── alembic/                      # Migrations
│   ├── versions/
│   └── env.py
│
├── seeds/                        # Seeders
│   ├── seed_users.py
│   ├── seed_students.py
│   └── seed_activities.py
│
├── uploads/                      # Arquivos uploadados
│   └── recordings/
│
├── tests/                        # Testes
├── requirements.txt              # Dependências
├── Dockerfile                    # Docker backend
├── env.example                   # Exemplo de .env
└── README.md
```

### Frontend

```
Código protótipo/
├── src/
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   └── features/             # Componentes por feature
│   │       ├── auth/
│   │       ├── students/
│   │       ├── activities/
│   │       ├── diagnostics/
│   │       ├── reading/
│   │       ├── reports/
│   │       └── trails/
│   │
│   ├── pages/                    # Páginas principais
│   │   ├── AdminDashboard.tsx
│   │   └── ProfessionalHome.tsx
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useStudents.ts
│   │   └── index.ts
│   │
│   ├── services/                 # Serviços de API
│   │   └── api.ts
│   │
│   ├── utils/                    # Utilitários
│   │   ├── validation.ts
│   │   ├── format.ts
│   │   └── constants.ts
│   │
│   ├── types/                    # Tipos TypeScript
│   │   └── index.ts
│   │
│   ├── routes/                   # Rotas
│   │   └── routes.tsx
│   │
│   └── styles/                   # Estilos
│       └── globals.css
│
├── public/                       # Arquivos estáticos
├── package.json
├── vite.config.ts
├── Dockerfile.dev
└── README.md
```

---

## Etapas de Desenvolvimento

### Fase 1: Configuração Inicial

1. **Setup do Ambiente**
   - Instalação de dependências (Python, Node.js, Docker)
   - Configuração do PostgreSQL
   - Criação de variáveis de ambiente

2. **Estrutura Base do Backend**
   - Configuração do FastAPI
   - Setup do SQLAlchemy com async
   - Configuração do Alembic
   - Estrutura de pastas (models, services, repositories, routes)

3. **Estrutura Base do Frontend**
   - Setup do Vite + React + TypeScript
   - Configuração do React Router
   - Estrutura de componentes
   - Setup do Tailwind CSS e Shadcn/ui

### Fase 2: Autenticação e Autorização

1. **Backend**
   - Model User com roles (admin, professional)
   - Repository de usuários
   - Service de autenticação
   - Rotas de login e refresh token
   - Middleware de autenticação
   - Dependencies para verificação de roles

2. **Frontend**
   - Página de login
   - Context de autenticação
   - Hook useAuth
   - Service de API com interceptors
   - Proteção de rotas

### Fase 3: Gerenciamento de Usuários e Alunos

1. **Backend**
   - Model Student
   - Repository de alunos
   - Service de alunos
   - Rotas CRUD de alunos
   - Rotas de profissionais

2. **Frontend**
   - Lista de alunos
   - Formulário de cadastro/edição
   - Perfil do aluno
   - Dashboard do profissional

### Fase 4: Trilhas e Histórias

1. **Backend**
   - Models Trail e TrailStories
   - Repositories de trilhas
   - Services de trilhas
   - Rotas de trilhas e histórias

2. **Frontend**
   - Lista de trilhas
   - Visualização de histórias
   - Criação de trilhas personalizadas

### Fase 5: Gravações e Transcrição

1. **Backend**
   - Model Recording
   - Integração com Whisper
   - Service de gravações
   - Upload de arquivos
   - Rotas de gravações

2. **Frontend**
   - Interface de gravação
   - Player de áudio
   - Lista de gravações
   - Visualização de transcrições

### Fase 6: Análise e Métricas

1. **Backend**
   - Model RecordingAnalysis
   - Cálculo de métricas (fluency, accuracy, speed)
   - Service de análise
   - Rotas de análises

2. **Frontend**
   - Visualização de métricas
   - Gráficos de progresso
   - Comparação entre gravações

### Fase 7: Integração com IA (Gemini)

1. **Backend**
   - Model AIInsight
   - Service Gemini
   - Geração de insights
   - RAG (Retrieval Augmented Generation)
   - Rotas de insights

2. **Frontend**
   - Exibição de insights
   - Filtros por tipo e prioridade
   - Histórico de insights

### Fase 8: Diagnósticos

1. **Backend**
   - Model Diagnostic
   - Service de diagnósticos
   - Rotas de diagnósticos

2. **Frontend**
   - Formulário de diagnóstico
   - Visualização de resultados
   - Histórico de diagnósticos

### Fase 9: Atividades

1. **Backend**
   - Models Activity e StudentActivity
   - Repositories e services
   - Rotas de atividades

2. **Frontend**
   - Criação de atividades
   - Atribuição a alunos
   - Acompanhamento de status

### Fase 10: Relatórios

1. **Backend**
   - Model Report
   - Service de relatórios
   - Geração de relatórios
   - Rotas de relatórios

2. **Frontend**
   - Visualização de relatórios
   - Exportação (PDF, CSV)
   - Analytics e gráficos

### Fase 11: Progresso e Acompanhamento

1. **Backend**
   - Model StudentTrailProgress
   - Service de progresso
   - Cálculo de percentual
   - Rotas de progresso

2. **Frontend**
   - Visualização de progresso
   - Gráficos de evolução
   - Histórico de trilhas

### Fase 12: Biblioteca de Textos

1. **Backend**
   - Model TextLibrary
   - Repository e service
   - Rotas de textos

2. **Frontend**
   - Biblioteca de textos
   - Busca e filtros
   - Visualização de textos

### Fase 13: Refinamentos e Otimizações

1. **Performance**
   - Otimização de queries
   - Cache de modelos Whisper
   - Lazy loading no frontend

2. **Segurança**
   - Validação de inputs
   - Sanitização de dados
   - Rate limiting
   - CORS configurado

3. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes E2E

4. **Documentação**
   - Documentação da API (Swagger)
   - Documentação de código
   - Guias de uso

---

## Considerações Finais

### Princípios de Design Aplicados

- **SOLID**: Separação de responsabilidades, inversão de dependências
- **DRY**: Evitar repetição de código
- **Clean Architecture**: Camadas bem definidas
- **Async First**: Operações assíncronas para melhor performance
- **Type Safety**: TypeScript no frontend, Pydantic no backend

### Escalabilidade

- Arquitetura preparada para crescimento
- Separação de concerns facilita manutenção
- Uso de async permite alta concorrência
- Banco de dados normalizado e otimizado

### Segurança

- Autenticação JWT
- Senhas hasheadas com bcrypt
- Validação de inputs em todas as camadas
- CORS configurado
- Soft delete para preservar histórico

### Manutenibilidade

- Código modular e bem organizado
- Padrões consistentes
- Documentação inline
- Migrations versionadas
- Testes automatizados

---

**Última atualização**: Novembro 2025

