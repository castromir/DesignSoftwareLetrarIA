# Letrar IA - Backend

Backend da aplicação Letrar IA construído com FastAPI e PostgreSQL.

## Tecnologias

- **Python 3.11+**
- **FastAPI** - Framework web assíncrono
- **SQLAlchemy 2.x** - ORM com suporte async
- **Alembic** - Gerenciamento de migrations
- **PostgreSQL** - Banco de dados relacional
- **Pydantic** - Validação de dados

## Estrutura do Projeto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point da aplicação
│   ├── config.py            # Configurações
│   ├── database.py          # Conexão com banco
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes/          # Rotas da API
│   ├── models/              # Models SQLAlchemy
│   ├── schemas/              # Schemas Pydantic
│   ├── services/            # Lógica de negócio
│   ├── repositories/        # Acesso a dados
│   ├── controllers/         # Controllers
│   └── utils/               # Utilitários
├── alembic/                 # Migrations
├── tests/                   # Testes
├── env.example              # Exemplo de variáveis de ambiente
├── .gitignore
├── requirements.txt
└── README.md
```

## Configuração Inicial

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

4. Configurar variáveis de ambiente no arquivo `.env`

5. Inicializar banco de dados e migrations:
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

6. Executar aplicação:
```bash
uvicorn app.main:app --reload
```

A API estará disponível em `http://localhost:8000`

Documentação interativa: `http://localhost:8000/docs`
Documentação alternativa: `http://localhost:8000/redoc`

## Desenvolvimento

### Criar nova migration:
```bash
alembic revision --autogenerate -m "descrição da mudança"
alembic upgrade head
```

### Executar testes:
```bash
pytest
```

### Formatação de código:
```bash
black .
flake8 .
mypy .
```

