from datetime import date
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.report import ReportType, ReportFormat
from app.repositories.report_repository import ReportRepository
from app.schemas.report import (
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportListResponse,
)


class ReportService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = ReportRepository(session)

    @staticmethod
    def _parse_uuid(value: Optional[str]) -> Optional[UUID]:
        if not value:
            return None
        return UUID(value)

    @staticmethod
    def _parse_date(value: Optional[str]) -> Optional[date]:
        if not value:
            return None
        return date.fromisoformat(value)

    @staticmethod
    def _to_response(report) -> ReportResponse:
        return ReportResponse(
            id=str(report.id),
            student_id=str(report.student_id),
            generated_by=str(report.generated_by),
            report_type=report.report_type,
            format=report.format,
            period_start=report.period_start,
            period_end=report.period_end,
            file_path=report.file_path,
            file_url=report.file_url,
            generated_at=report.generated_at,
            updated_by=str(report.updated_by) if report.updated_by else None,
            updated_at=report.updated_at,
        )

    async def create_report(
        self,
        data: ReportCreate,
        generated_by: str,
    ) -> ReportResponse:
        report = await self.repository.create(
            student_id=UUID(data.student_id),
            generated_by=UUID(generated_by),
            report_type=data.report_type,
            format=data.format,
            period_start=data.period_start,
            period_end=data.period_end,
            file_path=data.file_path,
            file_url=data.file_url,
        )
        await self.session.commit()
        return self._to_response(report)

    async def list_reports(
        self,
        *,
        student_id: Optional[str] = None,
        report_type: Optional[str] = None,
        report_format: Optional[str] = None,
        generated_by: Optional[str] = None,
        period_start: Optional[str] = None,
        period_end: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> ReportListResponse:
        parsed_type = ReportType(report_type) if report_type else None
        parsed_format = ReportFormat(report_format) if report_format else None

        reports = await self.repository.list(
            student_id=self._parse_uuid(student_id),
            report_type=parsed_type,
            report_format=parsed_format,
            generated_by=self._parse_uuid(generated_by),
            period_start=self._parse_date(period_start),
            period_end=self._parse_date(period_end),
            skip=skip,
            limit=limit,
        )
        total = await self.repository.count(
            student_id=self._parse_uuid(student_id),
            report_type=parsed_type,
            report_format=parsed_format,
            generated_by=self._parse_uuid(generated_by),
            period_start=self._parse_date(period_start),
            period_end=self._parse_date(period_end),
        )
        responses = [self._to_response(item) for item in reports]
        return ReportListResponse(reports=responses, total=total)

    async def get_report(self, report_id: str) -> Optional[ReportResponse]:
        report = await self.repository.get_by_id(UUID(report_id))
        if not report:
            return None
        return self._to_response(report)

    async def update_report(
        self,
        report_id: str,
        data: ReportUpdate,
        updated_by: Optional[str],
    ) -> Optional[ReportResponse]:
        report = await self.repository.update(
            report_id=UUID(report_id),
            report_type=data.report_type,
            report_format=data.format,
            period_start=data.period_start,
            period_end=data.period_end,
            file_path=data.file_path,
            file_url=data.file_url,
            updated_by=UUID(updated_by) if updated_by else None,
        )
        if not report:
            return None
        await self.session.commit()
        return self._to_response(report)

    async def delete_report(self, report_id: str) -> bool:
        deleted = await self.repository.delete(UUID(report_id))
        if deleted:
            await self.session.commit()
        return deleted

