from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.professional_repository import ProfessionalRepository
from app.repositories.user_repository import UserRepository
from app.schemas.professional import ProfessionalCreate, ProfessionalUpdate
from app.utils.password import hash_password
from app.models.user import UserRole
import uuid


class ProfessionalService:
    def __init__(self, session: AsyncSession):
        self.professional_repository = ProfessionalRepository(session)
        self.user_repository = UserRepository(session)
    
    async def create_professional(self, data: ProfessionalCreate) -> dict:
        existing_user = await self.user_repository.get_by_email(data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
        
        username = data.username or data.email.split("@")[0]
        existing_username = await self.user_repository.get_by_username(username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username já cadastrado"
            )
        
        user_data = {
            "email": data.email,
            "password_hash": hash_password(data.password),
            "name": data.name,
            "role": UserRole.professional,
            "function": data.function,
            "username": username,
        }
        
        professional = await self.professional_repository.create(user_data)
        
        return {
            "id": str(professional.id),
            "email": professional.email,
            "name": professional.name,
            "function": professional.function,
            "role": professional.role.value,
            "created_at": professional.created_at,
            "updated_at": professional.updated_at,
        }
    
    async def get_professional(self, professional_id: str) -> dict:
        professional = await self.professional_repository.get_by_id(uuid.UUID(professional_id))
        if not professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profissional não encontrado"
            )
        
        return {
            "id": str(professional.id),
            "email": professional.email,
            "name": professional.name,
            "function": professional.function,
            "role": professional.role.value,
            "created_at": professional.created_at,
            "updated_at": professional.updated_at,
        }
    
    async def list_professionals(self, skip: int = 0, limit: int = 100) -> dict:
        professionals = await self.professional_repository.get_all(skip=skip, limit=limit)
        total = await self.professional_repository.count_all()
        active = await self.professional_repository.count_active()
        inactive = total - active
        
        return {
            "total": total,
            "active": active,
            "inactive": inactive,
            "professionals": [
                {
                    "id": str(p.id),
                    "email": p.email,
                    "name": p.name,
                    "function": p.function,
                    "role": p.role.value,
                    "created_at": p.created_at,
                    "updated_at": p.updated_at,
                }
                for p in professionals
            ],
        }
    
    async def update_professional(self, professional_id: str, data: ProfessionalUpdate) -> dict:
        if data.email:
            existing_user = await self.user_repository.get_by_email(data.email)
            if existing_user and str(existing_user.id) != professional_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email já cadastrado"
                )
        
        update_data = {}
        if data.name is not None:
            update_data["name"] = data.name
        if data.email is not None:
            update_data["email"] = data.email
        if data.function is not None:
            update_data["function"] = data.function
        if data.username is not None:
            update_data["username"] = data.username
        if data.password is not None:
            update_data["password_hash"] = hash_password(data.password)
        
        professional = await self.professional_repository.update(uuid.UUID(professional_id), update_data)
        
        if not professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profissional não encontrado"
            )
        
        return {
            "id": str(professional.id),
            "email": professional.email,
            "name": professional.name,
            "function": professional.function,
            "role": professional.role.value,
            "created_at": professional.created_at,
            "updated_at": professional.updated_at,
        }
    
    async def delete_professional(self, professional_id: str) -> bool:
        success = await self.professional_repository.delete(uuid.UUID(professional_id))
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profissional não encontrado"
            )
        return True

