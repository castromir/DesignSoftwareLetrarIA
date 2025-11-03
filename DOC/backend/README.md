# Letrar IA - Backend

Backend da aplicação Letrar IA construído com FastAPI e PostgreSQL.

## Tecnologias

- **Python 3.11+**
- **FastAPI** - Framework web assíncrono
- **SQLAlchemy 2.x** - ORM com suporte async
- **Alembic** - Gerenciamento de migrations
- **PostgreSQL** - Banco de dados relacional
- **Pydantic V2** - Validação de dados e configurações
- **python-jose** - Geração e validação de tokens JWT
- **bcrypt** - Criptografia de senhas
- **asyncpg** - Driver PostgreSQL assíncrono

## Arquitetura

O backend utiliza uma **Arquitetura em Camadas (Layered Architecture)** seguindo os princípios de **Clean Architecture** e **SOLID**, organizada em camadas bem definidas:

### Camadas da Arquitetura

```
┌─────────────────────────────────────┐
│        API Routes (Routes)          │  ← Camada de Apresentação
│     (Endpoints HTTP/REST)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services                    │  ← Camada de Lógica de Negócio
│   (Regras de negócio, orquestração) │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repositories                   │  ← Camada de Acesso a Dados
│   (Operações com banco de dados)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Models                      │  ← Camada de Dados
│   (Entidades SQLAlchemy)            │
└─────────────────────────────────────┘
```

### Fluxo de Dados

1. **Routes** (`api/routes/`) - Recebe requisições HTTP, valida entrada com Schemas Pydantic
2. **Services** (`services/`) - Contém a lógica de negócio, orquestra operações entre repositories
3. **Repositories** (`repositories/`) - Abstrai acesso ao banco de dados, realiza queries SQLAlchemy
4. **Models** (`models/`) - Define entidades do banco de dados (ORM)

## Padrões de Implementação

### 1. Repository Pattern

Cada entidade tem seu próprio repository que encapsula todas as operações de acesso a dados:

```python
class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_by_email(self, email: str) -> Optional[User]:
        # Implementação específica de busca por email
```

**Benefícios:**
- Isola a lógica de acesso a dados
- Facilita testes (pode criar mocks)
- Permite trocar implementação sem afetar serviços

### 2. Service Layer Pattern

Serviços contêm a lógica de negócio e orquestram operações:

```python
class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repository = UserRepository(session)
    
    async def authenticate_user(self, email: str, password: str):
        # Lógica de autenticação
```

**Benefícios:**
- Separa lógica de negócio das rotas
- Facilita reutilização de código
- Torna testes mais simples

### 3. Dependency Injection

FastAPI utiliza dependency injection nativo através de `Depends()`:

```python
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    # db é injetado automaticamente
```

### 4. Schema Pattern (DTO)

Schemas Pydantic validam e transformam dados:

- **Request Schemas** - Validam dados de entrada
- **Response Schemas** - Formatam dados de saída
- **Separação entre Models (ORM) e Schemas (API)**

### 5. Async/Await

Todas as operações de I/O são assíncronas:
- Queries ao banco de dados
- Chamadas HTTP
- Operações de arquivo

## Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # Entry point, configuração FastAPI
│   ├── config.py                 # Configurações (Pydantic Settings)
│   ├── database.py               # Engine SQLAlchemy, sessões async
│   │
│   ├── api/                      # Camada de Apresentação
│   │   └── routes/               
│   │       └── auth.py           # Rotas de autenticação
│   │
│   ├── models/                   # Camada de Dados (ORM)
│   │   ├── user.py               # Model User
│   │   ├── student.py            # Model Student
│   │   ├── trail.py              # Models Trail e TrailStory
│   │   ├── recording.py          # Models Recording e RecordingAnalysis
│   │   ├── activity.py           # Models Activity e StudentActivity
│   │   ├── diagnostic.py        # Model Diagnostic
│   │   ├── progress.py           # Model StudentTrailProgress
│   │   ├── text_library.py      # Model TextLibrary
│   │   ├── report.py             # Model Report
│   │   └── ai_insight.py         # Model AIInsight
│   │
│   ├── schemas/                  # DTOs (Data Transfer Objects)
│   │   └── auth.py               # Schemas de autenticação
│   │
│   ├── services/                 # Camada de Lógica de Negócio
│   │   └── auth_service.py        # Serviço de autenticação
│   │
│   ├── repositories/             # Camada de Acesso a Dados
│   │   └── user_repository.py    # Repository de usuários
│   │
│   ├── controllers/              # (Reservado para futuras implementações)
│   │
│   └── utils/                    # Utilitários
│       ├── dependencies.py       # Dependencies FastAPI (auth, etc)
│       ├── jwt.py                 # Funções JWT (criar/validar tokens)
│       └── password.py            # Funções de hash/verificação de senhas
│
├── alembic/                      # Migrations do banco
│   ├── versions/                 # Arquivos de migration
│   └── env.py                    # Configuração Alembic
│
├── seeds/                        # Seeders (dados iniciais)
│   └── seed_users.py             # Seeder de usuários
│
├── tests/                        # Testes (estrutura preparada)
├── env.example                   # Exemplo de variáveis de ambiente
├── requirements.txt              # Dependências Python
├── Dockerfile                    # Docker para backend
└── README.md                     # Este arquivo
```

## Princípios de Design

### Single Responsibility Principle (SRP)
- Cada classe tem uma única responsabilidade
- Routes: apenas recebem requisições e retornam respostas
- Services: apenas contêm lógica de negócio
- Repositories: apenas acessam dados

### Dependency Inversion Principle (DIP)
- Camadas superiores dependem de abstrações (interfaces)
- Services dependem de Repositories, não diretamente de Models
- Facilita testes e mudanças de implementação

### Separation of Concerns
- Lógica de negócio separada de acesso a dados
- Validação separada de transformação
- Autenticação isolada em utils

## Exemplo de Fluxo Completo

Vamos seguir um exemplo de **Login** para entender o fluxo:

```
1. Cliente HTTP → POST /auth/login {email, password}
   ↓
2. Route (auth.py)
   - Valida entrada com LoginRequest (Pydantic)
   - Injeta dependência get_db()
   ↓
3. Service (auth_service.py)
   - Cria UserRepository
   - Chama repository.get_by_email()
   - Verifica senha com verify_password()
   - Gera token JWT com create_access_token()
   ↓
4. Repository (user_repository.py)
   - Executa query SQLAlchemy async
   - Retorna User model ou None
   ↓
5. Model (user.py)
   - Retorna instância de User (ORM)
   ↓
6. Service retorna dict com token e dados do usuário
   ↓
7. Route retorna resposta JSON
```

## Convenções de Código

### Nomenclatura

- **Models**: PascalCase (`User`, `Student`, `Trail`)
- **Repositories**: PascalCase + "Repository" (`UserRepository`)
- **Services**: PascalCase + "Service" (`AuthService`)
- **Routes/Functions**: snake_case (`get_current_user`, `authenticate_user`)
- **Schemas**: PascalCase (`LoginRequest`, `Token`, `UserResponse`)

### Organização de Arquivos

- Um model por arquivo (quando possível)
- Um schema por arquivo (por funcionalidade)
- Um service por arquivo (por domínio)
- Um repository por arquivo (por entidade)

### Imports

- Imports absolutos: `from app.models.user import User`
- Evitar imports circulares
- Agrupar imports: stdlib, third-party, local

## Configuração Inicial

### Usando Docker (Recomendado)

Ver instruções completas no README.md principal do projeto.

### Desenvolvimento Local

1. Criar ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. Instalar dependências:
```bash
pip install -r requirements.txt
```

3. Copiar arquivo de ambiente:
```bash
cp env.example .env
```

4. Configurar variáveis de ambiente no arquivo `.env`:
   - `DATABASE_URL`: URL do PostgreSQL
   - `SECRET_KEY`: Chave secreta para JWT
   - `CORS_ORIGINS`: Lista de origens permitidas

5. Aplicar migrations:
```bash
alembic upgrade head
```

6. Executar seeder (opcional):
```bash
python run_seed.py
```

7. Executar aplicação:
```bash
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

- Documentação interativa: `http://localhost:8000/docs`
- Documentação alternativa: `http://localhost:8000/redoc`

## Desenvolvimento

### Criar Nova Migration

```bash
# Gerar migration baseada em mudanças nos models
docker exec letraria-backend-dev alembic revision --autogenerate -m "descrição da mudança"

# Aplicar migration
docker exec letraria-backend-dev alembic upgrade head
```

### Executar Seeders

```bash
# Executar seeder de usuários
docker exec letraria-backend-dev python /app/run_seed.py
```

### Executar Testes

```bash
pytest
```

### Formatação de Código

```bash
black .              # Formatação automática
flake8 .             # Verificação de estilo
mypy .               # Verificação de tipos
```

## Criando Novos Endpoints

### 1. Criar Schema (se necessário)

```python
# app/schemas/student.py
from pydantic import BaseModel

class StudentCreate(BaseModel):
    name: str
    email: str
    # ...

class StudentResponse(BaseModel):
    id: str
    name: str
    # ...
    class Config:
        from_attributes = True
```

### 2. Criar Repository

```python
# app/repositories/student_repository.py
class StudentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, student_data: dict) -> Student:
        # Implementação
```

### 3. Criar Service

```python
# app/services/student_service.py
class StudentService:
    def __init__(self, session: AsyncSession):
        self.student_repository = StudentRepository(session)
    
    async def create_student(self, data: StudentCreate) -> Student:
        # Lógica de negócio
        return await self.student_repository.create(...)
```

### 4. Criar Route

```python
# app/api/routes/students.py
router = APIRouter(prefix="/students", tags=["students"])

@router.post("/", response_model=StudentResponse)
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentService(db)
    student = await service.create_student(data)
    return student
```

### 5. Registrar Route no main.py

```python
from app.api.routes import students

app.include_router(students.router)
```

## Boas Práticas

1. **Sempre use async/await** para operações de I/O
2. **Valide dados de entrada** com Schemas Pydantic
3. **Trate erros apropriadamente** com HTTPException
4. **Use transactions** quando necessário (via session)
5. **Documente endpoints** com docstrings
6. **Mantenha serviços focados** em uma única responsabilidade
7. **Teste isoladamente** cada camada

## Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT têm expiração configurável
- CORS configurado para origens específicas
- Validação de entrada com Pydantic
- Dependencies para proteger rotas autenticadas

