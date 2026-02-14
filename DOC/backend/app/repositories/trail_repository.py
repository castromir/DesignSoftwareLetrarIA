from sqlalchemy import select, update, delete, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.trail import Trail, TrailStory, TrailDifficulty
from typing import Optional, List
import uuid


class TrailRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_default: Optional[bool] = None,
        age_range_min: Optional[int] = None,
        age_range_max: Optional[int] = None,
    ) -> List[Trail]:
        query = select(Trail)
        
        conditions = []
        
        if created_by and not (is_default is True):
            conditions.append(Trail.created_by == created_by)
        
        if difficulty:
            conditions.append(Trail.difficulty == difficulty)
        
        if is_default is not None:
            conditions.append(Trail.is_default == is_default)
        
        if age_range_min is not None and age_range_max is not None and age_range_min == age_range_max:
            student_age = age_range_min
            conditions.append(
                or_(
                    and_(
                        Trail.age_range_min.is_(None),
                        Trail.age_range_max.is_(None)
                    ),
                    and_(
                        or_(Trail.age_range_min.is_(None), Trail.age_range_min <= student_age),
                        or_(Trail.age_range_max.is_(None), Trail.age_range_max >= student_age)
                    )
                )
            )
        else:
            if age_range_min is not None and age_range_max is not None:
                conditions.append(
                    or_(
                        and_(
                            Trail.age_range_min.is_(None),
                            Trail.age_range_max.is_(None)
                        ),
                        and_(
                            or_(Trail.age_range_min.is_(None), Trail.age_range_min <= age_range_max),
                            or_(Trail.age_range_max.is_(None), Trail.age_range_max >= age_range_min)
                        )
                    )
                )
            elif age_range_min is not None:
                conditions.append(
                    or_(
                        Trail.age_range_max.is_(None),
                        Trail.age_range_max >= age_range_min
                    )
                )
            elif age_range_max is not None:
                conditions.append(
                    or_(
                        Trail.age_range_min.is_(None),
                        Trail.age_range_min <= age_range_max
                    )
                )
        
        if conditions:
            query = query.where(and_(*conditions))
        
        query = query.order_by(Trail.created_at.desc())
        
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, trail_id: uuid.UUID) -> Optional[Trail]:
        result = await self.session.execute(
            select(Trail).where(Trail.id == trail_id)
        )
        return result.scalar_one_or_none()

    async def create(self, trail_data: dict) -> Trail:
        trail = Trail(**trail_data)
        self.session.add(trail)
        await self.session.commit()
        await self.session.refresh(trail)
        return trail

    async def update(self, trail_id: uuid.UUID, trail_data: dict) -> Optional[Trail]:
        stmt = (
            update(Trail)
            .where(Trail.id == trail_id)
            .values(**trail_data)
            .returning(Trail)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def delete(self, trail_id: uuid.UUID) -> bool:
        stmt = delete(Trail).where(Trail.id == trail_id).returning(Trail)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def count_all(
        self,
        created_by: Optional[uuid.UUID] = None,
        difficulty: Optional[TrailDifficulty] = None,
        is_default: Optional[bool] = None,
    ) -> int:
        query = select(func.count(Trail.id))
        
        conditions = []
        
        if created_by:
            conditions.append(Trail.created_by == created_by)
        
        if difficulty:
            conditions.append(Trail.difficulty == difficulty)
        
        if is_default is not None:
            conditions.append(Trail.is_default == is_default)
        
        if conditions:
            query = query.where(and_(*conditions))
        
        result = await self.session.execute(query)
        return result.scalar_one()


class TrailStoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_by_trail(self, trail_id: uuid.UUID) -> List[TrailStory]:
        query = (
            select(TrailStory)
            .where(TrailStory.trail_id == trail_id)
            .order_by(TrailStory.order_position.asc())
        )
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, story_id: uuid.UUID) -> Optional[TrailStory]:
        result = await self.session.execute(
            select(TrailStory).where(TrailStory.id == story_id)
        )
        return result.scalar_one_or_none()

    async def create(self, story_data: dict) -> TrailStory:
        story = TrailStory(**story_data)
        self.session.add(story)
        await self.session.commit()
        await self.session.refresh(story)
        return story

    async def create_batch(self, stories_data: List[dict]) -> List[TrailStory]:
        stories = [TrailStory(**data) for data in stories_data]
        self.session.add_all(stories)
        await self.session.commit()
        for story in stories:
            await self.session.refresh(story)
        return stories

    async def update(self, story_id: uuid.UUID, story_data: dict) -> Optional[TrailStory]:
        stmt = (
            update(TrailStory)
            .where(TrailStory.id == story_id)
            .values(**story_data)
            .returning(TrailStory)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def delete(self, story_id: uuid.UUID) -> bool:
        stmt = delete(TrailStory).where(TrailStory.id == story_id).returning(TrailStory)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount > 0

    async def delete_by_trail(self, trail_id: uuid.UUID) -> int:
        stmt = delete(TrailStory).where(TrailStory.trail_id == trail_id).returning(TrailStory)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount

