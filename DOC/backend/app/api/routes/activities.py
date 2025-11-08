from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.activity_service import ActivityService
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    ActivityListResponse,
)
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from typing import Optional
import uuid

router = APIRouter(prefix="/activities", tags=["atividades"])


@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity(
    data: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ActivityService(db)
    activity = await service.create_activity(current_user.id, data)
    return activity


@router.get("/", response_model=ActivityListResponse)
async def list_activities(
    professional_id: Optional[uuid.UUID] = Query(None),
    status: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ActivityService(db)
    user_dict = {
        "id": str(current_user.id),
        "role": current_user.role.value
    }
    result = await service.list_activities(
        user_dict,
        professional_id,
        status,
        skip,
        limit
    )
    return result


@router.get("/{activity_id}", response_model=ActivityResponse)
async def get_activity(
    activity_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ActivityService(db)
    user_dict = {
        "id": str(current_user.id),
        "role": current_user.role.value
    }
    activity = await service.get_activity_by_id(activity_id, user_dict)
    return activity


@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: str,
    data: ActivityUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ActivityService(db)
    user_dict = {
        "id": str(current_user.id),
        "role": current_user.role.value
    }
    activity = await service.update_activity(activity_id, data, user_dict)
    return activity


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    activity_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ActivityService(db)
    user_dict = {
        "id": str(current_user.id),
        "role": current_user.role.value
    }
    await service.delete_activity(activity_id, user_dict)
    return None

