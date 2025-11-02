# Autenticação JWT

Sistema de autenticação usando JWT (JSON Web Tokens) implementado no backend.

## Endpoints

### POST /auth/login
Realiza login e retorna o token JWT.

**Request:**
```json
{
  "email": "admin@letraria.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "admin@letraria.com",
    "name": "Administrador",
    "role": "admin"
  }
}
```

### GET /auth/me
Retorna informações do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "admin@letraria.com",
  "name": "Administrador",
  "role": "admin"
}
```

## Como Usar em Rotas Protegidas

### Usuário Autenticado Qualquer
```python
from app.utils.dependencies import get_current_active_user
from app.models.user import User

@router.get("/protegida")
async def rota_protegida(
    current_user: User = Depends(get_current_active_user)
):
    return {"message": f"Olá {current_user.name}"}
```

### Apenas Administrador
```python
from app.utils.dependencies import get_current_admin
from app.models.user import User

@router.get("/admin")
async def rota_admin(
    current_user: User = Depends(get_current_admin)
):
    return {"message": "Acesso de administrador"}
```

## Estrutura Implementada

### Utilitários
- `app/utils/password.py` - Hash e verificação de senhas (bcrypt)
- `app/utils/jwt.py` - Criação e validação de tokens JWT
- `app/utils/dependencies.py` - Dependencies do FastAPI para autenticação

### Schemas
- `app/schemas/auth.py` - Schemas Pydantic para autenticação

### Repositórios
- `app/repositories/user_repository.py` - Acesso a dados de usuários

### Serviços
- `app/services/auth_service.py` - Lógica de autenticação

### Rotas
- `app/api/routes/auth.py` - Endpoints de autenticação

## Configuração

As configurações de autenticação estão no `app/config.py`:
- `secret_key`: Chave secreta para assinar tokens
- `algorithm`: Algoritmo JWT (padrão: HS256)
- `access_token_expire_minutes`: Tempo de expiração do token (padrão: 30 minutos)

## Segurança

- Senhas são criptografadas com bcrypt antes de serem armazenadas
- Tokens JWT contêm informações do usuário (id, email, role)
- Tokens têm expiração configurável
- Middleware CORS configurado para permitir requisições do frontend

