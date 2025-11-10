from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.report import ReportType, ReportFormat
from app.models.user import User
from app.schemas.report import (
    ReportCreate,
    ReportUpdate,
    ReportResponse,
    ReportListResponse,
)
from app.services.report_service import ReportService
from app.utils.dependencies import get_db, get_current_active_user

router = APIRouter(prefix="/reports", tags=["relatórios"])


@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    data: ReportCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ReportService(db)
    return await service.create_report(data, generated_by=str(current_user.id))


@router.get("/", response_model=ReportListResponse)
async def list_reports(
    student_id: str | None = None,
    report_type: str | None = None,
    report_format: str | None = None,
    period_start: str | None = None,
    period_end: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ReportService(db)

    parsed_type = None
    parsed_format = None

    if report_type:
        try:
            parsed_type = ReportType(report_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tipo de relatório inválido",
            )

    if report_format:
        try:
            parsed_format = ReportFormat(report_format)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de relatório inválido",
            )

    generated_by = None
    if current_user.role.value == "professional":
        generated_by = str(current_user.id)

    return await service.list_reports(
        student_id=student_id,
        report_type=parsed_type.value if parsed_type else None,
        report_format=parsed_format.value if parsed_format else None,
        generated_by=generated_by,
        period_start=period_start,
        period_end=period_end,
        skip=skip,
        limit=limit,
    )


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ReportService(db)
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relatório não encontrado",
        )
    return report


@router.put("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: str,
    data: ReportUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ReportService(db)
    report = await service.update_report(report_id, data, updated_by=str(current_user.id))
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relatório não encontrado",
        )
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = ReportService(db)
    deleted = await service.delete_report(report_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relatório não encontrado",
        )
    return None

