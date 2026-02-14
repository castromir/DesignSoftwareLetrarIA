from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from app.repositories.student_repository import StudentRepository
from app.repositories.user_repository import UserRepository
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentListResponse,
    StudentTrackingResponse,
    StudentTrackingPPMPoint,
    StudentAttentionPoint,
    StudentInsightSummary,
)
from app.models.user import UserRole
from app.models.recording import Recording, RecordingAnalysis
from app.models.activity import StudentActivity, ActivityStatus
from app.models.ai_insight import AIInsight
from typing import Optional, List
import uuid
from datetime import date


class StudentService:
    def __init__(self, session: AsyncSession):
        self.session = session
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

    async def get_student_tracking(self, student_id: uuid.UUID | str) -> StudentTrackingResponse:
        if isinstance(student_id, str):
            student_uuid = uuid.UUID(student_id)
        else:
            student_uuid = student_id

        student = await self.student_repository.get_by_id(student_uuid)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Aluno não encontrado"
            )

        total_recordings_stmt = await self.session.execute(
            select(func.count(Recording.id)).where(Recording.student_id == student_uuid)
        )
        total_recordings = total_recordings_stmt.scalar_one()

        completed_activities_stmt = await self.session.execute(
            select(func.count(StudentActivity.id)).where(
                StudentActivity.student_id == student_uuid,
                StudentActivity.status == ActivityStatus.completed,
            )
        )
        completed_activities = completed_activities_stmt.scalar_one()

        recordings_stmt = await self.session.execute(
            select(
                Recording.id,
                Recording.recorded_at,
                RecordingAnalysis.speed_wpm,
                RecordingAnalysis.accuracy_score,
                RecordingAnalysis.pauses_analysis,
                RecordingAnalysis.errors_detected,
            )
            .join(RecordingAnalysis, RecordingAnalysis.recording_id == Recording.id, isouter=True)
            .where(Recording.student_id == student_uuid)
            .order_by(Recording.recorded_at.desc())
        )
        recordings_rows = recordings_stmt.all()

        ppm_history: List[StudentTrackingPPMPoint] = []
        accuracy_values: List[float] = []
        wpm_values: List[float] = []
        current_ppm: Optional[float] = None

        for row in recordings_rows:
            recording_id, recorded_at, speed_wpm, accuracy_score, pauses_analysis, errors_detected = row
            if speed_wpm is not None:
                wpm_values.append(speed_wpm)
                if current_ppm is None:
                    current_ppm = speed_wpm
            if accuracy_score is not None:
                accuracy_values.append(accuracy_score)
            ppm_history.append(
                StudentTrackingPPMPoint(
                    recording_id=str(recording_id),
                    recorded_at=recorded_at,
                    words_per_minute=speed_wpm,
                    accuracy=accuracy_score,
                )
            )

        ppm_history = ppm_history[:30]

        average_accuracy = sum(accuracy_values) / len(accuracy_values) if accuracy_values else None
        average_wpm = sum(wpm_values) / len(wpm_values) if wpm_values else None

        ppm_change_percentage: Optional[float] = None
        if len(wpm_values) >= 2 and wpm_values[1] > 0:
            ppm_change_percentage = ((wpm_values[0] - wpm_values[1]) / wpm_values[1]) * 100

        insights_stmt = await self.session.execute(
            select(AIInsight)
            .where(
                AIInsight.related_students.isnot(None),
                AIInsight.related_students.contains([student_uuid]),
            )
            .order_by(AIInsight.created_at.desc())
            .limit(5)
        )
        insights = list(insights_stmt.scalars().all())

        attention_points: List[StudentAttentionPoint] = []
        if recordings_rows:
            latest_pauses = recordings_rows[0][4] or {}
            improvement_points = latest_pauses.get("improvement_points") if isinstance(latest_pauses, dict) else None
            if isinstance(improvement_points, list) and improvement_points:
                for point in improvement_points[:3]:
                    attention_points.append(
                        StudentAttentionPoint(
                            severity="warning",
                            title="Ponto de melhoria",
                            description=str(point),
                        )
                    )
        if not attention_points and accuracy_values:
            if average_accuracy is not None and average_accuracy < 70:
                attention_points.append(
                    StudentAttentionPoint(
                        severity="error",
                        title="Acurácia baixa",
                        description="A acurácia média das leituras está abaixo de 70%. Reforce exercícios de compreensão e pronúncia.",
                    )
                )
            elif average_accuracy is not None and average_accuracy >= 90:
                attention_points.append(
                    StudentAttentionPoint(
                        severity="success",
                        title="Excelente acurácia",
                        description="O aluno mantém acurácia acima de 90%. Continue reforçando os hábitos de leitura atuais.",
                    )
                )
        if not attention_points:
            attention_points.append(
                StudentAttentionPoint(
                    severity="info",
                    title="Sem alertas",
                    description="Nenhum ponto crítico identificado nas leituras recentes.",
                )
            )

        recent_insights = [
            StudentInsightSummary(
                id=str(insight.id),
                title=insight.title,
                type=insight.insight_type.value,
                priority=insight.priority.value,
                created_at=insight.created_at,
            )
            for insight in insights
        ]

        return StudentTrackingResponse(
            student_id=str(student_uuid),
            student_name=student.name,
            total_recordings=total_recordings,
            completed_activities=completed_activities,
            average_accuracy=average_accuracy,
            average_wpm=average_wpm,
            current_ppm=current_ppm,
            ppm_change_percentage=ppm_change_percentage,
            ppm_history=ppm_history,
            attention_points=attention_points,
            recent_insights=recent_insights,
        )

