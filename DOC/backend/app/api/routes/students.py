from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.student_service import StudentService
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentListResponse,
    StudentTrackingResponse,
)
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from typing import Optional
import uuid

router = APIRouter(prefix="/students", tags=["alunos"])


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentService(db)
    student = await service.create_student(data, current_user.id)
    return student


@router.get("/", response_model=StudentListResponse)
async def list_students(
    professional_id: Optional[str] = Query(None, description="Filtrar por profissional"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = StudentService(db)
    
    # Se for professional, só pode ver seus próprios alunos
    # Se for admin, pode ver todos ou filtrar por professional_id
    filter_professional_id = None
    if current_user.role.value == "professional":
        filter_professional_id = current_user.id
    elif professional_id:
        try:
            filter_professional_id = uuid.UUID(professional_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ID do profissional inválido"
            )
    
    result = await service.get_all_students(filter_professional_id)
    return result


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        student_uuid = uuid.UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do aluno inválido"
        )
    
    service = StudentService(db)
    student = await service.get_student_by_id(student_uuid)
    
    # Se for professional, só pode ver seus próprios alunos
    if current_user.role.value == "professional" and str(student.professional_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar este aluno"
        )
    
    return student


@router.get("/{student_id}/tracking", response_model=StudentTrackingResponse)
async def get_student_tracking(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        student_uuid = uuid.UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do aluno inválido"
        )

    service = StudentService(db)
    student = await service.get_student_by_id(student_uuid)

    if current_user.role.value == "professional" and str(student.professional_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar este aluno"
        )

    return await service.get_student_tracking(student_uuid)


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    data: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        student_uuid = uuid.UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do aluno inválido"
        )
    
    service = StudentService(db)
    
    # Verificar se o aluno existe e se o usuário tem permissão
    existing_student = await service.get_student_by_id(student_uuid)
    if current_user.role.value == "professional" and str(existing_student.professional_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para editar este aluno"
        )
    
    student = await service.update_student(student_uuid, data, current_user.id)
    return student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    try:
        student_uuid = uuid.UUID(student_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID do aluno inválido"
        )
    
    service = StudentService(db)
    
    # Verificar se o aluno existe e se o usuário tem permissão
    existing_student = await service.get_student_by_id(student_uuid)
    if current_user.role.value == "professional" and str(existing_student.professional_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para excluir este aluno"
        )
    
    await service.delete_student(student_uuid)
    return None

