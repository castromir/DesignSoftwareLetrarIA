from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.repositories.student_repository import StudentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse, StudentListResponse
from app.models.user import UserRole
from typing import Optional
import uuid
from datetime import date


class StudentService:
    def __init__(self, session: AsyncSession):
        self.student_repository = StudentRepository(session)
        self.user_repository = UserRepository(session)

    async def create_student(self, data: StudentCreate, created_by_id: uuid.UUID) -> StudentResponse:
        # Verificar se o professional existe e é realmente um professional
        professional = await self.user_repository.get_by_id(uuid.UUID(data.professional_id))
        if not professional or professional.role != UserRole.professional:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profissional não encontrado"
            )

        student_data = {
            "professional_id": uuid.UUID(data.professional_id),
            "name": data.name,
            "registration": data.registration,
            "gender": data.gender,
            "birth_date": data.birth_date,
            "age": data.age,
            "observations": data.observations,
            "profile_image": data.profile_image,
            "special_needs": data.special_needs,
            "status": data.status,
            "created_by": created_by_id,
        }

        student = await self.student_repository.create(student_data)

        return StudentResponse(
            id=str(student.id),
            professional_id=str(student.professional_id),
            name=student.name,
            registration=student.registration,
            gender=student.gender,
            birth_date=student.birth_date,
            age=student.age,
            observations=student.observations,
            profile_image=student.profile_image,
            special_needs=student.special_needs,
            status=student.status,
            created_at=student.created_at,
            updated_at=student.updated_at,
            deleted_at=student.deleted_at,
        )

    async def get_all_students(
        self, 
        professional_id: Optional[uuid.UUID] = None
    ) -> StudentListResponse:
        prof_id = professional_id if professional_id else None
        students = await self.student_repository.get_all(prof_id)
        total = await self.student_repository.count_all(prof_id)
        active = await self.student_repository.count_active(prof_id)
        inactive = await self.student_repository.count_inactive(prof_id)

        return StudentListResponse(
            total=total,
            active=active,
            inactive=inactive,
            students=[
                StudentResponse(
                    id=str(s.id),
                    professional_id=str(s.professional_id),
                    name=s.name,
                    registration=s.registration,
                    gender=s.gender,
                    birth_date=s.birth_date,
                    age=s.age,
                    observations=s.observations,
                    profile_image=s.profile_image,
                    special_needs=s.special_needs,
                    status=s.status,
                    created_at=s.created_at,
                    updated_at=s.updated_at,
                    deleted_at=s.deleted_at,
                )
                for s in students
            ]
        )

    async def get_student_by_id(self, student_id: uuid.UUID | str) -> StudentResponse:
        if isinstance(student_id, str):
            student_id = uuid.UUID(student_id)
        student = await self.student_repository.get_by_id(student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aluno não encontrado"
            )

        return StudentResponse(
            id=str(student.id),
            professional_id=str(student.professional_id),
            name=student.name,
            registration=student.registration,
            gender=student.gender,
            birth_date=student.birth_date,
            age=student.age,
            observations=student.observations,
            profile_image=student.profile_image,
            special_needs=student.special_needs,
            status=student.status,
            created_at=student.created_at,
            updated_at=student.updated_at,
            deleted_at=student.deleted_at,
        )

    async def update_student(
        self, 
        student_id: uuid.UUID, 
        data: StudentUpdate,
        updated_by_id: uuid.UUID
    ) -> StudentResponse:
        update_data = data.model_dump(exclude_unset=True)
        
        if "professional_id" in update_data and update_data["professional_id"]:
            professional = await self.user_repository.get_by_id(
                uuid.UUID(update_data["professional_id"])
            )
            if not professional or professional.role != UserRole.professional:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Profissional não encontrado"
                )
            update_data["professional_id"] = uuid.UUID(update_data["professional_id"])

        update_data["updated_by"] = updated_by_id
        
        student = await self.student_repository.update(student_id, update_data)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aluno não encontrado"
            )

        return StudentResponse(
            id=str(student.id),
            professional_id=str(student.professional_id),
            name=student.name,
            registration=student.registration,
            gender=student.gender,
            birth_date=student.birth_date,
            age=student.age,
            observations=student.observations,
            profile_image=student.profile_image,
            special_needs=student.special_needs,
            status=student.status,
            created_at=student.created_at,
            updated_at=student.updated_at,
            deleted_at=student.deleted_at,
        )

    async def delete_student(self, student_id: uuid.UUID) -> bool:
        deleted = await self.student_repository.delete(student_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aluno não encontrado"
            )
        return True

