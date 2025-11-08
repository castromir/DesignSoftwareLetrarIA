from sqlalchemy import select, func, and_, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.activity import Activity, ActivityStatus, StudentActivity
from typing import Optional, List
import uuid


class ActivityRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, activity_data: dict, student_ids: List[uuid.UUID]) -> Activity:
        activity = Activity(**activity_data)
        self.session.add(activity)
        await self.session.flush()

        for student_id in student_ids:
            student_activity = StudentActivity(
                student_id=student_id,
                activity_id=activity.id,
                status=ActivityStatus.pending
            )
            self.session.add(student_activity)

        await self.session.commit()
        await self.session.refresh(activity)
        return activity

    async def get_by_id(self, activity_id: uuid.UUID) -> Optional[Activity]:
        result = await self.session.execute(
            select(Activity).where(Activity.id == activity_id)
        )
        return result.scalar_one_or_none()

    async def get_student_ids(self, activity_id: uuid.UUID) -> List[uuid.UUID]:
        result = await self.session.execute(
            select(StudentActivity.student_id).where(
                StudentActivity.activity_id == activity_id
            )
        )
        return [row[0] for row in result.all()]

    async def get_all(
        self,
        professional_id: Optional[uuid.UUID] = None,
        status: Optional[ActivityStatus] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Activity]:
        query = select(Activity)

        if professional_id:
            query = query.where(Activity.created_by == professional_id)

        if status:
            query = query.where(Activity.status == status)

        result = await self.session.execute(
            query.order_by(Activity.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def count_all(self, professional_id: Optional[uuid.UUID] = None) -> int:
        query = select(func.count(Activity.id))
        if professional_id:
            query = query.where(Activity.created_by == professional_id)
        result = await self.session.execute(query)
        return result.scalar_one()

    async def count_by_status(
        self,
        status: ActivityStatus,
        professional_id: Optional[uuid.UUID] = None
    ) -> int:
        query = select(func.count(Activity.id)).where(Activity.status == status)
        if professional_id:
            query = query.where(Activity.created_by == professional_id)
        result = await self.session.execute(query)
        return result.scalar_one()

    async def update(
        self,
        activity_id: uuid.UUID,
        update_data: dict,
        student_ids: Optional[List[uuid.UUID]] = None,
        updated_by: Optional[uuid.UUID] = None
    ) -> Optional[Activity]:
        activity = await self.get_by_id(activity_id)
        if not activity:
            return None

        if updated_by:
            update_data["updated_by"] = updated_by

        for key, value in update_data.items():
            if value is not None:
                setattr(activity, key, value)

        if student_ids is not None:
            existing_student_activities_result = await self.session.execute(
                select(StudentActivity).where(
                    StudentActivity.activity_id == activity_id
                )
            )
            existing_student_activities = existing_student_activities_result.scalars().all()
            existing_ids = {sa.student_id for sa in existing_student_activities}
            new_ids = set(student_ids)

            ids_to_add = new_ids - existing_ids
            ids_to_remove = existing_ids - new_ids

            for student_id in ids_to_add:
                student_activity = StudentActivity(
                    student_id=student_id,
                    activity_id=activity_id,
                    status=ActivityStatus.pending
                )
                self.session.add(student_activity)

            if ids_to_remove:
                await self.session.execute(
                    delete(StudentActivity).where(
                        and_(
                            StudentActivity.activity_id == activity_id,
                            StudentActivity.student_id.in_(ids_to_remove)
                        )
                    )
                )

        await self.session.commit()
        await self.session.refresh(activity)
        return activity

    async def delete(self, activity_id: uuid.UUID) -> bool:
        activity = await self.get_by_id(activity_id)
        if not activity:
            return False

        await self.session.delete(activity)
        await self.session.commit()
        return True

