from typing import Optional, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_insight import InsightType, InsightPriority
from app.repositories.ai_insight_repository import AIInsightRepository
from app.schemas.ai_insight import (
    AIInsightCreate,
    AIInsightUpdate,
    AIInsightResponse,
    AIInsightListResponse,
)


class AIInsightService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = AIInsightRepository(session)

    @staticmethod
    def _parse_uuid(value: Optional[str]) -> Optional[UUID]:
        if not value:
            return None
        return UUID(value)

    @staticmethod
    def _parse_uuid_list(values: Optional[List[str]]) -> Optional[List[UUID]]:
        if values is None:
            return None
        return [UUID(v) for v in values]

    @staticmethod
    def _to_response(insight) -> AIInsightResponse:
        return AIInsightResponse(
            id=str(insight.id),
            professional_id=str(insight.professional_id),
            insight_type=insight.insight_type,
            priority=insight.priority,
            title=insight.title,
            description=insight.description,
            related_students=[str(s) for s in insight.related_students or []],
            is_read=insight.is_read,
            created_at=insight.created_at,
            expires_at=insight.expires_at,
        )

    async def create_insight(self, data: AIInsightCreate) -> AIInsightResponse:
        insight = await self.repository.create(
            professional_id=UUID(data.professional_id),
            insight_type=data.insight_type,
            priority=data.priority,
            title=data.title,
            description=data.description,
            related_students=self._parse_uuid_list(data.related_students),
            expires_at=data.expires_at,
            is_read=data.is_read,
        )
        await self.session.commit()
        return self._to_response(insight)

    async def list_insights(
        self,
        *,
        professional_id: Optional[str] = None,
        student_id: Optional[str] = None,
        insight_type: Optional[InsightType] = None,
        priority: Optional[InsightPriority] = None,
        is_read: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> AIInsightListResponse:
        insights = await self.repository.list(
            professional_id=self._parse_uuid(professional_id),
            student_id=self._parse_uuid(student_id),
            insight_type=insight_type,
            priority=priority,
            is_read=is_read,
            skip=skip,
            limit=limit,
        )
        total = await self.repository.count(
            professional_id=self._parse_uuid(professional_id),
            student_id=self._parse_uuid(student_id),
            insight_type=insight_type,
            priority=priority,
            is_read=is_read,
        )
        responses = [self._to_response(item) for item in insights]
        return AIInsightListResponse(insights=responses, total=total)

    async def get_insight(self, insight_id: str) -> Optional[AIInsightResponse]:
        insight = await self.repository.get_by_id(UUID(insight_id))
        if not insight:
            return None
        return self._to_response(insight)

    async def update_insight(
        self,
        insight_id: str,
        data: AIInsightUpdate,
    ) -> Optional[AIInsightResponse]:
        insight = await self.repository.update(
            insight_id=UUID(insight_id),
            insight_type=data.insight_type,
            priority=data.priority,
            title=data.title,
            description=data.description,
            related_students=self._parse_uuid_list(data.related_students),
            expires_at=data.expires_at,
            is_read=data.is_read,
        )
        if not insight:
            return None
        await self.session.commit()
        return self._to_response(insight)

    async def delete_insight(self, insight_id: str) -> bool:
        deleted = await self.repository.delete(UUID(insight_id))
        if deleted:
            await self.session.commit()
        return deleted

