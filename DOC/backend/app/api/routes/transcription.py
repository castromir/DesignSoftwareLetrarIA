from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.services.whisper_service import WhisperService
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from typing import Optional
import os

router = APIRouter(prefix="/transcription", tags=["transcrição"])


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form("pt", description="Código do idioma (pt para português)"),
    current_user: User = Depends(get_current_active_user),
):
    """
    Transcreve um arquivo de áudio usando Whisper.
    
    - **audio**: Arquivo de áudio (formatos suportados: mp3, wav, m4a, webm, etc.)
    - **language**: Código do idioma (padrão: pt)
    
    Retorna o texto transcrito.
    """
    if not audio.content_type or not audio.content_type.startswith("audio/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O arquivo deve ser um arquivo de áudio"
        )
    
    try:
        whisper_service = WhisperService()
        
        audio_bytes = await audio.read()
        
        if len(audio_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="O arquivo de áudio está vazio"
            )
        
        max_file_size = 25 * 1024 * 1024
        if len(audio_bytes) > max_file_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Arquivo muito grande. Tamanho máximo: {max_file_size / 1024 / 1024}MB"
            )
        
        file_extension = ".mp3"
        if audio.filename:
            _, ext = os.path.splitext(audio.filename)
            if ext:
                file_extension = ext.lower()
        
        transcript = await whisper_service.transcribe_bytes(audio_bytes, language=language, file_extension=file_extension)
        
        return JSONResponse(
            content={
                "transcript": transcript,
                "filename": audio.filename,
                "content_type": audio.content_type,
                "language": language,
            },
            status_code=status.HTTP_200_OK
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro de configuração: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao transcrever áudio: {str(e)}"
        )
