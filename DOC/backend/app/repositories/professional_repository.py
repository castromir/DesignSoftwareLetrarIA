from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from typing import Optional
import uuid


class ProfessionalRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def create(self, user_data: dict) -> User:
        new_user = User(**user_data)
        self.session.add(new_user)
        await self.session.commit()
        await self.session.refresh(new_user)
        return new_user
    
    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(
                and_(
                    User.id == user_id,
                    User.role == UserRole.professional
                )
            )
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(
                and_(
                    User.email == email,
                    User.role == UserRole.professional
                )
            )
        )
        return result.scalar_one_or_none()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        result = await self.session.execute(
            select(User)
            .where(User.role == UserRole.professional)
            .offset(skip)
            .limit(limit)
            .order_by(User.created_at.desc())
        )
        return list(result.scalars().all())
    
    async def count_all(self) -> int:
        result = await self.session.execute(
            select(func.count(User.id)).where(User.role == UserRole.professional)
        )
        return result.scalar_one()
    
    async def count_active(self) -> int:
        return await self.count_all()
    
    async def update(self, user_id: uuid.UUID, update_data: dict) -> Optional[User]:
        result = await self.session.execute(
            select(User).where(
                and_(
                    User.id == user_id,
                    User.role == UserRole.professional
                )
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        for key, value in update_data.items():
            if value is not None:
                setattr(user, key, value)
        
        await self.session.commit()
        await self.session.refresh(user)
        return user
    
    async def delete(self, user_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            select(User).where(
                and_(
                    User.id == user_id,
                    User.role == UserRole.professional
                )
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return False
        
        await self.session.delete(user)
        await self.session.commit()
        return True

