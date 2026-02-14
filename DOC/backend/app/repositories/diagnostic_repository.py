from typing import Optional, List, Sequence
from uuid import UUID

from sqlalchemy import select, update, delete, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.diagnostic import Diagnostic, DiagnosticType


class DiagnosticRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        student_id: UUID,
        conducted_by: UUID,
        diagnostic_type: DiagnosticType,
        overall_score: Optional[float] = None,
        reading_level: Optional[str] = None,
        strengths: Optional[List[object]] = None,
        difficulties: Optional[List[object]] = None,
        recommendations: Optional[str] = None,
        ai_insights: Optional[List[object]] = None,
    ) -> Diagnostic:
        diagnostic = Diagnostic(
            student_id=student_id,
            conducted_by=conducted_by,
            diagnostic_type=diagnostic_type,
            overall_score=overall_score,
            reading_level=reading_level,
            strengths=strengths,
            difficulties=difficulties,
            recommendations=recommendations,
            ai_insights=ai_insights,
        )
        self.session.add(diagnostic)
        await self.session.flush()
        await self.session.refresh(diagnostic)
        return diagnostic

    async def get_by_id(self, diagnostic_id: UUID) -> Optional[Diagnostic]:
        result = await self.session.execute(
            select(Diagnostic).where(Diagnostic.id == diagnostic_id)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        student_id: Optional[UUID] = None,
        conducted_by: Optional[UUID] = None,
        diagnostic_type: Optional[DiagnosticType] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Diagnostic]:
        query = select(Diagnostic)
        filters = []

        if student_id:
            filters.append(Diagnostic.student_id == student_id)
        if conducted_by:
            filters.append(Diagnostic.conducted_by == conducted_by)
        if diagnostic_type:
            filters.append(Diagnostic.diagnostic_type == diagnostic_type)

        if filters:
            query = query.where(and_(*filters))

        query = query.order_by(Diagnostic.created_at.desc())

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
        conducted_by: Optional[UUID] = None,
        diagnostic_type: Optional[DiagnosticType] = None,
    ) -> int:
        query = select(func.count()).select_from(Diagnostic)
        filters = []

        if student_id:
            filters.append(Diagnostic.student_id == student_id)
        if conducted_by:
            filters.append(Diagnostic.conducted_by == conducted_by)
        if diagnostic_type:
            filters.append(Diagnostic.diagnostic_type == diagnostic_type)

        if filters:
            query = query.where(and_(*filters))

        result = await self.session.execute(query)
        return result.scalar_one()

    async def update(
        self,
        diagnostic_id: UUID,
        *,
        diagnostic_type: Optional[DiagnosticType] = None,
        overall_score: Optional[float] = None,
        reading_level: Optional[str] = None,
        strengths: Optional[List[object]] = None,
        difficulties: Optional[List[object]] = None,
        recommendations: Optional[str] = None,
        ai_insights: Optional[List[object]] = None,
    ) -> Optional[Diagnostic]:
        update_data = {}

        if diagnostic_type is not None:
            update_data["diagnostic_type"] = diagnostic_type
        if overall_score is not None:
            update_data["overall_score"] = overall_score
        if reading_level is not None:
            update_data["reading_level"] = reading_level
        if strengths is not None:
            update_data["strengths"] = strengths
        if difficulties is not None:
            update_data["difficulties"] = difficulties
        if recommendations is not None:
            update_data["recommendations"] = recommendations
        if ai_insights is not None:
            update_data["ai_insights"] = ai_insights

        if not update_data:
            return await self.get_by_id(diagnostic_id)

        await self.session.execute(
            update(Diagnostic)
            .where(Diagnostic.id == diagnostic_id)
            .values(**update_data)
        )

        await self.session.flush()
        return await self.get_by_id(diagnostic_id)

    async def delete(self, diagnostic_id: UUID) -> bool:
        result = await self.session.execute(
            delete(Diagnostic).where(Diagnostic.id == diagnostic_id)
        )
        return result.rowcount > 0

