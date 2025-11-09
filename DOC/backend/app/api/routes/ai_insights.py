from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.ai_insight import (
    AIInsightCreate,
    AIInsightUpdate,
    AIInsightResponse,
    AIInsightListResponse,
)
from app.services.ai_insight_service import AIInsightService
from app.utils.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.models.ai_insight import InsightType, InsightPriority

router = APIRouter(prefix="/ai_insights", tags=["insights"])


@router.post("/", response_model=AIInsightResponse, status_code=status.HTTP_201_CREATED)
async def create_insight(
    data: AIInsightCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AIInsightService(db)
    return await service.create_insight(data)


@router.get("/", response_model=AIInsightListResponse)
async def list_insights(
    professional_id: str | None = None,
    student_id: str | None = None,
    insight_type: str | None = None,
    priority: str | None = None,
    is_read: bool | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AIInsightService(db)

    effective_professional_id = professional_id
    if current_user.role.value == "professional" and professional_id is None:
        effective_professional_id = str(current_user.id)

    parsed_insight_type = None
    parsed_priority = None

    if insight_type:
        try:
            parsed_insight_type = InsightType(insight_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tipo de insight inválido",
            )

    if priority:
        try:
            parsed_priority = InsightPriority(priority)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Prioridade inválida",
            )

    return await service.list_insights(
        professional_id=effective_professional_id,
        student_id=student_id,
        insight_type=parsed_insight_type,
        priority=parsed_priority,
        is_read=is_read,
        skip=skip,
        limit=limit,
    )


@router.get("/{insight_id}", response_model=AIInsightResponse)
async def get_insight(
    insight_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AIInsightService(db)
    insight = await service.get_insight(insight_id)
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight não encontrado",
        )
    return insight


@router.put("/{insight_id}", response_model=AIInsightResponse)
async def update_insight(
    insight_id: str,
    data: AIInsightUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AIInsightService(db)
    insight = await service.update_insight(insight_id, data)
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight não encontrado",
        )
    return insight


@router.delete("/{insight_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_insight(
    insight_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = AIInsightService(db)
    deleted = await service.delete_insight(insight_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight não encontrado",
        )
    return None

