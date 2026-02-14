from datetime import date
from typing import Optional, Sequence
from uuid import UUID

from sqlalchemy import and_, delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.report import Report, ReportType, ReportFormat


class ReportRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self,
        *,
        student_id: UUID,
        generated_by: UUID,
        report_type: ReportType,
        format: ReportFormat,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
        file_path: Optional[str] = None,
        file_url: Optional[str] = None,
    ) -> Report:
        report = Report(
            student_id=student_id,
            generated_by=generated_by,
            report_type=report_type,
            format=format,
            period_start=period_start,
            period_end=period_end,
            file_path=file_path,
            file_url=file_url,
        )
        self.session.add(report)
        await self.session.flush()
        await self.session.refresh(report)
        return report

    async def get_by_id(self, report_id: UUID) -> Optional[Report]:
        result = await self.session.execute(
            select(Report).where(Report.id == report_id)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        *,
        student_id: Optional[UUID] = None,
        report_type: Optional[ReportType] = None,
        report_format: Optional[ReportFormat] = None,
        generated_by: Optional[UUID] = None,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[Report]:
        query = select(Report)
        filters = []

        if student_id:
            filters.append(Report.student_id == student_id)
        if report_type:
            filters.append(Report.report_type == report_type)
        if report_format:
            filters.append(Report.format == report_format)
        if generated_by:
            filters.append(Report.generated_by == generated_by)
        if period_start:
            filters.append(Report.period_start >= period_start)
        if period_end:
            filters.append(Report.period_end <= period_end)

        if filters:
            query = query.where(and_(*filters))

        query = query.order_by(Report.generated_at.desc())

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
        report_type: Optional[ReportType] = None,
        report_format: Optional[ReportFormat] = None,
        generated_by: Optional[UUID] = None,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
    ) -> int:
        query = select(func.count()).select_from(Report)
        filters = []

        if student_id:
            filters.append(Report.student_id == student_id)
        if report_type:
            filters.append(Report.report_type == report_type)
        if report_format:
            filters.append(Report.format == report_format)
        if generated_by:
            filters.append(Report.generated_by == generated_by)
        if period_start:
            filters.append(Report.period_start >= period_start)
        if period_end:
            filters.append(Report.period_end <= period_end)

        if filters:
            query = query.where(and_(*filters))

        result = await self.session.execute(query)
        return result.scalar_one()

    async def update(
        self,
        report_id: UUID,
        *,
        report_type: Optional[ReportType] = None,
        report_format: Optional[ReportFormat] = None,
        period_start: Optional[date] = None,
        period_end: Optional[date] = None,
        file_path: Optional[str] = None,
        file_url: Optional[str] = None,
        updated_by: Optional[UUID] = None,
    ) -> Optional[Report]:
        update_data = {}

        if report_type is not None:
            update_data["report_type"] = report_type
        if report_format is not None:
            update_data["format"] = report_format
        if period_start is not None:
            update_data["period_start"] = period_start
        if period_end is not None:
            update_data["period_end"] = period_end
        if file_path is not None:
            update_data["file_path"] = file_path
        if file_url is not None:
            update_data["file_url"] = file_url
        if updated_by is not None:
            update_data["updated_by"] = updated_by

        if not update_data:
            return await self.get_by_id(report_id)

        await self.session.execute(
            update(Report)
            .where(Report.id == report_id)
            .values(**update_data)
        )
        await self.session.flush()
        return await self.get_by_id(report_id)

    async def delete(self, report_id: UUID) -> bool:
        result = await self.session.execute(
            delete(Report).where(Report.id == report_id)
        )
        return result.rowcount > 0

