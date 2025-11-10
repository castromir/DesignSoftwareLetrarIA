import logging
from pathlib import Path
import uuid
from typing import Any, Dict, List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.repositories.recording_repository import RecordingRepository
from app.repositories.ai_insight_repository import AIInsightRepository
from app.schemas.recording import (
    RecordingAnalysisResponse,
    RecordingCreate,
    RecordingListResponse,
    RecordingResponse,
    RecordingUpdate,
)
from app.models.recording import Recording, RecordingStatus, RecordingAnalysis
from app.models.ai_insight import AIInsight
from app.models.student import Student
from app.models.trail import TrailStory
from app.services.genai.service import GeminiService, GeminiServiceError
from app.services.reading_analysis import analyze_reading


logger = logging.getLogger(__name__)

class RecordingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.recording_repository = RecordingRepository(session)
        self.ai_insight_repository = AIInsightRepository(session)
        self.uploads_dir = Path("uploads/recordings")
        try:
            self.uploads_dir.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            logger.warning("Sem permissão para criar diretório de gravações; utilizando caminho existente.")

    async def create_recording(
        self,
        data: RecordingCreate,
        audio_file_path: Optional[str] = None,
        audio_url: Optional[str] = None,
        created_by: Optional[uuid.UUID] = None,
    ) -> RecordingResponse:
        student_id = uuid.UUID(data.student_id)
        story_id = uuid.UUID(data.story_id)
        
        recording = await self.recording_repository.create(
            student_id=student_id,
            story_id=story_id,
            duration_seconds=data.duration_seconds,
            audio_file_path=audio_file_path,
            audio_url=audio_url,
            transcription=data.transcription,
            status=RecordingStatus.completed,
            created_by=created_by,
        )

        await self._upsert_recording_analysis(recording)
        await self.session.commit()
        await self.session.refresh(recording)

        await self._create_ai_insight_for_recording(recording, created_by)

        return RecordingResponse(
            id=str(recording.id),
            student_id=str(recording.student_id),
            story_id=str(recording.story_id),
            audio_file_path=recording.audio_file_path,
            audio_url=recording.audio_url,
            duration_seconds=recording.duration_seconds,
            recorded_at=recording.recorded_at,
            transcription=recording.transcription,
            status=recording.status,
            created_by=str(recording.created_by) if recording.created_by else None,
            updated_by=str(recording.updated_by) if recording.updated_by else None,
            updated_at=recording.updated_at,
        )

    async def _create_ai_insight_for_recording(
        self,
        recording: Recording,
        created_by: Optional[uuid.UUID],
    ) -> None:
        if not recording.transcription:
            return
        try:
            student: Optional[Student] = await self.session.get(Student, recording.student_id)
            if not student:
                return

            owner_professional_id = created_by or student.professional_id
            if not owner_professional_id:
                return

            gemini_service = GeminiService(self.session)
            insight_payload = await gemini_service.generate_recording_insight(recording)
            if not insight_payload:
                insight_payload = await self._build_analysis_insight_payload(recording)
            if not insight_payload:
                return

            await self.ai_insight_repository.create(
                professional_id=owner_professional_id,
                insight_type=insight_payload["type"],
                priority=insight_payload["priority"],
                title=insight_payload["title"],
                description=insight_payload["description"],
                related_students=[student.id],
            )
            await self.session.commit()
        except GeminiServiceError as exc:
            logger.warning(
                "GeminiServiceError ao gerar insight para gravação %s: %s",
                recording.id,
                exc,
                exc_info=True,
            )
        except Exception:  # noqa: BLE001
            logger.exception(
                "Erro inesperado ao gerar insight de IA para a gravação %s",
                recording.id,
                exc_info=True,
            )

    async def _build_analysis_insight_payload(self, recording: Recording) -> Optional[Dict[str, Any]]:
        analysis = recording.analysis
        if not analysis:
            analysis_query = await self.session.execute(
                select(RecordingAnalysis).where(RecordingAnalysis.recording_id == recording.id)
            )
            analysis = analysis_query.scalar_one_or_none()
        if not analysis:
            return None

        accuracy = analysis.accuracy_score
        errors = len(analysis.errors_detected) if analysis.errors_detected else 0
        fluency = analysis.fluency_score
        prosody = analysis.prosody_score
        wpm = analysis.speed_wpm
        improvements: List[str] = []
        if analysis.pauses_analysis:
            raw_points = analysis.pauses_analysis.get("improvement_points")
            if isinstance(raw_points, list):
                improvements = [str(item) for item in raw_points if str(item).strip()]

        insight_type = "suggestion"
        priority = "medium"
        if accuracy is not None and accuracy >= 85 and errors <= 1:
            insight_type = "progress"
            priority = "low"
        if accuracy is not None and accuracy < 60:
            insight_type = "attention_needed"
            priority = "high"
        if errors >= 5:
            insight_type = "attention_needed"
            priority = "high"

        title_parts: List[str] = []
        if accuracy is not None:
            title_parts.append(f"Acurácia {accuracy:.0f}%")
        if wpm is not None:
            title_parts.append(f"PPM {wpm:.0f}")
        if not title_parts:
            title_parts.append("Análise da leitura")
        title = " · ".join(title_parts)

        description_parts: List[str] = []
        if accuracy is not None:
            description_parts.append(f"A leitura alcançou {accuracy:.1f}% de acurácia")
        if wpm is not None:
            description_parts.append(f"Velocidade estimada em {wpm:.0f} palavras por minuto")
        if fluency is not None:
            description_parts.append(f"Fluência estimada em {fluency:.0f}")
        if prosody is not None:
            description_parts.append(f"Prosódia estimada em {prosody:.0f}")
        if errors:
            description_parts.append(f"Foram identificados {errors} desvios na leitura")
        if improvements:
            description_parts.append("Pontos de melhoria: " + ", ".join(improvements[:3]))
        if not description_parts:
            description_parts.append("Sem métricas suficientes para gerar um resumo detalhado")
        description = ". ".join(description_parts) + "."

        return {
            "type": insight_type,
            "priority": priority,
            "title": title,
            "description": description,
        }

    async def _upsert_recording_analysis(self, recording: Recording) -> None:
        if not recording.transcription:
            return

        story: Optional[TrailStory] = await self.session.get(TrailStory, recording.story_id)
        if not story or not story.content:
            return

        analysis_result = analyze_reading(
            transcription=recording.transcription,
            reference_text=story.content,
            duration_seconds=recording.duration_seconds,
        )

        existing_query = await self.session.execute(
            select(RecordingAnalysis).where(RecordingAnalysis.recording_id == recording.id)
        )
        existing_analysis: Optional[RecordingAnalysis] = existing_query.scalar_one_or_none()
        payload = {
            "fluency_score": analysis_result.fluency_score,
            "prosody_score": analysis_result.prosody_score,
            "speed_wpm": analysis_result.words_per_minute,
            "accuracy_score": analysis_result.accuracy_score,
            "overall_score": analysis_result.overall_score,
            "errors_detected": analysis_result.errors,
            "pauses_analysis": {
                "total_words": analysis_result.total_words,
                "correct_words": analysis_result.correct_words,
                "improvement_points": analysis_result.improvement_points,
            },
            "ai_feedback": (
                f"Acurácia estimada em {analysis_result.accuracy_score:.1f}%."
                if analysis_result.accuracy_score is not None
                else None
            ),
            "ai_recommendations": {
                "focus": analysis_result.improvement_points,
            },
        }

        if existing_analysis:
            for key, value in payload.items():
                setattr(existing_analysis, key, value)
        else:
            analysis_model = RecordingAnalysis(
                recording_id=recording.id,
                **payload,
            )
            self.session.add(analysis_model)

    async def save_audio_file(
        self,
        audio_bytes: bytes,
        student_id: str,
        story_id: str,
        file_extension: str = ".webm",
    ) -> str:
        """Salva o arquivo de áudio e retorna o caminho relativo."""
        student_uuid = uuid.UUID(student_id)
        story_uuid = uuid.UUID(story_id)
        
        # Criar estrutura de diretórios: uploads/recordings/{student_id}/{story_id}/
        student_dir = self.uploads_dir / str(student_uuid) / str(story_uuid)
        student_dir.mkdir(parents=True, exist_ok=True)
        
        # Gerar nome único para o arquivo
        import time
        timestamp = int(time.time() * 1000)
        filename = f"recording_{timestamp}{file_extension}"
        file_path = student_dir / filename
        
        # Salvar arquivo
        with open(file_path, "wb") as f:
            f.write(audio_bytes)
        
        # Retornar caminho relativo
        return str(file_path.relative_to("uploads"))

    async def get_all_recordings(
        self,
        student_id: Optional[str] = None,
        story_id: Optional[str] = None,
        status: Optional[RecordingStatus] = None,
    ) -> RecordingListResponse:
        student_uuid = None
        if student_id:
            student_uuid = uuid.UUID(student_id)
        
        story_uuid = None
        if story_id:
            story_uuid = uuid.UUID(story_id)
        
        recordings = await self.recording_repository.get_all(
            student_id=student_uuid,
            story_id=story_uuid,
            status=status,
        )
        
        recordings_response = []
        for r in recordings:
            analysis_response = None
            if r.analysis:
                analysis_response = RecordingAnalysisResponse(
                    id=str(r.analysis.id),
                    recording_id=str(r.analysis.recording_id),
                    fluency_score=r.analysis.fluency_score,
                    prosody_score=r.analysis.prosody_score,
                    speed_wpm=r.analysis.speed_wpm,
                    accuracy_score=r.analysis.accuracy_score,
                    overall_score=r.analysis.overall_score,
                    errors_detected=r.analysis.errors_detected,
                    pauses_analysis=r.analysis.pauses_analysis,
                    ai_feedback=r.analysis.ai_feedback,
                    ai_recommendations=r.analysis.ai_recommendations,
                    processed_at=r.analysis.processed_at,
                )
            
            recordings_response.append(
                RecordingResponse(
                    id=str(r.id),
                    student_id=str(r.student_id),
                    story_id=str(r.story_id),
                    audio_file_path=r.audio_file_path,
                    audio_url=r.audio_url,
                    duration_seconds=r.duration_seconds,
                    recorded_at=r.recorded_at,
                    transcription=r.transcription,
                    status=r.status,
                    created_by=str(r.created_by) if r.created_by else None,
                    updated_by=str(r.updated_by) if r.updated_by else None,
                    updated_at=r.updated_at,
                    analysis=analysis_response,
                )
            )
        
        return RecordingListResponse(
            recordings=recordings_response,
            total=len(recordings_response),
        )

    async def get_recording_by_id(self, recording_id: str) -> Optional[RecordingResponse]:
        recording_uuid = uuid.UUID(recording_id)
        recording = await self.recording_repository.get_by_id(recording_uuid)
        
        if not recording:
            return None
        
        analysis_response = None
        if recording.analysis:
            analysis_response = RecordingAnalysisResponse(
                id=str(recording.analysis.id),
                recording_id=str(recording.analysis.recording_id),
                fluency_score=recording.analysis.fluency_score,
                prosody_score=recording.analysis.prosody_score,
                speed_wpm=recording.analysis.speed_wpm,
                accuracy_score=recording.analysis.accuracy_score,
                overall_score=recording.analysis.overall_score,
                errors_detected=recording.analysis.errors_detected,
                pauses_analysis=recording.analysis.pauses_analysis,
                ai_feedback=recording.analysis.ai_feedback,
                ai_recommendations=recording.analysis.ai_recommendations,
                processed_at=recording.analysis.processed_at,
            )
        
        return RecordingResponse(
            id=str(recording.id),
            student_id=str(recording.student_id),
            story_id=str(recording.story_id),
            audio_file_path=recording.audio_file_path,
            audio_url=recording.audio_url,
            duration_seconds=recording.duration_seconds,
            recorded_at=recording.recorded_at,
            transcription=recording.transcription,
            status=recording.status,
            created_by=str(recording.created_by) if recording.created_by else None,
            updated_by=str(recording.updated_by) if recording.updated_by else None,
            updated_at=recording.updated_at,
            analysis=analysis_response,
        )

    async def update_recording(
        self,
        recording_id: str,
        data: RecordingUpdate,
        updated_by: Optional[uuid.UUID] = None,
    ) -> Optional[RecordingResponse]:
        recording_uuid = uuid.UUID(recording_id)
        
        recording = await self.recording_repository.update(
            recording_id=recording_uuid,
            transcription=data.transcription,
            status=data.status,
            audio_file_path=data.audio_file_path,
            audio_url=data.audio_url,
            updated_by=updated_by,
        )
        
        if not recording:
            return None

        await self._upsert_recording_analysis(recording)
        await self.session.commit()

        return RecordingResponse(
            id=str(recording.id),
            student_id=str(recording.student_id),
            story_id=str(recording.story_id),
            audio_file_path=recording.audio_file_path,
            audio_url=recording.audio_url,
            duration_seconds=recording.duration_seconds,
            recorded_at=recording.recorded_at,
            transcription=recording.transcription,
            status=recording.status,
            created_by=str(recording.created_by) if recording.created_by else None,
            updated_by=str(recording.updated_by) if recording.updated_by else None,
            updated_at=recording.updated_at,
        )

    async def delete_recording(self, recording_id: str) -> bool:
        recording_uuid = uuid.UUID(recording_id)
        result = await self.recording_repository.delete(recording_uuid)
        await self.session.commit()
        return result

    async def get_recording_metrics(self, recording_id: str) -> Optional[Dict[str, Any]]:
        recording_uuid = uuid.UUID(recording_id)
        recording = await self.recording_repository.get_by_id(recording_uuid)

        if not recording:
            return None

        analysis = recording.analysis
        transcription_word_count = 0
        if recording.transcription:
            transcription_word_count = len(
                [word for word in recording.transcription.split() if word]
            )

        errors_count = 0
        words_per_minute: Optional[float] = None
        accuracy: Optional[float] = None
        overall_score: Optional[float] = None
        prosody: Optional[float] = None
        fluency: Optional[float] = None
        correct_words: Optional[int] = None
        total_words: Optional[int] = None
        improvement_points: List[str] = []
        duration_value: Optional[float] = recording.duration_seconds

        if analysis:
            if analysis.errors_detected:
                errors_count = len(analysis.errors_detected)
            if analysis.speed_wpm is not None:
                words_per_minute = analysis.speed_wpm
            if analysis.accuracy_score is not None:
                accuracy = analysis.accuracy_score
            if analysis.overall_score is not None:
                overall_score = analysis.overall_score
            if analysis.prosody_score is not None:
                prosody = analysis.prosody_score
            if analysis.fluency_score is not None:
                fluency = analysis.fluency_score
            if analysis.pauses_analysis:
                total_words = analysis.pauses_analysis.get("total_words")
                correct_words = analysis.pauses_analysis.get("correct_words")
                improvement_points = analysis.pauses_analysis.get("improvement_points", [])
            if analysis.pauses_analysis and duration_value in (None, 0):
                maybe_total = analysis.pauses_analysis.get("total_words")
                if maybe_total and words_per_minute:
                    duration_value = (maybe_total / words_per_minute) * 60

        insights_stmt = (
            select(AIInsight)
            .where(
                AIInsight.related_students.isnot(None),
                AIInsight.related_students.contains([recording.student_id]),
            )
            .order_by(AIInsight.created_at.desc())
        )
        insights_result = await self.session.execute(insights_stmt)
        insights: List[Dict[str, Any]] = [
            {
                "id": str(insight.id),
                "title": insight.title,
                "description": insight.description,
                "type": insight.insight_type.value,
                "priority": insight.priority.value,
                "created_at": insight.created_at,
            }
            for insight in insights_result.scalars().all()
        ]

        if words_per_minute is None and transcription_word_count and recording.duration_seconds and recording.duration_seconds > 0:
            minutes = recording.duration_seconds / 60
            if minutes > 0:
                words_per_minute = transcription_word_count / minutes

        if accuracy is None and transcription_word_count:
            accuracy = max(
                0.0,
                min(
                    100.0,
                    (transcription_word_count - errors_count)
                    / transcription_word_count
                    * 100.0,
                ),
            )

        if (duration_value is None or duration_value <= 0) and words_per_minute and transcription_word_count:
            duration_value = (transcription_word_count / words_per_minute) * 60

        return {
            "recording_id": str(recording.id),
            "story_id": str(recording.story_id),
            "student_id": str(recording.student_id),
            "duration_seconds": duration_value or 0,
            "recorded_at": recording.recorded_at,
            "audio_file_path": recording.audio_file_path,
            "audio_url": recording.audio_url,
            "transcription": recording.transcription,
            "errors_count": errors_count,
            "words_per_minute": words_per_minute,
            "accuracy_percentage": accuracy,
            "fluency_score": fluency,
            "overall_score": overall_score,
            "prosody_score": prosody,
            "correct_words_count": correct_words,
            "total_words": total_words,
            "improvement_points": improvement_points,
            "insights": insights,
        }

