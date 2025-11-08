from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.activity_repository import ActivityRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityResponse, ActivityListResponse
from app.models.activity import ActivityStatus
from app.models.user import UserRole
from typing import Optional
import uuid


class ActivityService:
    def __init__(self, session: AsyncSession):
        self.activity_repository = ActivityRepository(session)
        self.student_repository = StudentRepository(session)

    async def create_activity(
        self,
        professional_id: uuid.UUID,
        data: ActivityCreate
    ) -> ActivityResponse:
        if not data.student_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="É necessário selecionar pelo menos um aluno"
            )

        student_uuids = []
        for student_id_str in data.student_ids:
            try:
                student_uuid = uuid.UUID(student_id_str)
                student = await self.student_repository.get_by_id(student_uuid)
                if not student:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Aluno não encontrado: {student_id_str}"
                    )
                student_uuids.append(student_uuid)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"ID de aluno inválido: {student_id_str}"
                )

        activity_data = data.model_dump(exclude={"student_ids"})
        activity_data["created_by"] = professional_id
        activity_data["status"] = activity_data.get("status", ActivityStatus.pending)

        activity = await self.activity_repository.create(activity_data, student_uuids)

        activity_student_ids = await self.activity_repository.get_student_ids(activity.id)

        return ActivityResponse(
            id=str(activity.id),
            title=activity.title,
            description=activity.description,
            type=activity.type,
            difficulty=activity.difficulty,
            scheduled_date=activity.scheduled_date,
            scheduled_time=activity.scheduled_time,
            words=activity.words,
            status=activity.status,
            created_by=str(activity.created_by),
            created_at=activity.created_at,
            updated_by=str(activity.updated_by) if activity.updated_by else None,
            updated_at=activity.updated_at,
            student_ids=[str(sid) for sid in activity_student_ids],
        )

    async def list_activities(
        self,
        current_user: dict,
        professional_id: Optional[uuid.UUID] = None,
        status_filter: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> ActivityListResponse:
        user_id = uuid.UUID(current_user["id"])
        user_role = current_user["role"]

        if user_role == UserRole.professional.value:
            if professional_id and professional_id != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Acesso negado a atividades de outros profissionais"
                )
            filter_professional_id = user_id
        elif user_role == UserRole.admin.value:
            filter_professional_id = professional_id
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado"
            )

        status_enum = None
        if status_filter:
            try:
                status_enum = ActivityStatus(status_filter)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Status inválido: {status_filter}"
                )

        activities = await self.activity_repository.get_all(
            filter_professional_id,
            status_enum,
            skip,
            limit
        )

        activities_with_students = []
        for activity in activities:
            student_ids = await self.activity_repository.get_student_ids(activity.id)
            activities_with_students.append(
                ActivityResponse(
                    id=str(activity.id),
                    title=activity.title,
                    description=activity.description,
                    type=activity.type,
                    difficulty=activity.difficulty,
                    scheduled_date=activity.scheduled_date,
                    scheduled_time=activity.scheduled_time,
                    words=activity.words,
                    status=activity.status,
                    created_by=str(activity.created_by),
                    created_at=activity.created_at,
                    updated_by=str(activity.updated_by) if activity.updated_by else None,
                    updated_at=activity.updated_at,
                    student_ids=[str(sid) for sid in student_ids],
                )
            )

        total = await self.activity_repository.count_all(filter_professional_id)
        pending = await self.activity_repository.count_by_status(
            ActivityStatus.pending,
            filter_professional_id
        )
        in_progress = await self.activity_repository.count_by_status(
            ActivityStatus.in_progress,
            filter_professional_id
        )
        completed = await self.activity_repository.count_by_status(
            ActivityStatus.completed,
            filter_professional_id
        )

        return ActivityListResponse(
            total=total,
            pending=pending,
            in_progress=in_progress,
            completed=completed,
            activities=activities_with_students,
        )

    async def get_activity_by_id(
        self,
        activity_id: uuid.UUID | str,
        current_user: dict
    ) -> ActivityResponse:
        if isinstance(activity_id, str):
            activity_id = uuid.UUID(activity_id)

        activity = await self.activity_repository.get_by_id(activity_id)
        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Atividade não encontrada"
            )

        user_id = uuid.UUID(current_user["id"])
        user_role = current_user["role"]

        if user_role == UserRole.professional.value and activity.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado a esta atividade"
            )

        student_ids = await self.activity_repository.get_student_ids(activity.id)

        return ActivityResponse(
            id=str(activity.id),
            title=activity.title,
            description=activity.description,
            type=activity.type,
            difficulty=activity.difficulty,
            scheduled_date=activity.scheduled_date,
            scheduled_time=activity.scheduled_time,
            words=activity.words,
            status=activity.status,
            created_by=str(activity.created_by),
            created_at=activity.created_at,
            updated_by=str(activity.updated_by) if activity.updated_by else None,
            updated_at=activity.updated_at,
            student_ids=[str(sid) for sid in student_ids],
        )

    async def update_activity(
        self,
        activity_id: uuid.UUID | str,
        data: ActivityUpdate,
        current_user: dict
    ) -> ActivityResponse:
        if isinstance(activity_id, str):
            activity_id = uuid.UUID(activity_id)

        existing_activity = await self.activity_repository.get_by_id(activity_id)
        if not existing_activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Atividade não encontrada"
            )

        user_id = uuid.UUID(current_user["id"])
        user_role = current_user["role"]

        if user_role == UserRole.professional.value and existing_activity.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado a esta atividade"
            )

        update_data = data.model_dump(exclude_unset=True, exclude={"student_ids"})
        student_ids_uuid = None

        if data.student_ids is not None:
            student_ids_uuid = []
            for student_id_str in data.student_ids:
                try:
                    student_uuid = uuid.UUID(student_id_str)
                    student = await self.student_repository.get_by_id(student_uuid)
                    if not student:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Aluno não encontrado: {student_id_str}"
                        )
                    student_ids_uuid.append(student_uuid)
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"ID de aluno inválido: {student_id_str}"
                    )

        updated_activity = await self.activity_repository.update(
            activity_id,
            update_data,
            student_ids_uuid,
            user_id
        )

        if not updated_activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Atividade não encontrada"
            )

        student_ids = await self.activity_repository.get_student_ids(updated_activity.id)

        return ActivityResponse(
            id=str(updated_activity.id),
            title=updated_activity.title,
            description=updated_activity.description,
            type=updated_activity.type,
            difficulty=updated_activity.difficulty,
            scheduled_date=updated_activity.scheduled_date,
            scheduled_time=updated_activity.scheduled_time,
            words=updated_activity.words,
            status=updated_activity.status,
            created_by=str(updated_activity.created_by),
            created_at=updated_activity.created_at,
            updated_by=str(updated_activity.updated_by) if updated_activity.updated_by else None,
            updated_at=updated_activity.updated_at,
            student_ids=[str(sid) for sid in student_ids],
        )

    async def delete_activity(
        self,
        activity_id: uuid.UUID | str,
        current_user: dict
    ) -> None:
        if isinstance(activity_id, str):
            activity_id = uuid.UUID(activity_id)

        activity = await self.activity_repository.get_by_id(activity_id)
        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Atividade não encontrada"
            )

        user_id = uuid.UUID(current_user["id"])
        user_role = current_user["role"]

        if user_role == UserRole.professional.value and activity.created_by != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado a esta atividade"
            )

        deleted = await self.activity_repository.delete(activity_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Atividade não encontrada"
            )

