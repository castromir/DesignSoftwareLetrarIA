from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity import ActivityStatus
from app.repositories.student_activity_repository import StudentActivityRepository
from app.schemas.student_activity import (
    StudentActivityCreate,
    StudentActivityUpdate,
    StudentActivityResponse,
    StudentActivityListResponse,
    ActivitySummary,
)


class StudentActivityService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = StudentActivityRepository(session)

    @staticmethod
    def _parse_uuid(value: Optional[str]) -> Optional[UUID]:
        if not value:
            return None
        return UUID(value)

    @staticmethod
    def _to_response(student_activity) -> StudentActivityResponse:
        activity_summary = None
        if student_activity.activity:
            activity_summary = ActivitySummary(
                id=str(student_activity.activity.id),
                title=student_activity.activity.title,
                type=student_activity.activity.type,
                difficulty=student_activity.activity.difficulty,
                scheduled_date=student_activity.activity.scheduled_date,
                scheduled_time=student_activity.activity.scheduled_time,
            )
        return StudentActivityResponse(
            id=str(student_activity.id),
            student_id=str(student_activity.student_id),
            activity_id=str(student_activity.activity_id),
            status=student_activity.status,
            score=student_activity.score,
            notes=student_activity.notes,
            completed_at=student_activity.completed_at,
            activity=activity_summary,
        )

    async def create_student_activity(
        self,
        data: StudentActivityCreate,
    ) -> StudentActivityResponse:
        student_activity = await self.repository.create(
            student_id=UUID(data.student_id),
            activity_id=UUID(data.activity_id),
            status=data.status,
            score=data.score,
            notes=data.notes,
            completed_at=data.completed_at,
        )
        await self.session.commit()
        return self._to_response(student_activity)

    async def list_student_activities(
        self,
        *,
        student_id: Optional[str] = None,
        activity_id: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> StudentActivityListResponse:
        parsed_status = ActivityStatus(status) if status else None
        student_activities = await self.repository.list(
            student_id=self._parse_uuid(student_id),
            activity_id=self._parse_uuid(activity_id),
            status=parsed_status,
            skip=skip,
            limit=limit,
        )
        total = await self.repository.count(
            student_id=self._parse_uuid(student_id),
            activity_id=self._parse_uuid(activity_id),
            status=parsed_status,
        )
        responses = [self._to_response(item) for item in student_activities]
        return StudentActivityListResponse(student_activities=responses, total=total)

    async def get_student_activity(self, student_activity_id: str) -> Optional[StudentActivityResponse]:
        student_activity = await self.repository.get_by_id(UUID(student_activity_id))
        if not student_activity:
            return None
        return self._to_response(student_activity)

    async def update_student_activity(
        self,
        student_activity_id: str,
        data: StudentActivityUpdate,
    ) -> Optional[StudentActivityResponse]:
        completed_at = data.completed_at
        if data.status == ActivityStatus.completed and completed_at is None:
            completed_at = datetime.utcnow()

        student_activity = await self.repository.update(
            student_activity_id=UUID(student_activity_id),
            status=data.status,
            score=data.score,
            notes=data.notes,
            completed_at=completed_at,
        )
        if not student_activity:
            return None
        await self.session.commit()
        return self._to_response(student_activity)

    async def delete_student_activity(self, student_activity_id: str) -> bool:
        deleted = await self.repository.delete(UUID(student_activity_id))
        if deleted:
            await self.session.commit()
        return deleted

