import asyncio
import bcrypt
from sqlalchemy import select, func
from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
import uuid


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


async def seed_users():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(select(func.count(User.id)))
            count = result.scalar()
            
            if count > 0:
                print(f"Já existem {count} usuário(s) no banco. Seed não executado.")
                return

            users_data = [
                {
                    "id": uuid.uuid4(),
                    "email": "admin@letraria.com",
                    "password": "admin123",
                    "name": "Administrador",
                    "role": UserRole.admin,
                },
                {
                    "id": uuid.uuid4(),
                    "email": "professor1@letraria.com",
                    "password": "prof123",
                    "name": "Ana Silva",
                    "role": UserRole.professional,
                },
                {
                    "id": uuid.uuid4(),
                    "email": "professor2@letraria.com",
                    "password": "prof123",
                    "name": "Carlos Santos",
                    "role": UserRole.professional,
                },
                {
                    "id": uuid.uuid4(),
                    "email": "professor3@letraria.com",
                    "password": "prof123",
                    "name": "Maria Oliveira",
                    "role": UserRole.professional,
                },
            ]

            for user_data in users_data:
                password_hash = hash_password(user_data["password"])
                user = User(
                    id=user_data["id"],
                    email=user_data["email"],
                    password_hash=password_hash,
                    name=user_data["name"],
                    role=user_data["role"],
                )
                session.add(user)

            await session.commit()
            print(f"✓ {len(users_data)} usuário(s) criado(s) com sucesso!")
            print("\nUsuários criados:")
            for user_data in users_data:
                print(f"  - {user_data['email']} ({user_data['role'].value}) - Senha: {user_data['password']}")

        except Exception as e:
            await session.rollback()
            print(f"Erro ao criar usuários: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_users())

