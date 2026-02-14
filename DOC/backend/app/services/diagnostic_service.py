from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.diagnostic import DiagnosticType
from app.repositories.diagnostic_repository import DiagnosticRepository
from app.schemas.diagnostic import (
    DiagnosticCreate,
    DiagnosticUpdate,
    DiagnosticResponse,
    DiagnosticListResponse,
)


class DiagnosticService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = DiagnosticRepository(session)

    @staticmethod
    def _parse_uuid(value: Optional[str]) -> Optional[UUID]:
        if not value:
            return None
        return UUID(value)

    @staticmethod
    def _to_response(diagnostic) -> DiagnosticResponse:
        return DiagnosticResponse(
            id=str(diagnostic.id),
            student_id=str(diagnostic.student_id),
            conducted_by=str(diagnostic.conducted_by),
            diagnostic_type=diagnostic.diagnostic_type,
            overall_score=diagnostic.overall_score,
            reading_level=diagnostic.reading_level,
            strengths=diagnostic.strengths,
            difficulties=diagnostic.difficulties,
            recommendations=diagnostic.recommendations,
            ai_insights=diagnostic.ai_insights,
            created_at=diagnostic.created_at,
        )

    async def create_diagnostic(self, data: DiagnosticCreate) -> DiagnosticResponse:
        diagnostic = await self.repository.create(
            student_id=UUID(data.student_id),
            conducted_by=UUID(data.conducted_by),
            diagnostic_type=data.diagnostic_type,
            overall_score=data.overall_score,
            reading_level=data.reading_level,
            strengths=data.strengths,
            difficulties=data.difficulties,
            recommendations=data.recommendations,
            ai_insights=data.ai_insights,
        )
        await self.session.commit()
        return self._to_response(diagnostic)

    async def list_diagnostics(
        self,
        *,
        student_id: Optional[str] = None,
        conducted_by: Optional[str] = None,
        diagnostic_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> DiagnosticListResponse:
        parsed_type = None
        if diagnostic_type:
            parsed_type = DiagnosticType(diagnostic_type)

        diagnostics = await self.repository.list(
            student_id=self._parse_uuid(student_id),
            conducted_by=self._parse_uuid(conducted_by),
            diagnostic_type=parsed_type,
            skip=skip,
            limit=limit,
        )
        total = await self.repository.count(
            student_id=self._parse_uuid(student_id),
            conducted_by=self._parse_uuid(conducted_by),
            diagnostic_type=parsed_type,
        )
        responses = [self._to_response(item) for item in diagnostics]
        return DiagnosticListResponse(diagnostics=responses, total=total)

    async def get_diagnostic(self, diagnostic_id: str) -> Optional[DiagnosticResponse]:
        diagnostic = await self.repository.get_by_id(UUID(diagnostic_id))
        if not diagnostic:
            return None
        return self._to_response(diagnostic)

    async def update_diagnostic(
        self,
        diagnostic_id: str,
        data: DiagnosticUpdate,
    ) -> Optional[DiagnosticResponse]:
        diagnostic = await self.repository.update(
            diagnostic_id=UUID(diagnostic_id),
            diagnostic_type=data.diagnostic_type,
            overall_score=data.overall_score,
            reading_level=data.reading_level,
            strengths=data.strengths,
            difficulties=data.difficulties,
            recommendations=data.recommendations,
            ai_insights=data.ai_insights,
        )
        if not diagnostic:
            return None
        await self.session.commit()
        return self._to_response(diagnostic)

    async def delete_diagnostic(self, diagnostic_id: str) -> bool:
        deleted = await self.repository.delete(UUID(diagnostic_id))
        if deleted:
            await self.session.commit()
        return deleted

