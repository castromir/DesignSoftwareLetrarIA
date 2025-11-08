from sqlalchemy import select, update, delete, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.text_library import TextLibrary
from app.models.trail import TrailDifficulty
from typing import Optional, List
import uuid


class TextLibraryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_public: Optional[bool] = None,
        age_range_min: Optional[int] = None,
        age_range_max: Optional[int] = None,
        letters_focus: Optional[List[str]] = None,
    ) -> List[TextLibrary]:
        query = select(TextLibrary)
        
        conditions = []
        
        if created_by:
            conditions.append(
                or_(
                    TextLibrary.is_public == True,
                    TextLibrary.created_by == created_by
                )
            )
        elif is_public is None:
            conditions.append(TextLibrary.is_public == True)
        elif is_public is not None:
            conditions.append(TextLibrary.is_public == is_public)
        
        if difficulty:
            conditions.append(TextLibrary.difficulty == difficulty)
        
        if age_range_min is not None:
            conditions.append(
                or_(
                    TextLibrary.age_range_min.is_(None),
                    TextLibrary.age_range_min <= age_range_min
                )
            )
        
        if age_range_max is not None:
            conditions.append(
                or_(
                    TextLibrary.age_range_max.is_(None),
                    TextLibrary.age_range_max >= age_range_max
                )
            )
        
        if letters_focus:
            conditions.append(
                TextLibrary.letters_focus.overlap(letters_focus)
            )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, text_id: uuid.UUID) -> Optional[TextLibrary]:
        result = await self.session.execute(
            select(TextLibrary).where(TextLibrary.id == text_id)
        )
        return result.scalar_one_or_none()

    async def create(self, text_data: dict) -> TextLibrary:
        text = TextLibrary(**text_data)
        self.session.add(text)
        await self.session.commit()
        await self.session.refresh(text)
        return text

    async def update(self, text_id: uuid.UUID, text_data: dict) -> Optional[TextLibrary]:
        stmt = (
            update(TextLibrary)
            .where(TextLibrary.id == text_id)
            .values(**text_data)
            .returning(TextLibrary)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def delete(self, text_id: uuid.UUID) -> bool:
        stmt = delete(TextLibrary).where(TextLibrary.id == text_id).returning(TextLibrary)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def count_all(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_public: Optional[bool] = None,
    ) -> int:
        query = select(func.count(TextLibrary.id))
        
        conditions = []
        
        if created_by:
            conditions.append(
                or_(
                    TextLibrary.is_public == True,
                    TextLibrary.created_by == created_by
                )
            )
        elif is_public is None:
            conditions.append(TextLibrary.is_public == True)
        elif is_public is not None:
            conditions.append(TextLibrary.is_public == is_public)
        
        if difficulty:
            conditions.append(TextLibrary.difficulty == difficulty)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        result = await self.session.execute(query)
        return result.scalar_one()

