from datetime import datetime
from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import and_, delete, select, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.activity import ActivityStatus, StudentActivity


class StudentActivityRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        *,
        student_id: UUID,
        activity_id: UUID,
        status: ActivityStatus = ActivityStatus.pending,
        score: Optional[float] = None,
        notes: Optional[str] = None,
        completed_at: Optional[datetime] = None,
    ) -> StudentActivity:
        student_activity = StudentActivity(
            student_id=student_id,
            activity_id=activity_id,
            status=status,
            score=score,
            notes=notes,
            completed_at=completed_at,
        )
        self.session.add(student_activity)
        await self.session.flush()
        await self.session.refresh(student_activity)
        return student_activity

    async def get_by_id(self, student_activity_id: UUID) -> Optional[StudentActivity]:
        result = await self.session.execute(
            select(StudentActivity)
            .options(selectinload(StudentActivity.activity))
            .where(StudentActivity.id == student_activity_id)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        student_id: Optional[UUID] = None,
        activity_id: Optional[UUID] = None,
        status: Optional[ActivityStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[StudentActivity]:
        query = select(StudentActivity).options(selectinload(StudentActivity.activity))
        filters = []

        if student_id:
            filters.append(StudentActivity.student_id == student_id)
        if activity_id:
            filters.append(StudentActivity.activity_id == activity_id)
        if status:
            filters.append(StudentActivity.status == status)

        if filters:
            query = query.where(and_(*filters))

        query = query.order_by(StudentActivity.completed_at.desc().nullslast(), StudentActivity.id.desc())

        if skip:
            query = query.offset(skip)
        if limit:
            query = query.limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def count(
        self,
        *,
        student_id: Optional[UUID] = None,
        activity_id: Optional[UUID] = None,
        status: Optional[ActivityStatus] = None,
    ) -> int:
        query = select(func.count(StudentActivity.id))
        filters = []

        if student_id:
            filters.append(StudentActivity.student_id == student_id)
        if activity_id:
            filters.append(StudentActivity.activity_id == activity_id)
        if status:
            filters.append(StudentActivity.status == status)

        if filters:
            query = query.where(and_(*filters))

        result = await self.session.execute(query)
        return result.scalar_one()

    async def update(
        self,
        student_activity_id: UUID,
        *,
        status: Optional[ActivityStatus] = None,
        score: Optional[float] = None,
        notes: Optional[str] = None,
        completed_at: Optional[datetime] = None,
    ) -> Optional[StudentActivity]:
        update_data = {}

        if status is not None:
            update_data["status"] = status
        if score is not None:
            update_data["score"] = score
        if notes is not None:
            update_data["notes"] = notes
        if completed_at is not None:
            update_data["completed_at"] = completed_at

        if not update_data:
            return await self.get_by_id(student_activity_id)

        await self.session.execute(
            update(StudentActivity)
            .where(StudentActivity.id == student_activity_id)
            .values(**update_data)
        )
        await self.session.flush()
        return await self.get_by_id(student_activity_id)

    async def delete(self, student_activity_id: UUID) -> bool:
        result = await self.session.execute(
            delete(StudentActivity).where(StudentActivity.id == student_activity_id)
        )
        return result.rowcount > 0

