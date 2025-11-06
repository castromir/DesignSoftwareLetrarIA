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
            admin_result = await session.execute(select(User).where(User.email == "admin@letraria.com"))
            admin = admin_result.scalar_one_or_none()
            
            if not admin:
                admin_data = {
                    "id": uuid.uuid4(),
                    "email": "admin@letraria.com",
                    "password": "admin123",
                    "name": "Administrador",
                    "role": UserRole.admin,
                    "function": None,
                    "username": None,
                }
                password_hash = hash_password(admin_data["password"])
                admin_user = User(
                    id=admin_data["id"],
                    email=admin_data["email"],
                    password_hash=password_hash,
                    name=admin_data["name"],
                    role=admin_data["role"],
                    function=None,
                    username=None,
                )
                session.add(admin_user)
                print(f"✓ Admin criado: {admin_data['email']}")
            
            professionals_data = [
                {
                    "email": "professor@letraria.com",
                    "password": "prof123",
                    "name": "Maria Silva",
                    "function": "Professora de Alfabetização",
                    "username": "maria.silva",
                },
                {
                    "email": "joao.santos@letraria.com",
                    "password": "prof123",
                    "name": "João Santos",
                    "function": "Coordenador Pedagógico",
                    "username": "joao.santos",
                },
                {
                    "email": "ana.paula@letraria.com",
                    "password": "prof123",
                    "name": "Ana Paula",
                    "function": "Professora de Reforço",
                    "username": "ana.paula",
                },
            ]
            
            created_count = 0
            for prof_data in professionals_data:
                existing = await session.execute(select(User).where(User.email == prof_data["email"]))
                if existing.scalar_one_or_none():
                    continue
                
                password_hash = hash_password(prof_data["password"])
                user = User(
                    id=uuid.uuid4(),
                    email=prof_data["email"],
                    password_hash=password_hash,
                    name=prof_data["name"],
                    role=UserRole.professional,
                    function=prof_data["function"],
                    username=prof_data["username"],
                )
                session.add(user)
                created_count += 1
            
            if created_count == 0:
                print("Todos os profissionais já existem no banco.")
                return

            await session.commit()
            print(f"✓ {created_count} profissional(is) criado(s) com sucesso!")
            print("\nProfissionais criados:")
            for prof_data in professionals_data:
                existing = await session.execute(select(User).where(User.email == prof_data["email"]))
                if existing.scalar_one_or_none():
                    print(f"  - {prof_data['email']} (professional) - Senha: {prof_data['password']}")

        except Exception as e:
            await session.rollback()
            print(f"Erro ao criar usuários: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_users())

