from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.activity import ActivityStatus
from app.models.user import User
from app.schemas.student_activity import (
    StudentActivityCreate,
    StudentActivityUpdate,
    StudentActivityResponse,
    StudentActivityListResponse,
)
from app.services.student_activity_service import StudentActivityService
from app.utils.dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/student_activities", tags=["atividades dos alunos"])


@router.post("/", response_model=StudentActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_student_activity(
    data: StudentActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentActivityService(db)
    return await service.create_student_activity(data)


@router.get("/", response_model=StudentActivityListResponse)
async def list_student_activities(
    student_id: str | None = None,
    activity_id: str | None = None,
    status: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentActivityService(db)

    parsed_status = None
    if status:
        try:
            parsed_status = ActivityStatus(status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status inválido",
            )

    return await service.list_student_activities(
        student_id=student_id,
        activity_id=activity_id,
        status=parsed_status.value if parsed_status else None,
        skip=skip,
        limit=limit,
    )


@router.get("/{student_activity_id}", response_model=StudentActivityResponse)
async def get_student_activity(
    student_activity_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentActivityService(db)
    student_activity = await service.get_student_activity(student_activity_id)
    if not student_activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atividade do aluno não encontrada",
        )
    return student_activity


@router.put("/{student_activity_id}", response_model=StudentActivityResponse)
async def update_student_activity(
    student_activity_id: str,
    data: StudentActivityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentActivityService(db)
    student_activity = await service.update_student_activity(student_activity_id, data)
    if not student_activity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atividade do aluno não encontrada",
        )
    return student_activity


@router.delete("/{student_activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student_activity(
    student_activity_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentActivityService(db)
    deleted = await service.delete_student_activity(student_activity_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atividade do aluno não encontrada",
        )
    return None

