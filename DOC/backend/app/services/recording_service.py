from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.repositories.recording_repository import RecordingRepository
from app.schemas.recording import RecordingCreate, RecordingUpdate, RecordingResponse, RecordingListResponse, RecordingAnalysisResponse
from app.models.recording import Recording, RecordingStatus
from typing import Optional
import uuid
import os
from pathlib import Path


class RecordingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.recording_repository = RecordingRepository(session)
        self.uploads_dir = Path("uploads/recordings")
        self.uploads_dir.mkdir(parents=True, exist_ok=True)

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

