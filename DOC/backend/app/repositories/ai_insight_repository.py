from typing import Optional, List, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_insight import AIInsight, InsightType, InsightPriority


class AIInsightRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        professional_id: UUID,
        insight_type: InsightType,
        priority: InsightPriority,
        title: str,
        description: str,
        related_students: Optional[List[UUID]] = None,
        expires_at: Optional = None,
        is_read: bool = False,
    ) -> AIInsight:
        insight = AIInsight(
            professional_id=professional_id,
            insight_type=insight_type,
            priority=priority,
            title=title,
            description=description,
            related_students=related_students or [],
            expires_at=expires_at,
            is_read=is_read,
        )
        self.session.add(insight)
        await self.session.flush()
        await self.session.refresh(insight)
        return insight

    async def get_by_id(self, insight_id: UUID) -> Optional[AIInsight]:
        result = await self.session.execute(
            select(AIInsight).where(AIInsight.id == insight_id)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        professional_id: Optional[UUID] = None,
        student_id: Optional[UUID] = None,
        insight_type: Optional[InsightType] = None,
        priority: Optional[InsightPriority] = None,
        is_read: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[AIInsight]:
        query = select(AIInsight)

        filters = []
        if professional_id:
            filters.append(AIInsight.professional_id == professional_id)
        if student_id:
            filters.append(
                AIInsight.related_students.isnot(None),
            )
            filters.append(AIInsight.related_students.contains([student_id]))
        if insight_type:
            filters.append(AIInsight.insight_type == insight_type)
        if priority:
            filters.append(AIInsight.priority == priority)
        if is_read is not None:
            filters.append(AIInsight.is_read == is_read)

        if filters:
            query = query.where(and_(*filters))

        query = query.order_by(AIInsight.created_at.desc())
        if skip:
            query = query.offset(skip)
        if limit:
            query = query.limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def count(
        self,
        *,
        professional_id: Optional[UUID] = None,
        student_id: Optional[UUID] = None,
        insight_type: Optional[InsightType] = None,
        priority: Optional[InsightPriority] = None,
        is_read: Optional[bool] = None,
    ) -> int:
        query = select(func.count()).select_from(AIInsight)

        filters = []
        if professional_id:
            filters.append(AIInsight.professional_id == professional_id)
        if student_id:
            filters.append(
                AIInsight.related_students.isnot(None),
            )
            filters.append(AIInsight.related_students.contains([student_id]))
        if insight_type:
            filters.append(AIInsight.insight_type == insight_type)
        if priority:
            filters.append(AIInsight.priority == priority)
        if is_read is not None:
            filters.append(AIInsight.is_read == is_read)

        if filters:
            query = query.where(and_(*filters))

        result = await self.session.execute(query)
        return result.scalar_one()

    async def update(
        self,
        insight_id: UUID,
        *,
        insight_type: Optional[InsightType] = None,
        priority: Optional[InsightPriority] = None,
        title: Optional[str] = None,
        description: Optional[str] = None,
        related_students: Optional[List[UUID]] = None,
        expires_at=None,
        is_read: Optional[bool] = None,
    ) -> Optional[AIInsight]:
        update_data = {}
        if insight_type is not None:
            update_data["insight_type"] = insight_type
        if priority is not None:
            update_data["priority"] = priority
        if title is not None:
            update_data["title"] = title
        if description is not None:
            update_data["description"] = description
        if related_students is not None:
            update_data["related_students"] = related_students
        if expires_at is not None:
            update_data["expires_at"] = expires_at
        if is_read is not None:
            update_data["is_read"] = is_read

        if not update_data:
            return await self.get_by_id(insight_id)

        await self.session.execute(
            update(AIInsight)
            .where(AIInsight.id == insight_id)
            .values(**update_data)
        )
        await self.session.flush()
        return await self.get_by_id(insight_id)

    async def delete(self, insight_id: UUID) -> bool:
        result = await self.session.execute(
            delete(AIInsight).where(AIInsight.id == insight_id)
        )
        return result.rowcount > 0

