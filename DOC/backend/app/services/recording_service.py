import os
import uuid
from pathlib import Path
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.recording import Recording, RecordingStatus
from app.repositories.recording_repository import RecordingRepository
from app.schemas.recording import (
    RecordingAnalysisResponse,
    RecordingCreate,
    RecordingListResponse,
    RecordingResponse,
    RecordingUpdate,
)


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
        # Validar dados essenciais
        if not data.student_id:
            raise ValueError("student_id é obrigatório")

        if not data.story_id:
            raise ValueError("story_id é obrigatório")

        if data.duration_seconds is None or data.duration_seconds < 0:
            raise ValueError("duration_seconds deve ser um valor positivo")

        # Validar que há áudio ou URL
        if not audio_file_path and not audio_url:
            print(
                "[RecordingService] Aviso: Gravação criada sem arquivo de áudio ou URL"
            )

        # Converter student_id para UUID
        try:
            student_id = uuid.UUID(data.student_id)
        except (ValueError, AttributeError, TypeError) as e:
            raise ValueError(
                f"student_id inválido: {data.student_id}. Deve ser um UUID válido."
            )

        # Tentar converter story_id para UUID, se falhar, usar como string
        # IMPORTANTE: Mantemos como string para permitir IDs customizados
        try:
            story_id = uuid.UUID(data.story_id)
        except (ValueError, AttributeError, TypeError):
            # Se não for UUID válido, tentar converter para UUID ou manter como está
            # Isso é consistente com a remoção da FK de story_id
            print(
                f"[RecordingService] story_id '{data.story_id}' não é UUID válido, mas será aceito (FK removida)"
            )
            # Forçar conversão para UUID para manter compatibilidade com o banco
            # Gerar UUID v5 baseado no story_id para garantir consistência
            namespace = uuid.UUID(
                "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
            )  # namespace DNS
            story_id = uuid.uuid5(namespace, f"story_{data.story_id}")
            print(
                f"[RecordingService] UUID v5 gerado para story_id '{data.story_id}': {story_id}"
            )

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
        # Validar dados de entrada
        if not audio_bytes or len(audio_bytes) == 0:
            raise ValueError("audio_bytes não pode estar vazio")

        if not student_id:
            raise ValueError("student_id é obrigatório")

        if not story_id:
            raise ValueError("story_id é obrigatório")

        # Validar tamanho mínimo do áudio (1KB)
        if len(audio_bytes) < 1024:
            raise ValueError(
                f"Arquivo de áudio muito pequeno: {len(audio_bytes)} bytes. Mínimo: 1KB"
            )

        # Validar tamanho máximo (50MB)
        max_size = 50 * 1024 * 1024
        if len(audio_bytes) > max_size:
            raise ValueError(
                f"Arquivo de áudio muito grande: {len(audio_bytes) / 1024 / 1024:.2f}MB. Máximo: 50MB"
            )

        # Converter student_id para UUID
        try:
            student_uuid = uuid.UUID(student_id)
        except (ValueError, AttributeError, TypeError):
            raise ValueError(f"student_id inválido: {student_id}")

        # Converter story_id para UUID usando a mesma lógica de create_recording
        try:
            story_uuid = uuid.UUID(story_id)
            story_dir = str(story_uuid)
        except (ValueError, AttributeError, TypeError):
            # Gerar UUID v5 consistente para manter estrutura de diretórios organizada
            namespace = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
            story_uuid = uuid.uuid5(namespace, f"story_{story_id}")
            story_dir = str(story_uuid)
            print(
                f"[RecordingService] story_id '{story_id}' não é UUID, UUID v5 gerado: {story_uuid}"
            )

        # Criar estrutura de diretórios: uploads/recordings/{student_id}/{story_id}/
        student_dir = self.uploads_dir / str(student_uuid) / story_dir

        try:
            student_dir.mkdir(parents=True, exist_ok=True)
        except OSError as e:
            raise ValueError(f"Erro ao criar diretório para gravação: {str(e)}")

        # Gerar nome único para o arquivo
        import time

        timestamp = int(time.time() * 1000)
        filename = f"recording_{timestamp}{file_extension}"
        file_path = student_dir / filename

        # Salvar arquivo
        try:
            with open(file_path, "wb") as f:
                f.write(audio_bytes)

            print(
                f"[RecordingService] Áudio salvo com sucesso: {file_path} ({len(audio_bytes) / 1024:.2f}KB)"
            )
        except OSError as e:
            raise ValueError(f"Erro ao salvar arquivo de áudio: {str(e)}")

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
            try:
                student_uuid = uuid.UUID(student_id)
            except (ValueError, AttributeError, TypeError):
                raise ValueError(f"student_id inválido: {student_id}")

        story_uuid = None
        if story_id:
            try:
                story_uuid = uuid.UUID(story_id)
            except (ValueError, AttributeError, TypeError):
                # Se story_id não é UUID, gerar UUID v5 consistente
                # Isso garante que sempre usamos a mesma lógica de conversão
                namespace = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
                story_uuid = uuid.uuid5(namespace, f"story_{story_id}")
                print(
                    f"[RecordingService] Filtro: UUID v5 gerado para story_id '{story_id}': {story_uuid}"
                )

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

    async def get_recording_by_id(
        self, recording_id: str
    ) -> Optional[RecordingResponse]:
        try:
            recording_uuid = uuid.UUID(recording_id)
        except (ValueError, AttributeError, TypeError):
            print(f"[RecordingService] ID de gravação inválido: {recording_id}")
            return None

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
        try:
            recording_uuid = uuid.UUID(recording_id)
        except (ValueError, AttributeError, TypeError):
            print(
                f"[RecordingService] ID de gravação inválido para update: {recording_id}"
            )
            return None

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
        try:
            recording_uuid = uuid.UUID(recording_id)
        except (ValueError, AttributeError, TypeError):
            print(
                f"[RecordingService] ID de gravação inválido para delete: {recording_id}"
            )
            return False

        result = await self.recording_repository.delete(recording_uuid)
        await self.session.commit()
        return result
