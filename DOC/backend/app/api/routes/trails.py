from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.trail_service import TrailService
from app.schemas.trail import (
    TrailCreate,
    TrailUpdate,
    TrailResponse,
    TrailListResponse,
    TrailStoryCreate,
    TrailStoryUpdate,
    TrailStoryResponse,
)
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from app.models.trail import TrailDifficulty
from typing import Optional
import uuid

router = APIRouter(prefix="/trails", tags=["trilhas"])


@router.post("/", response_model=TrailResponse, status_code=status.HTTP_201_CREATED)
async def create_trail(
    data: TrailCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = TrailService(db)
    trail = await service.create_trail(data, current_user.id)
    return trail


@router.get("/", response_model=TrailListResponse)
async def list_trails(
    difficulty: Optional[str] = Query(None, description="Filtrar por dificuldade"),
    is_default: Optional[bool] = Query(None, description="Filtrar por trilhas padrão"),
    age_range_min: Optional[int] = Query(None, description="Idade mínima"),
    age_range_max: Optional[int] = Query(None, description="Idade máxima"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = TrailService(db)
    
    difficulty_enum = None
    if difficulty:
        try:
            difficulty_enum = TrailDifficulty(difficulty)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dificuldade inválida. Use: beginner, intermediate ou advanced"
            )
    
    filter_created_by = None
    if current_user.role.value == "professional" and not is_default:
        filter_created_by = current_user.id
    
    result = await service.get_all_trails(
        created_by=filter_created_by,
        difficulty=difficulty_enum,
        is_default=is_default,
        age_range_min=age_range_min,
        age_range_max=age_range_max,
    )
    return result


@router.get("/{trail_id}", response_model=TrailResponse)
async def get_trail(
    trail_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        trail_uuid = uuid.UUID(trail_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da trilha inválido"
        )
    
    service = TrailService(db)
    trail = await service.get_trail_by_id(trail_uuid)
    return trail


@router.put("/{trail_id}", response_model=TrailResponse)
async def update_trail(
    trail_id: str,
    data: TrailUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        trail_uuid = uuid.UUID(trail_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da trilha inválido"
        )
    
    service = TrailService(db)
    trail = await service.update_trail(trail_uuid, data, current_user.id)
    return trail


@router.delete("/{trail_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trail(
    trail_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        trail_uuid = uuid.UUID(trail_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da trilha inválido"
        )
    
    service = TrailService(db)
    await service.delete_trail(trail_uuid, current_user.id)
    return None


@router.post("/{trail_id}/stories", response_model=TrailStoryResponse, status_code=status.HTTP_201_CREATED)
async def create_story(
    trail_id: str,
    data: TrailStoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        trail_uuid = uuid.UUID(trail_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da trilha inválido"
        )
    
    service = TrailService(db)
    story_data = TrailStoryCreate(**data.model_dump(), trail_id=trail_id)
    story = await service.create_story(story_data, current_user.id)
    return story


@router.put("/stories/{story_id}", response_model=TrailStoryResponse)
async def update_story(
    story_id: str,
    data: TrailStoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        story_uuid = uuid.UUID(story_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da história inválido"
        )
    
    service = TrailService(db)
    story = await service.update_story(story_uuid, data, current_user.id)
    return story


@router.delete("/stories/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_story(
    story_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        story_uuid = uuid.UUID(story_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID da história inválido"
        )
    
    service = TrailService(db)
    await service.delete_story(story_uuid, current_user.id)
    return None

