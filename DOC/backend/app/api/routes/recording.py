from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.recording_service import RecordingService
from app.schemas.recording import (
    RecordingCreate,
    RecordingUpdate,
    RecordingResponse,
    RecordingListResponse,
    RecordingMetricsResponse,
)
from app.utils.dependencies import get_db, get_current_active_user
from app.models.user import User
from typing import Optional
import os
from pathlib import Path

router = APIRouter(prefix="/recordings", tags=["gravações"])


@router.post("/", response_model=RecordingResponse, status_code=status.HTTP_201_CREATED)
async def create_recording(
    student_id: str = Form(...),
    story_id: str = Form(...),
    duration_seconds: float = Form(...),
    transcription: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Cria uma nova gravação com áudio e transcrição."""
    service = RecordingService(db)
    
    audio_file_path = None
    if audio:
        audio_bytes = await audio.read()
        if len(audio_bytes) > 0:
            # Determinar extensão
            file_extension = ".webm"
            if audio.filename:
                _, ext = os.path.splitext(audio.filename)
                if ext:
                    file_extension = ext.lower()
            
            # Salvar arquivo
            audio_file_path = await service.save_audio_file(
                audio_bytes,
                student_id,
                story_id,
                file_extension,
            )
    
    data = RecordingCreate(
        student_id=student_id,
        story_id=story_id,
        duration_seconds=duration_seconds,
        transcription=transcription,
    )
    
    recording = await service.create_recording(
        data,
        audio_file_path=audio_file_path,
        created_by=current_user.id,
    )
    
    return recording


@router.get("/", response_model=RecordingListResponse)
async def list_recordings(
    student_id: Optional[str] = None,
    story_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Lista gravações com filtros opcionais."""
    service = RecordingService(db)
    
    # Se for profissional, só pode ver gravações dos seus alunos
    filter_student_id = student_id
    if current_user.role.value == "professional" and not student_id:
        # Buscar apenas alunos do profissional
        # Por enquanto, permitir ver todas se não especificar
        pass
    
    result = await service.get_all_recordings(
        student_id=filter_student_id,
        story_id=story_id,
    )
    
    return result


@router.get("/{recording_id}", response_model=RecordingResponse)
async def get_recording(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Obtém uma gravação específica."""
    service = RecordingService(db)
    recording = await service.get_recording_by_id(recording_id)
    
    if not recording:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gravação não encontrada"
        )
    
    return recording


@router.get("/{recording_id}/metrics", response_model=RecordingMetricsResponse)
async def get_recording_metrics(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = RecordingService(db)
    metrics = await service.get_recording_metrics(recording_id)

    if not metrics:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gravação não encontrada"
        )

    return metrics


@router.get("/{recording_id}/audio")
async def get_recording_audio(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retorna o arquivo de áudio da gravação."""
    service = RecordingService(db)
    recording = await service.get_recording_by_id(recording_id)
    
    if not recording:
        print(f"[Recording Audio] Gravação não encontrada: {recording_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gravação não encontrada"
        )
    
    if not recording.audio_file_path:
        print(f"[Recording Audio] Gravação sem caminho de arquivo: {recording_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Arquivo de áudio não encontrado"
        )
    
    # Caminho completo do arquivo (usar caminho absoluto)
    import os
    base_path = Path(os.getcwd())
    file_path = base_path / "uploads" / recording.audio_file_path
    
    print(f"[Recording Audio] CWD: {os.getcwd()}")
    print(f"[Recording Audio] Procurando arquivo em: {file_path}")
    print(f"[Recording Audio] Arquivo existe: {file_path.exists()}")
    
    if not file_path.exists():
        # Tentar caminho relativo também
        alt_path = Path("uploads") / recording.audio_file_path
        print(f"[Recording Audio] Tentando caminho alternativo: {alt_path}")
        if alt_path.exists():
            file_path = alt_path
        else:
            print(f"[Recording Audio] Arquivo não encontrado no servidor: {file_path}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Arquivo de áudio não encontrado no servidor"
            )
    
    # Determinar content type baseado na extensão
    content_type = "audio/webm"
    if file_path.suffix == ".mp3":
        content_type = "audio/mpeg"
    elif file_path.suffix == ".wav":
        content_type = "audio/wav"
    elif file_path.suffix == ".m4a":
        content_type = "audio/mp4"
    elif file_path.suffix == ".ogg":
        content_type = "audio/ogg"
    
    print(f"[Recording Audio] Retornando arquivo: {file_path}, tipo: {content_type}, tamanho: {file_path.stat().st_size if file_path.exists() else 0} bytes")
    
    return FileResponse(
        path=str(file_path.absolute()),
        media_type=content_type,
        filename=file_path.name,
    )


@router.put("/{recording_id}", response_model=RecordingResponse)
async def update_recording(
    recording_id: str,
    data: RecordingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Atualiza uma gravação."""
    service = RecordingService(db)
    recording = await service.update_recording(
        recording_id,
        data,
        updated_by=current_user.id,
    )
    
    if not recording:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gravação não encontrada"
        )
    
    return recording


@router.delete("/{recording_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recording(
    recording_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Deleta uma gravação."""
    service = RecordingService(db)
    result = await service.delete_recording(recording_id)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gravação não encontrada"
        )
    
    return None

