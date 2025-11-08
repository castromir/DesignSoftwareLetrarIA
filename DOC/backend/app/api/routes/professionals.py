from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.professional_service import ProfessionalService
from app.schemas.professional import (
    ProfessionalCreate,
    ProfessionalUpdate,
    ProfessionalResponse,
    ProfessionalListResponse,
)
from app.utils.dependencies import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/professionals", tags=["profissionais"])


@router.post("/", response_model=ProfessionalResponse, status_code=status.HTTP_201_CREATED)
async def create_professional(
    data: ProfessionalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    service = ProfessionalService(db)
    professional = await service.create_professional(data)
    return professional


@router.get("/", response_model=ProfessionalListResponse)
async def list_professionals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    service = ProfessionalService(db)
    result = await service.list_professionals(skip=skip, limit=limit)
    return result


@router.get("/{professional_id}", response_model=ProfessionalResponse)
async def get_professional(
    professional_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    service = ProfessionalService(db)
    professional = await service.get_professional(professional_id)
    return professional


@router.put("/{professional_id}", response_model=ProfessionalResponse)
async def update_professional(
    professional_id: str,
    data: ProfessionalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    service = ProfessionalService(db)
    professional = await service.update_professional(professional_id, data)
    return professional


@router.delete("/{professional_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_professional(
    professional_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    service = ProfessionalService(db)
    await service.delete_professional(professional_id)
    return None

