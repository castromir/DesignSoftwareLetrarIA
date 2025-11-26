# Letrar IA - Apresentação do Projeto

## Sumário

1. [Introdução - Motivação e Problema](#1-introdução---motivação-e-problema)
2. [Organização / Estrutura do Repositório e Fluxo de Trabalho](#2-organização--estrutura-do-repositório-e-fluxo-de-trabalho)
3. [Design de Interface & Processo no Figma](#3-design-de-interface--processo-no-figma)
4. [Arquitetura & C4 Model](#4-arquitetura--c4-model)
5. [Tecnologias & Infraestrutura](#5-tecnologias--infraestrutura)
6. [Visão do Produto](#6-visão-do-produto)
7. [Modelos de IA, Dados e Avaliação](#7-modelos-de-ia-dados-e-avaliação)
8. [Conclusão - Desafios, Decisões e Aprendizados](#8-conclusão---desafios-decisões-e-aprendizados)

---

## 1. Introdução - Motivação e Problema

### O Problema

Professores de alfabetização enfrentam desafios significativos no acompanhamento individualizado do progresso de leitura de seus alunos. Em uma sala de aula típica com 25 alunos, é praticamente impossível:

- **Avaliar cada aluno individualmente** com frequência suficiente
- **Detectar dificuldades específicas** de forma precoce
- **Gerar relatórios detalhados** para coordenação pedagógica e famílias
- **Acompanhar métricas objetivas** de fluência, prosódia e velocidade de leitura
- **Personalizar intervenções pedagógicas** baseadas em dados concretos

### A Solução: Letrar IA

O **Letrar IA** é uma plataforma inteligente de alfabetização que utiliza Inteligência Artificial para:

- **Automatizar a análise de leitura** através de gravações de áudio
- **Gerar métricas objetivas** (fluência, prosódia, velocidade, acurácia)
- **Fornecer insights pedagógicos personalizados** via IA generativa
- **Criar trilhas de aprendizado adaptadas** ao perfil de cada aluno
- **Produzir relatórios automáticos** para compartilhamento

### Público-Alvo

#### Persona Principal: Professora Ana

- **Perfil**: Professora de língua portuguesa em escola pública
- **Contexto**: 25 alunos do 3º ano
- **Necessidade**: Identificar rapidamente alunos com dificuldades de leitura para planejar intervenções pedagógicas eficazes
- **Objetivo**: Acompanhar o progresso de forma personalizada e compartilhar resultados com coordenação e famílias

#### Outros Usuários

- **Coordenadores Pedagógicos**: Acompanhamento de múltiplas turmas e análise de dados agregados
- **Administradores**: Gestão de profissionais e visão geral da plataforma

### Casos de Uso Principais

#### HU1: Gravação e Análise Automática
> Como professora, quero usar a aplicação para gravar a leitura dos meus alunos e receber relatórios automáticos de fluência, prosódia e velocidade, para poder acompanhar o progresso e ajustar meu plano de ensino de forma personalizada.

**Fluxo**:
1. Professora seleciona aluno e história da trilha
2. Aluno realiza gravação de leitura
3. Sistema transcreve automaticamente (Whisper)
4. Sistema calcula métricas (fluência, prosódia, velocidade, acurácia)
5. IA gera insights pedagógicos (Gemini)
6. Professora visualiza resultados e recomendações

#### HU2: Identificação de Dificuldades
> Como professora, quero saber quantos alunos meus têm dificuldades com leitura, para poder avaliar a eficácia do meu método de alfabetização.

**Fluxo**:
1. Professora acessa dashboard com visão geral
2. Sistema exibe alunos com dificuldades identificadas
3. Professora visualiza métricas agregadas da turma
4. Sistema sugere intervenções baseadas em dados

#### HU3: Compartilhamento de Relatórios
> Como professora, quero receber métricas e sugestões de Inteligência Artificial com poucos cliques, para compartilhar facilmente com a coordenação e com as famílias.

**Fluxo**:
1. Professora gera relatório de aluno ou turma
2. Sistema compila métricas, insights e recomendações
3. Professora exporta relatório (PDF/CSV)
4. Professora compartilha com coordenação e famílias

### Quem Idealizou

**Equipe de Desenvolvimento**:
- **Grupo 4**: Caio Castro Miranda, Jaime Da Cruz Silva Junior, João Pedro de Brito Tomé, Nicole Liecheski
- **Grupo 2**: Amanda Soares Souza, Gabriel Mota da Silva Lobo, Marcello Ronald Jose da Silva, Matheus Augusto Ferreira Medeiros

**Disciplina**: Design de Software

**Papéis**:
- **Product Owner / Gerente de Projeto**: Caio Castro
- **UX Designers**: Amanda Soares, Marcello Ronald, Gabriel Mota
- **Desenvolvedores Frontend**: Matheus Augusto
- **Desenvolvedores Backend**: Nicole Liecheski, Jaime da Cruz
- **Desenvolvedor Full Stack**: Marcello Ronald

---

## 2. Organização / Estrutura do Repositório e Fluxo de Trabalho

### Estrutura do Repositório

```
DesignSoftwareLetrarIA/
├── DOC/                          # Documentação e código principal
│   ├── backend/                  # Backend FastAPI
│   │   ├── app/
│   │   │   ├── api/routes/       # Rotas da API
│   │   │   ├── models/           # Models SQLAlchemy
│   │   │   ├── services/         # Lógica de negócio
│   │   │   ├── repositories/    # Acesso a dados
│   │   │   ├── schemas/          # Schemas Pydantic
│   │   │   └── utils/            # Utilitários
│   │   ├── alembic/              # Migrations
│   │   ├── seeds/                # Seeders
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   │
│   ├── Código protótipo/         # Frontend React
│   │   ├── src/
│   │   │   ├── components/       # Componentes React
│   │   │   │   ├── ui/           # Componentes base (Shadcn/ui)
│   │   │   │   └── features/     # Componentes por feature
│   │   │   ├── pages/            # Páginas principais
│   │   │   ├── hooks/            # Custom Hooks
│   │   │   ├── services/         # Serviços de API
│   │   │   ├── utils/            # Utilitários
│   │   │   ├── types/            # Tipos TypeScript
│   │   │   └── routes/           # Configuração de rotas
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── diagramas/                # Diagramas PlantUML
│   ├── ARQUITETURA.md            # Documentação de arquitetura
│   ├── README.md                 # Guia de instalação
│   └── docker-compose.dev.yml    # Orquestração Docker
│
├── app/                          # (Estrutura adicional se houver)
├── docs/                         # Documentação adicional
└── README.md                     # README principal
```

### Convenções de Código

#### Backend (Python)

- **Estrutura**: Arquitetura em camadas (Routes → Services → Repositories → Models)
- **Nomenclatura**: 
  - Classes: `PascalCase` (ex: `RecordingService`)
  - Funções/Variáveis: `snake_case` (ex: `create_recording`)
  - Constantes: `UPPER_SNAKE_CASE`
- **Padrões**: 
  - Repository Pattern para acesso a dados
  - Service Layer para lógica de negócio
  - Dependency Injection via FastAPI

#### Frontend (TypeScript/React)

- **Estrutura**: Organização por features
- **Nomenclatura**:
  - Componentes: `PascalCase` (ex: `StudentCard.tsx`)
  - Hooks: `camelCase` com prefixo `use` (ex: `useAuth.ts`)
  - Utilitários: `camelCase` (ex: `formatDate.ts`)
  - Pastas: `kebab-case` (ex: `student-profile/`)
- **Padrões**:
  - Componentes funcionais
  - Custom Hooks para lógica reutilizável
  - TypeScript para type safety

### Scripts Importantes

#### Backend

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar migrations
alembic upgrade head

# Criar nova migration
alembic revision --autogenerate -m "descrição"

# Popular banco com dados de teste
python run_seed.py

# Executar servidor de desenvolvimento
uvicorn app.main:app --reload --host 0.0.0.0 --port 8888
```

#### Frontend

```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev -- --host --port 5174

# Build para produção
npm run build
```

#### Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose -f docker-compose.dev.yml up -d

# Aplicar migrations
docker exec letraria-backend-dev alembic upgrade head

# Popular dados iniciais
docker exec letraria-backend-dev python /app/run_seed.py

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar serviços
docker-compose -f docker-compose.dev.yml down
```

### Variáveis de Ambiente Essenciais

#### Backend (`.env`)

```env
# Banco de Dados
DATABASE_URL=postgresql+asyncpg://letraria_user:letraria_password@localhost:55432/letraria_db

# Segurança
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:5174"]

# Ambiente
ENVIRONMENT=development
DEBUG=true

# IA
GOOGLE_GENAI_API_KEY=sua-chave-gemini-aqui
GOOGLE_GENAI_MODEL=gemini-2.5-flash
GOOGLE_GENAI_LOCATION=us-central1

# Whisper
WHISPER_MODEL_SIZE=base
```

#### Frontend (`.env.local`)

```env
VITE_API_URL=http://localhost:8888
```

### Fluxo de Trabalho (Kanban)

#### Fases do Projeto

1. **Planejamento**
   - Definição de histórias de usuário
   - Prototipação no Figma
   - Definição de arquitetura

2. **Desenvolvimento Backend**
   - Setup de infraestrutura (FastAPI, PostgreSQL)
   - Implementação de models e migrations
   - Desenvolvimento de services e repositories
   - Criação de rotas da API
   - Integração com serviços de IA

3. **Desenvolvimento Frontend**
   - Setup de projeto React/Vite
   - Implementação de componentes base
   - Desenvolvimento de páginas e features
   - Integração com API backend
   - Implementação de autenticação

4. **Integração e Testes**
   - Testes de integração end-to-end
   - Validação de fluxos de usuário
   - Correção de bugs
   - Otimizações de performance

5. **Deploy e Documentação**
   - Configuração de ambiente de produção
   - Documentação de API
   - Guias de uso
   - Apresentação final

---

## 3. Design de Interface & Processo no Figma

### Processo de Design

#### Etapa 1: Pesquisa e Definição

- **Análise de Personas**: Definição da Professora Ana como persona principal
- **Mapeamento de Jornadas**: Identificação de pontos de dor e oportunidades
- **Benchmarking**: Análise de soluções similares no mercado

#### Etapa 2: Wireframes e Prototipação Inicial

- **Wireframes de Baixa Fidelidade**: Estruturação básica das telas
- **Fluxos de Navegação**: Definição de caminhos do usuário
- **Validação com Stakeholders**: Feedback inicial da equipe

#### Etapa 3: Design de Alta Fidelidade

- **Design System**: Criação de componentes reutilizáveis
- **Paleta de Cores**: Definição de cores primárias e secundárias
- **Tipografia**: Escolha de fontes e hierarquia tipográfica
- **Componentes UI**: Desenvolvimento de biblioteca de componentes

#### Etapa 4: Iterações e Refinamentos

- **Testes de Usabilidade**: Validação com usuários reais
- **Feedback Loop**: Incorporação de sugestões
- **Ajustes de UX**: Melhorias baseadas em observações

### Links de Design

- **Design Final (Modelo Unificado)**: [Figma - Telas LetrarIA Rework](https://www.figma.com/design/UgWAqHUlgHgWXMakn3f9ZK/Telas---LetrarIA---Rework?node-id=0-1&p=f&t=FqZmQU83IoqiGDA4-0)
- **Protótipo Interativo**: [Figma Site](https://goblin-night-95766424.figma.site/)
- **Protótipos Anteriores**: Disponíveis em [DOC](https://github.com/castromir/DesignSoftwareLetrarIA/tree/main/DOC)

### Sistema de Design

#### Cores

**Paleta Principal**:
- **Primária**: Azul (#2563EB) - Ações principais, links
- **Secundária**: Amarelo (#F0B100) - Destaques, badges
- **Sucesso**: Verde (#10B981) - Feedback positivo
- **Erro**: Vermelho (#EF4444) - Alertas, erros
- **Neutros**: 
  - Cinza Escuro (#1F2937) - Textos principais
  - Cinza Médio (#6B7280) - Textos secundários
  - Cinza Claro (#F3F4F6) - Fundos

#### Tipografia

- **Fonte Principal**: Inter / System Font Stack
- **Tamanhos**:
  - H1: 30px / 36px line-height
  - H2: 24px / 30px line-height
  - H3: 20px / 24px line-height
  - Body: 16px / 24px line-height
  - Small: 14px / 20px line-height

#### Componentes Reutilizáveis

**Baseados em Shadcn/ui**:
- Button (variantes: default, outline, ghost, link)
- Input (text, email, password)
- Dialog / Modal
- Card
- Table
- Form (React Hook Form)
- Select / Dropdown
- Tabs
- Progress
- Badge
- Alert

**Componentes Customizados**:
- StudentCard
- ActivityCard
- RecordingPlayer
- MetricChart
- InsightCard
- TrailProgress

### Decisões de UX

#### 1. Navegação por Abas

**Decisão**: Utilizar abas para organizar diferentes seções (Alunos, Atividades, Trilhas, Relatórios)

**Justificativa**: 
- Facilita acesso rápido a diferentes funcionalidades
- Reduz carga cognitiva
- Mantém contexto do usuário

#### 2. Cards Visuais para Alunos

**Decisão**: Representar alunos através de cards com foto, nome e métricas principais

**Justificativa**:
- Visualização rápida do status de cada aluno
- Identificação fácil de alunos com dificuldades (cores indicativas)
- Acesso rápido ao perfil completo

#### 3. Player de Áudio Integrado

**Decisão**: Player de áudio inline nas listas de gravações

**Justificativa**:
- Permite escutar gravações sem sair da tela
- Facilita comparação entre gravações
- Melhora fluxo de trabalho do professor

#### 4. Gráficos de Progresso

**Decisão**: Visualização de progresso através de gráficos de linha e barras

**Justificativa**:
- Facilita identificação de tendências
- Comparação visual entre alunos
- Dados mais acessíveis para não-técnicos

### Testes de Usabilidade

#### Feedback Recebido

1. **Complexidade Inicial**: Usuários relataram dificuldade em encontrar funcionalidades
   - **Solução**: Simplificação do menu e adição de breadcrumbs

2. **Carga de Informação**: Dashboards muito densos
   - **Solução**: Implementação de filtros e visualizações progressivas

3. **Acessibilidade**: Contraste de cores insuficiente
   - **Solução**: Ajuste de paleta seguindo WCAG 2.1 AA

### Trade-offs de Design

#### Performance vs. Riqueza Visual

- **Decisão**: Priorizar performance, usando componentes leves
- **Consequência**: Menos animações complexas, mas interface mais responsiva

#### Densidade de Informação vs. Clareza

- **Decisão**: Balancear informações essenciais com clareza visual
- **Consequência**: Uso de modais e drawers para detalhes adicionais

#### Consistência vs. Inovação

- **Decisão**: Manter consistência com padrões conhecidos (Shadcn/ui)
- **Consequência**: Interface familiar, mas menos "única"

---

## 4. Arquitetura & C4 Model

### C4 Model - Níveis de Abstração

#### Nível 1: System Context (Contexto do Sistema)

```
┌─────────────────────────────────────────────────────────────┐
│                      Letrar IA System                        │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Frontend    │    │   Backend    │    │   Database   │  │
│  │  (React)     │◄───►│  (FastAPI)  │◄───►│ (PostgreSQL) │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                              │                               │
│                              ▼                               │
│                    ┌──────────────────┐                      │
│                    │  Google Gemini   │                      │
│                    │      API         │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
    Professores          Coordenadores        Administradores
```

**Atores Externos**:
- **Professores**: Usuários principais que utilizam a plataforma
- **Coordenadores**: Visualizam relatórios agregados
- **Administradores**: Gerenciam usuários e configurações

**Sistemas Externos**:
- **Google Gemini API**: Geração de insights pedagógicos
- **Whisper (Local)**: Transcrição de áudio

#### Nível 2: Container (Containers)

```
┌──────────────────────────────────────────────────────────────┐
│                        Letrar IA                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Frontend Application (React + Vite)                  │   │
│  │  - Componentes React                                  │   │
│  │  - React Router                                       │   │
│  │  - State Management (Context API)                     │   │
│  │  - HTTP Client (Fetch/Axios)                         │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                      │ HTTP/REST (JWT)                       │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │  Backend API (FastAPI)                                │   │
│  │  - API Routes                                         │   │
│  │  - Services Layer                                      │   │
│  │  - Repositories                                       │   │
│  │  - Authentication (JWT)                               │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                      │ SQLAlchemy (Async)                    │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │  Database (PostgreSQL)                                │   │
│  │  - 13 Tabelas                                         │   │
│  │  - Relacionamentos complexos                         │   │
│  │  - Índices otimizados                                 │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AI Services                                          │   │
│  │  - Whisper (Local) - Transcrição                     │   │
│  │  - Google Gemini - Insights                           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Containers**:
1. **Frontend Application**: Interface web React
2. **Backend API**: API REST FastAPI
3. **Database**: PostgreSQL para persistência
4. **AI Services**: Whisper (local) e Google Gemini (API)

#### Nível 3: Component (Componentes)

**Backend - Camadas de Componentes**:

```
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   Auth   │ │ Students  │ │Recording  │ │  Trails  │     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│       │            │             │            │            │
└───────┼────────────┼─────────────┼────────────┼────────────┘
        │            │             │            │
┌───────▼────────────▼─────────────▼────────────▼────────────┐
│                  Services Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   Auth   │ │ Student  │ │Recording │ │  Trail   │     │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│       │            │             │            │            │
└───────┼────────────┼─────────────┼────────────┼────────────┘
        │            │             │            │
┌───────▼────────────▼─────────────▼────────────▼────────────┐
│                Repositories Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   User   │ │ Student  │ │Recording │ │  Trail   │     │
│  │   Repo   │ │   Repo   │ │   Repo   │ │   Repo   │     │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│       │            │             │            │            │
└───────┼────────────┼─────────────┼────────────┼────────────┘
        │            │             │            │
┌───────▼────────────▼─────────────▼────────────▼────────────┐
│                    Models Layer                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │   User   │ │ Student  │ │Recording │ │  Trail   │     │
│  │  Model   │ │  Model   │ │  Model   │ │  Model   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Frontend - Componentes Principais**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Pages Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ LoginPage    │  │ AdminDashboard│  │ProfessionalHome│    │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │               │
└─────────┼─────────────────┼──────────────────┼──────────────┘
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼──────────────┐
│              Feature Components Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Students │ │Activities│ │Recordings│ │  Trails  │      │
│  │Components│ │Components│ │Components│ │Components│      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │            │             │            │             │
└───────┼────────────┼─────────────┼────────────┼─────────────┘
        │            │             │            │
┌───────▼────────────▼─────────────▼────────────▼─────────────┐
│                    UI Components Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Button  │ │  Input   │ │  Dialog  │ │   Card   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### Nível 4: Code (Código)

**Exemplo de Fluxo Completo - Upload de Gravação**:

```python
# Route Layer
@router.post("/recording")
async def create_recording(
    student_id: str = Form(...),
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = RecordingService(db)
    return await service.process_recording(student_id, audio)

# Service Layer
class RecordingService:
    async def process_recording(self, student_id: str, audio: UploadFile):
        # 1. Salvar arquivo
        file_path = await self._save_audio(audio)
        
        # 2. Transcrever com Whisper
        transcription = await self.whisper_service.transcribe_file(file_path)
        
        # 3. Calcular métricas
        analysis = self.analysis_service.analyze_reading(
            transcription, reference_text, duration
        )
        
        # 4. Gerar insight com Gemini
        insight = await self.gemini_service.generate_recording_insight(recording)
        
        # 5. Persistir no banco
        return await self.repository.save(recording, analysis, insight)

# Repository Layer
class RecordingRepository:
    async def save(self, recording: Recording, analysis: RecordingAnalysis):
        self.session.add(recording)
        self.session.add(analysis)
        await self.session.commit()
        return recording
```

### Padrões Arquiteturais

1. **Layered Architecture**: Separação clara de responsabilidades
2. **Repository Pattern**: Abstração de acesso a dados
3. **Service Layer Pattern**: Lógica de negócio isolada
4. **Dependency Injection**: Injeção via FastAPI Depends
5. **Async/Await**: Operações assíncronas para performance

---

## 5. Tecnologias & Infraestrutura

### Stack Tecnológico

#### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Biblioteca UI |
| **TypeScript** | latest | Tipagem estática |
| **Vite** | 6.3.5 | Build tool e dev server |
| **React Router** | 7.9.6 | Roteamento |
| **React Hook Form** | 7.55.0 | Gerenciamento de formulários |
| **Shadcn/ui** | latest | Componentes UI base |
| **Tailwind CSS** | latest | Estilização utility-first |
| **Recharts** | 2.15.2 | Gráficos e visualizações |
| **Lucide React** | 0.487.0 | Ícones |

#### Backend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Python** | 3.11+ | Linguagem principal |
| **FastAPI** | 0.104.1 | Framework web assíncrono |
| **SQLAlchemy** | 2.0.23 | ORM com suporte async |
| **Alembic** | 1.12.1 | Migrations do banco |
| **Pydantic** | 2.5.0 | Validação de dados |
| **python-jose** | 3.3.0 | JWT tokens |
| **bcrypt** | 4.1.2 | Hash de senhas |
| **asyncpg** | 0.29.0 | Driver PostgreSQL async |
| **openai-whisper** | latest | Transcrição de áudio |
| **google-genai** | latest | API Google Gemini |

#### Banco de Dados

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **PostgreSQL** | 15+ | SGBD relacional |
| **Extensões** | - | uuid-ossp, pg_trgm, btree_gin |

#### DevOps

| Tecnologia | Propósito |
|------------|-----------|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração local |
| **Git** | Controle de versão |

### Infraestrutura

#### Arquitetura de Deploy (Desenvolvimento)

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                         │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │  │   Database   │ │
│  │   Container  │  │   Container  │  │   Container  │ │
│  │   Port: 5174 │  │   Port: 8888 │  │  Port: 55432 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Portas e Serviços

- **Frontend**: `http://localhost:5174`
- **Backend API**: `http://localhost:8888`
- **PostgreSQL**: `localhost:55432`
- **Swagger Docs**: `http://localhost:8888/docs`
- **ReDoc**: `http://localhost:8888/redoc`

### CI/CD

**Status Atual**: Configuração manual para desenvolvimento

**Futuro**:
- GitHub Actions para testes automatizados
- Deploy automático em staging/produção
- Linting e type checking automatizados

### Segurança

#### Autenticação
- **JWT Tokens**: Access token (30min) + Refresh token (7 dias)
- **Bcrypt**: Hash de senhas com salt rounds
- **CORS**: Configurado para origens específicas

#### Validação
- **Pydantic**: Validação de entrada no backend
- **TypeScript**: Type safety no frontend
- **Sanitização**: Limpeza de inputs

#### Dados Sensíveis
- Variáveis de ambiente para configurações
- `.env` não versionado no Git
- Chaves de API armazenadas de forma segura

---

## 6. Visão do Produto

### Funcionalidades Principais

#### 1. Autenticação e Gerenciamento de Usuários

- **Login seguro** com JWT
- **Dois níveis de acesso**: Admin e Professional
- **Gerenciamento de profissionais** (apenas admin)
- **Perfis de usuário** personalizáveis

#### 2. Gerenciamento de Alunos

- **Cadastro completo** de alunos com dados pessoais
- **Upload de foto de perfil**
- **Registro de necessidades especiais** (TDAH, dislexia, etc.)
- **Status de aluno** (ativo/inativo)
- **Soft delete** para preservar histórico

#### 3. Trilhas de Leitura

- **Criação de trilhas personalizadas** por profissional
- **Histórias organizadas** por ordem de dificuldade
- **Foco em letras e fonemas** específicos
- **Trilhas padrão** disponíveis para todos
- **Acompanhamento de progresso** por aluno

#### 4. Gravações e Análise

- **Upload de gravações de áudio**
- **Transcrição automática** com Whisper
- **Cálculo automático de métricas**:
  - Fluência (0-100)
  - Prosódia (0-100)
  - Velocidade (palavras/minuto)
  - Acurácia (0-100)
  - Pontuação geral (0-100)
- **Detecção de erros** na leitura
- **Análise de pausas**

#### 5. Insights de IA

- **Geração automática de insights** após cada gravação
- **Contexto completo**: Histórico, diagnósticos, métricas
- **Tipos de insights**:
  - Progresso (melhorias identificadas)
  - Atenção necessária (dificuldades)
  - Sugestões (recomendações práticas)
- **Priorização**: Baixa, média, alta
- **Histórico completo** de insights por aluno

#### 6. Diagnósticos

- **Criação de diagnósticos** iniciais, contínuos e finais
- **Registro de pontos fortes e dificuldades**
- **Nível de leitura** identificado
- **Recomendações pedagógicas**
- **Histórico de diagnósticos** por aluno

#### 7. Atividades Pedagógicas

- **Criação de atividades** personalizadas
- **Atribuição a alunos** específicos
- **Acompanhamento de status** (pendente, em andamento, concluída)
- **Tipos de atividade**: Leitura, Escrita
- **Níveis de dificuldade**: Fácil, Médio, Difícil

#### 8. Relatórios

- **Geração automática de relatórios** por aluno ou turma
- **Compilação de métricas** e insights
- **Exportação** em múltiplos formatos (PDF, CSV)
- **Visualizações gráficas** de progresso
- **Compartilhamento facilitado**

### Interface do Usuário

#### Tela de Login
- Design limpo e profissional
- Logo e identidade visual do Letrar IA
- Formulário de login com validação
- Mensagens de erro claras

#### Dashboard do Profissional
- **Visão geral** de alunos
- **Cards visuais** com status e métricas principais
- **Filtros** por status, dificuldade, etc.
- **Acesso rápido** a funcionalidades principais

#### Tela de Alunos
- **Lista de alunos** com cards informativos
- **Busca e filtros** avançados
- **Ações rápidas**: Ver perfil, criar atividade, ver gravações
- **Indicadores visuais** de progresso

#### Tela de Gravações
- **Lista de gravações** com player integrado
- **Visualização de métricas** detalhadas
- **Gráficos de progresso** ao longo do tempo
- **Insights da IA** destacados

#### Tela de Trilhas
- **Visualização de trilhas** disponíveis
- **Progresso por aluno** em cada trilha
- **Histórias organizadas** por ordem
- **Criação de trilhas personalizadas**

### Demonstração

**Nota**: Para demonstração ao vivo, acesse:
- **Frontend**: `http://localhost:5174`
- **Credenciais de teste**: 
  - Email: `professor@letraria.com`
  - Senha: `prof123`

**Fluxo de Demonstração Sugerido**:
1. Login como profissional
2. Visualizar dashboard com alunos
3. Selecionar aluno e ver perfil
4. Acessar trilha e visualizar histórias
5. Fazer upload de gravação (ou usar gravação existente)
6. Visualizar análise automática e métricas
7. Ver insights gerados pela IA
8. Gerar relatório e visualizar

**Fallback (Screenshots/Vídeo)**:
- Screenshots das principais telas disponíveis em `/docs/screenshots`
- Vídeo de demonstração disponível em [link do vídeo]

---

## 7. Modelos de IA, Dados e Avaliação

### Modelos de IA Utilizados

#### 1. Whisper (OpenAI) - Transcrição de Áudio

**Tipo**: Modelo de Speech-to-Text local

**Versão**: Modelo `base` (configurável: tiny, base, small, medium, large)

**Responsabilidade**: Converter gravações de áudio em texto transcrito

**Características**:
- **Processamento local**: Não envia dados para servidores externos
- **Suporte a português**: Otimizado para transcrição em português brasileiro
- **Cache de modelo**: Modelo carregado uma vez e reutilizado para melhor performance
- **Processamento assíncrono**: Não bloqueia outras requisições

**Limitações**:
- Requer `ffmpeg` instalado no sistema
- Primeira execução baixa o modelo (pode demorar)
- Processamento pode ser lento para áudios muito longos
- Qualidade depende da clareza do áudio

#### 2. Google Gemini - Geração de Insights

**Tipo**: Modelo de linguagem generativa (LLM) via API

**Versão**: `gemini-2.5-flash`

**Responsabilidade**: Gerar insights pedagógicos personalizados baseados em contexto

**Características**:
- **RAG (Retrieval Augmented Generation)**: Utiliza contexto do aluno para gerar insights relevantes
- **Prompt Engineering**: Prompts estruturados para garantir respostas consistentes
- **Formato JSON**: Respostas estruturadas para fácil processamento
- **Contexto Rico**: Considera histórico de gravações, diagnósticos e métricas

**Pipeline de Dados para Insights**:

```
1. Coleta de Contexto
   ├── Dados do aluno (nome, idade, necessidades especiais)
   ├── Última gravação e métricas
   ├── Histórico de gravações anteriores (últimas 5)
   ├── Diagnósticos anteriores (últimos 3)
   └── Insights anteriores (últimos 3)

2. Formatação do Contexto
   ├── Formatação de gravações em texto estruturado
   ├── Formatação de diagnósticos
   └── Compilação de métricas

3. Construção do Prompt
   ├── Instruções para o modelo
   ├── Contexto formatado
   └── Formato de resposta esperado (JSON)

4. Chamada à API
   ├── Envio do prompt
   └── Recebimento da resposta

5. Processamento
   ├── Extração de JSON
   ├── Validação de estrutura
   └── Normalização de dados

6. Persistência
   └── Salvamento no banco de dados
```

**Estrutura do Insight Gerado**:

```json
{
  "type": "progress|attention_needed|suggestion",
  "priority": "low|medium|high",
  "title": "Título curto e descritivo",
  "description": "Descrição detalhada com orientação prática"
}
```

**Limitações**:
- Depende de API externa (requer conexão)
- Custo por requisição (limites de quota)
- Latência de rede
- Possíveis vieses do modelo
- Necessidade de validação humana dos insights

### Pipeline de Dados

#### Fluxo Completo: Upload → Análise → Insight

```
1. Upload de Áudio
   │
   ├─► Salvar arquivo em uploads/recordings/
   │
   ├─► Criar registro de Recording no banco
   │
   └─► Status: "pending"

2. Transcrição (Whisper)
   │
   ├─► Carregar modelo Whisper (cache)
   │
   ├─► Processar áudio
   │
   ├─► Extrair texto transcrito
   │
   └─► Atualizar Recording.transcription
       Status: "processing"

3. Análise de Leitura
   │
   ├─► Comparar transcrição com texto original
   │
   ├─► Calcular métricas:
   │   ├─► Accuracy Score (acurácia)
   │   ├─► Fluency Score (fluência)
   │   ├─► Prosody Score (prosódia)
   │   ├─► Speed WPM (velocidade)
   │   └─► Overall Score (geral)
   │
   ├─► Detectar erros
   │
   ├─► Analisar pausas
   │
   └─► Criar RecordingAnalysis
       Status: "completed"

4. Geração de Insight (Gemini)
   │
   ├─► Coletar contexto do aluno
   │
   ├─► Construir prompt
   │
   ├─► Chamar API Gemini
   │
   ├─► Processar resposta
   │
   └─► Criar AIInsight
```

### Métricas de Avaliação

#### Métricas de Leitura Calculadas

1. **Accuracy Score (0-100)**
   - **Cálculo**: `(palavras_corretas / total_palavras_faladas) * 100`
   - **Método**: SequenceMatcher para comparar texto esperado vs. transcrito
   - **Interpretação**: 
     - 90-100: Excelente
     - 70-89: Bom
     - 50-69: Regular
     - <50: Precisa atenção

2. **Fluency Score (0-100)**
   - **Cálculo**: `(words_per_minute / 120) * 100` (normalizado)
   - **Referência**: 120 palavras/minuto como padrão ideal
   - **Interpretação**: Velocidade de leitura normalizada

3. **Prosody Score (0-100)**
   - **Cálculo**: Baseado em pontuação respeitada
   - **Método**: Comparação de pontuação esperada vs. detectada
   - **Interpretação**: Entonação e ritmo na leitura

4. **Speed WPM (Words Per Minute)**
   - **Cálculo**: `total_palavras / (duração_segundos / 60)`
   - **Interpretação**: Velocidade bruta de leitura

5. **Overall Score (0-100)**
   - **Cálculo**: Média ponderada das métricas acima
   - **Interpretação**: Pontuação geral de desempenho

#### Métricas de Sistema

- **Tempo de processamento**: Latência de transcrição e análise
- **Taxa de sucesso**: Percentual de gravações processadas com sucesso
- **Qualidade de transcrição**: Acurácia da transcrição Whisper
- **Relevância de insights**: Feedback dos usuários sobre utilidade dos insights

### Vieses e Limitações

#### Vieses Identificados

1. **Viés do Modelo Gemini**
   - **Risco**: Insights podem refletir vieses do modelo de treinamento
   - **Mitigação**: Validação humana dos insights, prompts cuidadosamente construídos

2. **Viés de Dados**
   - **Risco**: Modelo treinado principalmente em dados de língua inglesa
   - **Mitigação**: Whisper tem suporte a português, mas qualidade pode variar

3. **Viés de Amostragem**
   - **Risco**: Alunos com mais gravações têm mais contexto para insights
   - **Mitigação**: Sistema funciona mesmo com poucos dados

#### Limitações Técnicas

1. **Whisper Local**
   - Requer recursos computacionais (CPU/GPU)
   - Processamento pode ser lento em hardware limitado
   - Qualidade depende da clareza do áudio

2. **Gemini API**
   - Dependência de conexão com internet
   - Limites de quota e custos
   - Latência de rede pode afetar experiência

3. **Análise de Métricas**
   - Comparação simples texto-a-texto pode não capturar nuances
   - Não considera contexto semântico completo
   - Métricas podem não refletir qualidade pedagógica real

### Segurança e Privacidade

#### Dados de Usuários

- **Anonimização**: Nomes de alunos são armazenados, mas podem ser anonimizados em relatórios
- **Consentimento**: Sistema assume consentimento implícito ao usar a plataforma
- **Armazenamento**: Dados armazenados localmente ou em servidor controlado
- **Acesso**: Apenas profissionais autorizados têm acesso aos dados de seus alunos

#### Dados de Áudio

- **Armazenamento Local**: Áudios armazenados em `uploads/recordings/`
- **Não Enviados para Serviços Externos**: Whisper processa localmente
- **Transcrições**: Armazenadas no banco de dados
- **Retenção**: Dados mantidos conforme política de retenção

#### Dados Enviados para Gemini

- **Contexto Enviado**: 
  - Nome do aluno
  - Idade
  - Transcrições de gravações
  - Métricas calculadas
  - Diagnósticos anteriores
- **Não Enviado**:
  - Áudios brutos
  - Dados pessoais sensíveis além do necessário
- **Política**: Dados enviados conforme termos de uso do Google Gemini

#### Recomendações de Segurança

1. **Criptografia**: Implementar criptografia em trânsito (HTTPS) e em repouso
2. **Backup**: Backups regulares dos dados
3. **Auditoria**: Logs de acesso e modificações
4. **LGPD**: Conformidade com Lei Geral de Proteção de Dados
5. **Consentimento Explícito**: Obter consentimento explícito para uso de IA

---

## 8. Conclusão - Desafios, Decisões e Aprendizados

### Desafios Enfrentados

#### 1. Integração de Múltiplas Tecnologias de IA

**Desafio**: Integrar Whisper (local) e Google Gemini (API) de forma eficiente

**Solução**:
- Implementação de cache para modelo Whisper
- Processamento assíncrono para não bloquear requisições
- Tratamento robusto de erros e fallbacks
- Timeout e retry logic para chamadas à API

**Aprendizado**: Integração de múltiplos serviços de IA requer planejamento cuidadoso de arquitetura e tratamento de erros.

#### 2. Processamento de Áudio em Tempo Real

**Desafio**: Processar gravações de áudio de forma eficiente sem impactar performance

**Solução**:
- Processamento assíncrono em background
- Status de processamento (pending, processing, completed)
- Armazenamento local de arquivos
- Otimização do modelo Whisper (escolha do tamanho base)

**Aprendizado**: Operações de I/O pesadas devem ser assíncronas e com feedback de status para o usuário.

#### 3. Cálculo Preciso de Métricas de Leitura

**Desafio**: Desenvolver algoritmo confiável para calcular fluência, prosódia e acurácia

**Solução**:
- Uso de SequenceMatcher para comparação de textos
- Normalização de métricas (0-100)
- Múltiplas métricas complementares
- Validação com dados reais

**Aprendizado**: Métricas educacionais requerem validação pedagógica, não apenas técnica.

#### 4. Geração de Insights Contextuais com IA

**Desafio**: Gerar insights relevantes e úteis usando IA generativa

**Solução**:
- Implementação de RAG (Retrieval Augmented Generation)
- Prompts estruturados e específicos
- Coleta de contexto rico (histórico, diagnósticos, métricas)
- Validação e normalização de respostas JSON

**Aprendizado**: Prompt engineering é crucial para qualidade de outputs de LLMs.

#### 5. Arquitetura Escalável

**Desafio**: Criar arquitetura que suporte crescimento e manutenção

**Solução**:
- Arquitetura em camadas bem definidas
- Repository Pattern para abstração de dados
- Service Layer para lógica de negócio
- Separação clara de responsabilidades

**Aprendizado**: Investir tempo em arquitetura desde o início economiza tempo futuro.

### Decisões Arquiteturais Importantes

#### 1. FastAPI com Async/Await

**Decisão**: Usar FastAPI com operações assíncronas

**Justificativa**:
- Performance superior para I/O bound operations
- Suporte nativo a async/await
- Documentação automática (Swagger)
- Type hints e validação com Pydantic

**Trade-off**: Curva de aprendizado maior, mas benefícios de performance justificam.

#### 2. Whisper Local vs. API

**Decisão**: Usar Whisper local ao invés de API

**Justificativa**:
- Privacidade: dados não saem do servidor
- Custo: sem custos por requisição
- Controle: não depende de serviços externos

**Trade-off**: Requer mais recursos computacionais e setup inicial.

#### 3. PostgreSQL com JSONB

**Decisão**: Usar PostgreSQL com campos JSONB para dados flexíveis

**Justificativa**:
- Flexibilidade para dados variáveis (special_needs, errors_detected)
- Performance com índices GIN
- Queries complexas ainda possíveis

**Trade-off**: Menos estrutura rígida, mas mais flexibilidade.

#### 4. React com TypeScript

**Decisão**: Usar TypeScript no frontend

**Justificativa**:
- Type safety reduz bugs
- Melhor experiência de desenvolvimento
- Refatoração mais segura

**Trade-off**: Mais verbosidade, mas benefícios superam.

#### 5. Shadcn/ui como Base de Componentes

**Decisão**: Usar Shadcn/ui ao invés de criar componentes do zero

**Justificativa**:
- Componentes acessíveis e bem testados
- Customizável (copia código, não dependência)
- Consistência visual

**Trade-off**: Menos controle total, mas desenvolvimento mais rápido.

### Aprendizados Principais

#### Técnicos

1. **Async/Await é Essencial**: Para operações de I/O, async melhora significativamente performance
2. **Arquitetura em Camadas Facilita Manutenção**: Separação clara de responsabilidades torna código mais manutenível
3. **Type Safety Previne Bugs**: TypeScript e Pydantic capturam muitos erros em tempo de desenvolvimento
4. **Cache é Fundamental**: Cache de modelos de IA reduz drasticamente tempo de processamento
5. **Tratamento de Erros Robusto**: Sistemas com IA externa precisam de tratamento de erros cuidadoso

#### Processuais

1. **Prototipação Antes de Implementar**: Figma ajudou a validar ideias antes de codificar
2. **Feedback Contínuo**: Testes de usabilidade revelaram problemas não óbvios
3. **Documentação é Investimento**: Documentar durante desenvolvimento facilita manutenção
4. **Iteração Rápida**: Desenvolvimento incremental permite ajustes baseados em feedback
5. **Colaboração Multidisciplinar**: Equipe com UX, Frontend e Backend trouxe perspectivas diferentes

#### Pedagógicos

1. **Métricas Precisam de Contexto**: Números sozinhos não são suficientes, precisam de interpretação
2. **IA como Ferramenta, não Substituição**: Insights de IA devem apoiar, não substituir julgamento humano
3. **Usabilidade é Crítica**: Professores precisam de interface simples e intuitiva
4. **Dados Visuais são Poderosos**: Gráficos e visualizações tornam dados mais acessíveis

### Próximos Passos e Melhorias Futuras

#### Curto Prazo

1. **Testes Automatizados**: Implementar testes unitários e de integração
2. **Otimização de Performance**: Melhorar tempo de resposta de análises
3. **Melhorias de UX**: Refinar interface baseado em feedback
4. **Documentação de API**: Completar documentação Swagger

#### Médio Prazo

1. **Deploy em Produção**: Configurar ambiente de produção
2. **Monitoramento**: Implementar logging e monitoramento
3. **Backup Automatizado**: Sistema de backup de dados
4. **Exportação Avançada**: Mais formatos de exportação de relatórios

#### Longo Prazo

1. **Machine Learning Customizado**: Modelo treinado especificamente para alfabetização
2. **Análise de Voz Avançada**: Detecção de emoção, entonação mais precisa
3. **Gamificação**: Elementos de gamificação para engajar alunos
4. **Integração com Sistemas Escolares**: Integração com sistemas de gestão escolar
5. **Mobile App**: Aplicativo mobile para acesso em tablets

### Conclusão Final

O **Letrar IA** representa uma solução inovadora para desafios reais enfrentados por professores de alfabetização. Através da combinação de tecnologias modernas (React, FastAPI, PostgreSQL) com Inteligência Artificial (Whisper, Gemini), criamos uma plataforma que automatiza análises complexas e fornece insights valiosos.

Os principais sucessos do projeto incluem:
- ✅ Arquitetura escalável e manutenível
- ✅ Integração eficiente de múltiplos serviços de IA
- ✅ Interface intuitiva e acessível
- ✅ Métricas objetivas e acionáveis
- ✅ Insights pedagógicos personalizados

Os desafios enfrentados e superados trouxeram aprendizados valiosos sobre arquitetura de software, integração de IA, e desenvolvimento de produtos educacionais. O projeto demonstra que é possível criar soluções tecnológicas que realmente ajudam profissionais da educação em seu trabalho diário.

**O futuro da alfabetização é inteligente, e o Letrar IA está na vanguarda dessa transformação.**

---

**Equipe de Desenvolvimento**:
- Grupo 4: Caio Castro Miranda, Jaime Da Cruz Silva Junior, João Pedro de Brito Tomé, Nicole Liecheski
- Grupo 2: Amanda Soares Souza, Gabriel Mota da Silva Lobo, Marcello Ronald Jose da Silva, Matheus Augusto Ferreira Medeiros

**Disciplina**: Design de Software

**Data**: Novembro 2025

