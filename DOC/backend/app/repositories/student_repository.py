import uuid
from typing import Optional

from sqlalchemy import and_, delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.student import Student, StudentStatus


class StudentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(
        self, professional_id: Optional[uuid.UUID] = None
    ) -> list[Student]:
        query = select(Student).where(Student.deleted_at.is_(None))
        if professional_id:
            query = query.where(Student.professional_id == professional_id)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, student_id: uuid.UUID) -> Optional[Student]:
        result = await self.session.execute(
            select(Student).where(
                and_(Student.id == student_id, Student.deleted_at.is_(None))
            )
        )
        return result.scalar_one_or_none()

    async def create(self, student_data: dict) -> Student:
        student = Student(**student_data)
        self.session.add(student)
        await self.session.commit()
        await self.session.refresh(student)
        return student

    async def update(
        self, student_id: uuid.UUID, student_data: dict
    ) -> Optional[Student]:
        stmt = (
            update(Student)
            .where(and_(Student.id == student_id, Student.deleted_at.is_(None)))
            .values(**student_data)
            .returning(Student)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()

    async def delete(self, student_id: uuid.UUID) -> bool:
        from datetime import datetime

        stmt = (
            update(Student)
            .where(and_(Student.id == student_id, Student.deleted_at.is_(None)))
            .values(deleted_at=datetime.utcnow())
            .returning(Student)
        )

        result = await self.session.execute(stmt)

        deleted_student = result.scalar_one_or_none()
        await self.session.commit()

        return deleted_student is not None

    async def count_all(self, professional_id: Optional[uuid.UUID] = None) -> int:
        query = select(func.count(Student.id)).where(Student.deleted_at.is_(None))
        if professional_id:
            query = query.where(Student.professional_id == professional_id)
        result = await self.session.execute(query)
        return result.scalar_one()

    async def count_active(self, professional_id: Optional[uuid.UUID] = None) -> int:
        query = select(func.count(Student.id)).where(
            and_(Student.deleted_at.is_(None), Student.status == StudentStatus.active)
        )
        if professional_id:
            query = query.where(Student.professional_id == professional_id)
        result = await self.session.execute(query)
        return result.scalar_one()

    async def count_inactive(self, professional_id: Optional[uuid.UUID] = None) -> int:
        query = select(func.count(Student.id)).where(
            and_(Student.deleted_at.is_(None), Student.status == StudentStatus.inactive)
        )
        if professional_id:
            query = query.where(Student.professional_id == professional_id)
        result = await self.session.execute(query)
        return result.scalar_one()
