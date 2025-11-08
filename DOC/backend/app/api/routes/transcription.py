from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.services.whisper_service import WhisperService
from app.utils.dependencies import get_current_active_user
from app.models.user import User
from app.config import settings
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
    try:
        # Validar content_type de forma mais flexível
        # WebM pode vir como video/webm ou audio/webm
        # Se content_type não estiver presente, aceitar baseado na extensão do arquivo
        if audio.content_type:
            is_audio = audio.content_type.startswith("audio/")
            is_video_webm = audio.content_type == "video/webm"  # WebM pode ser video/webm
            if not (is_audio or is_video_webm):
                # Verificar se é um formato de áudio conhecido pela extensão
                if audio.filename:
                    _, ext = os.path.splitext(audio.filename)
                    audio_extensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac', '.aac']
                    if ext.lower() not in audio_extensions:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"O arquivo deve ser um arquivo de áudio. Tipo recebido: {audio.content_type}"
                        )
        
        # Usar modelo configurado ou padrão 'base'
        try:
            model_size = getattr(settings, 'whisper_model_size', 'base')
            whisper_service = WhisperService(model_size=model_size)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao inicializar Whisper: {str(e)}"
            )
        
        audio_bytes = await audio.read()
        
        print(f"[Transcription] Recebido arquivo: {audio.filename}, tipo: {audio.content_type}, tamanho: {len(audio_bytes)} bytes")
        
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
        
        print(f"[Transcription] Iniciando transcrição com extensão: {file_extension}, idioma: {language}")
        transcript = await whisper_service.transcribe_bytes(audio_bytes, language=language, file_extension=file_extension)
        print(f"[Transcription] Transcrição concluída: {len(transcript)} caracteres")
        
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
        import traceback
        print(f"[Transcription] ValueError: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro de configuração: {str(e)}"
        )
    except Exception as e:
        import traceback
        print(f"[Transcription] Exception: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao transcrever áudio: {str(e)}"
        )
