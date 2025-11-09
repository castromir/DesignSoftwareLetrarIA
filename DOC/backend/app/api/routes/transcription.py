import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.config import settings
from app.models.user import User
from app.services.whisper_service import WhisperService
from app.utils.dependencies import get_current_active_user

router = APIRouter(prefix="/transcription", tags=["transcrição"])


@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(
        "pt", description="Código do idioma (pt para português)"
    ),
    save_to_disk: Optional[bool] = Form(
        False, description="Salvar transcrição em arquivo .txt"
    ),
    current_user: User = Depends(get_current_active_user),
):
    """
    Transcreve um arquivo de áudio usando Whisper.

    - **audio**: Arquivo de áudio (formatos suportados: mp3, wav, m4a, webm, etc.)
    - **language**: Código do idioma (padrão: pt)
    - **save_to_disk**: Se True, salva a transcrição em arquivo .txt na pasta transcriptions/

    Retorna o texto transcrito e opcionalmente o caminho do arquivo salvo.
    """
    try:
        # Validar se o arquivo foi enviado
        if not audio or not audio.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nenhum arquivo de áudio foi enviado",
            )

        # Lista de extensões de áudio suportadas
        audio_extensions = [
            ".mp3",
            ".wav",
            ".m4a",
            ".webm",
            ".ogg",
            ".flac",
            ".aac",
            ".opus",
        ]

        # Validar extensão do arquivo
        file_extension = ".mp3"
        if audio.filename:
            _, ext = os.path.splitext(audio.filename)
            if ext:
                file_extension = ext.lower()
                if file_extension not in audio_extensions:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Formato de arquivo não suportado: {file_extension}. Formatos aceitos: {', '.join(audio_extensions)}",
                    )

        # Validar content_type de forma mais flexível
        # WebM pode vir como video/webm ou audio/webm
        if audio.content_type:
            is_audio = audio.content_type.startswith("audio/")
            is_video_webm = audio.content_type == "video/webm"
            is_octet_stream = audio.content_type == "application/octet-stream"

            if not (is_audio or is_video_webm or is_octet_stream):
                print(
                    f"[Transcription] Aviso: Content-Type inesperado: {audio.content_type}, mas extensão válida: {file_extension}"
                )

        # Ler bytes do arquivo
        audio_bytes = await audio.read()

        # Validar tamanho mínimo (pelo menos 1KB)
        min_file_size = 1024  # 1KB
        if len(audio_bytes) < min_file_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"O arquivo de áudio é muito pequeno (menos de {min_file_size} bytes). Verifique se a gravação foi feita corretamente.",
            )

        # Validar tamanho máximo (25MB)
        max_file_size = 25 * 1024 * 1024  # 25MB
        if len(audio_bytes) > max_file_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Arquivo muito grande. Tamanho máximo permitido: {max_file_size / 1024 / 1024:.0f}MB. Tamanho recebido: {len(audio_bytes) / 1024 / 1024:.2f}MB",
            )

        print(
            f"[Transcription] Processando arquivo: {audio.filename}, tipo: {audio.content_type}, tamanho: {len(audio_bytes)} bytes ({len(audio_bytes) / 1024:.2f}KB)"
        )

        # Usar modelo configurado ou padrão 'base'
        try:
            model_size = getattr(settings, "whisper_model_size", "base")
            whisper_service = WhisperService(model_size=model_size)
        except ValueError as e:
            print(f"[Transcription] Erro ao inicializar Whisper: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao inicializar serviço de transcrição: {str(e)}",
            )

        print(
            f"[Transcription] Iniciando transcrição com Whisper (modelo: {model_size}), extensão: {file_extension}, idioma: {language}"
        )
        transcript = await whisper_service.transcribe_bytes(
            audio_bytes, language=language, file_extension=file_extension
        )

        # Validar se a transcrição retornou algo
        if not transcript or len(transcript.strip()) == 0:
            print(
                "[Transcription] Aviso: Transcrição resultou em texto vazio. Possível áudio sem fala detectável."
            )
            transcript = ""

        print(f"[Transcription] Transcrição concluída: {len(transcript)} caracteres")

        # Opcionalmente salvar em arquivo
        saved_file_path = None
        if save_to_disk:
            try:
                # Criar diretório transcriptions se não existir
                transcriptions_dir = Path("transcriptions")
                transcriptions_dir.mkdir(exist_ok=True)

                # Gerar nome do arquivo
                base_filename = Path(audio.filename).stem if audio.filename else "audio"
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                txt_filename = f"{base_filename}_transcription_{timestamp}.txt"
                txt_path = transcriptions_dir / txt_filename

                # Salvar transcrição
                with open(txt_path, "w", encoding="utf-8") as f:
                    f.write(transcript)

                saved_file_path = str(txt_path)
                print(f"[Transcription] Transcrição salva em: {saved_file_path}")
            except Exception as e:
                print(f"[Transcription] Erro ao salvar arquivo: {str(e)}")
                # Não falhar a requisição se apenas o salvamento falhar

        response_data = {
            "transcript": transcript,
            "filename": audio.filename,
            "content_type": audio.content_type,
            "language": language,
        }

        if saved_file_path:
            response_data["saved_file_path"] = saved_file_path

        return JSONResponse(content=response_data, status_code=status.HTTP_200_OK)

    except HTTPException:
        raise
    except ValueError as e:
        import traceback

        error_trace = traceback.format_exc()
        print(f"[Transcription] ValueError: {str(e)}")
        print(error_trace)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro de validação ao processar áudio: {str(e)}",
        )
    except OSError as e:
        import traceback

        error_trace = traceback.format_exc()
        print(f"[Transcription] OSError (possível problema com arquivo): {str(e)}")
        print(error_trace)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao processar arquivo de áudio: {str(e)}. Verifique se o formato está correto.",
        )
    except Exception as e:
        import traceback

        error_trace = traceback.format_exc()
        print(f"[Transcription] Exception não tratada: {type(e).__name__}: {str(e)}")
        print(error_trace)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro inesperado ao transcrever áudio: {str(e)}. Tente novamente ou contate o suporte.",
        )
