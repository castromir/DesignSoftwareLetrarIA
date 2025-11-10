from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.diagnostic import (
    DiagnosticCreate,
    DiagnosticUpdate,
    DiagnosticResponse,
    DiagnosticListResponse,
)
from app.services.diagnostic_service import DiagnosticService
from app.utils.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.models.diagnostic import DiagnosticType

router = APIRouter(prefix="/diagnostics", tags=["diagnósticos"])


@router.post("/", response_model=DiagnosticResponse, status_code=status.HTTP_201_CREATED)
async def create_diagnostic(
    data: DiagnosticCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = DiagnosticService(db)
    return await service.create_diagnostic(data)


@router.get("/", response_model=DiagnosticListResponse)
async def list_diagnostics(
    student_id: str | None = None,
    conducted_by: str | None = None,
    diagnostic_type: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = DiagnosticService(db)

    effective_conducted_by = conducted_by
    if current_user.role.value == "professional" and conducted_by is None:
        effective_conducted_by = str(current_user.id)

    parsed_type = None
    if diagnostic_type:
        try:
            parsed_type = DiagnosticType(diagnostic_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tipo de diagnóstico inválido",
            )

    return await service.list_diagnostics(
        student_id=student_id,
        conducted_by=effective_conducted_by,
        diagnostic_type=parsed_type.value if parsed_type else None,
        skip=skip,
        limit=limit,
    )


@router.get("/{diagnostic_id}", response_model=DiagnosticResponse)
async def get_diagnostic(
    diagnostic_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = DiagnosticService(db)
    diagnostic = await service.get_diagnostic(diagnostic_id)
    if not diagnostic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico não encontrado",
        )
    return diagnostic


@router.put("/{diagnostic_id}", response_model=DiagnosticResponse)
async def update_diagnostic(
    diagnostic_id: str,
    data: DiagnosticUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = DiagnosticService(db)
    diagnostic = await service.update_diagnostic(diagnostic_id, data)
    if not diagnostic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico não encontrado",
        )
    return diagnostic


@router.delete("/{diagnostic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_diagnostic(
    diagnostic_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = DiagnosticService(db)
    deleted = await service.delete_diagnostic(diagnostic_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagnóstico não encontrado",
        )
    return None

