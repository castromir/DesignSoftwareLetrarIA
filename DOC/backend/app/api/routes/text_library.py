from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.text_library_service import TextLibraryService
from app.schemas.text_library import (
    TextLibraryCreate,
    TextLibraryUpdate,
    TextLibraryResponse,
    TextLibraryListResponse,
)
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from app.models.trail import TrailDifficulty
from typing import Optional, List
import uuid

router = APIRouter(prefix="/text-library", tags=["biblioteca-de-textos"])


@router.post("/", response_model=TextLibraryResponse, status_code=status.HTTP_201_CREATED)
async def create_text(
    data: TextLibraryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = TextLibraryService(db)
    text = await service.create_text(data, current_user.id)
    return text


@router.get("/", response_model=TextLibraryListResponse)
async def list_texts(
    difficulty: Optional[str] = Query(None, description="Filtrar por dificuldade"),
    is_public: Optional[bool] = Query(None, description="Filtrar por textos públicos"),
    age_range_min: Optional[int] = Query(None, description="Idade mínima"),
    age_range_max: Optional[int] = Query(None, description="Idade máxima"),
    letters_focus: Optional[str] = Query(None, description="Letras trabalhadas (separadas por vírgula)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = TextLibraryService(db)
    
    difficulty_enum = None
    if difficulty:
        try:
            difficulty_enum = TrailDifficulty(difficulty)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Dificuldade inválida. Use: beginner, intermediate ou advanced"
            )
    
    letters_list = None
    if letters_focus:
        letters_list = [letter.strip().upper() for letter in letters_focus.split(",")]
    
    filter_created_by = None
    if current_user.role.value == "professional":
        filter_created_by = current_user.id
    
    result = await service.get_all_texts(
        created_by=filter_created_by,
        difficulty=difficulty_enum,
        is_public=None,
        age_range_min=age_range_min,
        age_range_max=age_range_max,
        letters_focus=letters_list,
    )
    return result


@router.get("/{text_id}", response_model=TextLibraryResponse)
async def get_text(
    text_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        text_uuid = uuid.UUID(text_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do texto inválido"
        )
    
    service = TextLibraryService(db)
    text = await service.get_text_by_id(text_uuid, current_user.id)
    return text


@router.put("/{text_id}", response_model=TextLibraryResponse)
async def update_text(
    text_id: str,
    data: TextLibraryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        text_uuid = uuid.UUID(text_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do texto inválido"
        )
    
    service = TextLibraryService(db)
    text = await service.update_text(text_uuid, data, current_user.id)
    return text


@router.delete("/{text_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_text(
    text_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        text_uuid = uuid.UUID(text_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do texto inválido"
        )
    
    service = TextLibraryService(db)
    await service.delete_text(text_uuid, current_user.id)
    return None

