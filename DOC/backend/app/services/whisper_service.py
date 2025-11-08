import os
import tempfile
from typing import Optional
from fastapi import HTTPException, status
from app.config import settings

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    whisper = None

# Cache global para o modelo Whisper (evita recarregar a cada requisição)
_whisper_model_cache = {}


class WhisperService:
    def __init__(self, model_size: str = "base"):
        """
        Inicializa o serviço Whisper local.
        
        Args:
            model_size: Tamanho do modelo Whisper (tiny, base, small, medium, large)
        """
        if not WHISPER_AVAILABLE:
            raise ValueError(
                "Biblioteca 'openai-whisper' não instalada. "
                "Instale com: pip install openai-whisper"
            )
        
        self.model_size = model_size
        self.model = self._get_or_load_model()
    
    def _get_or_load_model(self):
        """Carrega o modelo Whisper localmente com cache."""
        global _whisper_model_cache
        
        # Verificar se o modelo já está em cache
        if self.model_size in _whisper_model_cache:
            print(f"[WhisperService] Usando modelo '{self.model_size}' do cache")
            return _whisper_model_cache[self.model_size]
        
        # Carregar modelo e adicionar ao cache
        try:
            print(f"[WhisperService] Carregando modelo Whisper '{self.model_size}'...")
            print("(Primeira execução pode demorar para baixar o modelo)")
            model = whisper.load_model(self.model_size)
            _whisper_model_cache[self.model_size] = model
            print(f"[WhisperService] Modelo '{self.model_size}' carregado com sucesso!")
            return model
        except Exception as e:
            import traceback
            error_msg = f"Erro ao carregar modelo Whisper: {str(e)}"
            print(f"[WhisperService] {error_msg}")
            print(traceback.format_exc())
            raise ValueError(error_msg)
    
    async def transcribe_file(self, audio_file_path: str, language: str = "pt") -> str:
        """
        Transcreve um arquivo de áudio usando Whisper local.
        
        Args:
            audio_file_path: Caminho do arquivo de áudio
            language: Código do idioma (pt para português)
        
        Returns:
            Texto transcrito
        """
        if not os.path.exists(audio_file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Arquivo de áudio não encontrado: {audio_file_path}"
            )
        
        try:
            # Usar Whisper local para transcrever (executar em thread para não bloquear)
            import asyncio
            
            def _transcribe():
                try:
                    print(f"[WhisperService] Iniciando transcrição do arquivo: {audio_file_path}")
                    result = self.model.transcribe(
                        audio_file_path,
                        language=language,
                        task="transcribe"
                    )
                    print(f"[WhisperService] Transcrição concluída")
                    return result
                except Exception as e:
                    import traceback
                    print(f"[WhisperService] Erro na função _transcribe: {str(e)}")
                    print(traceback.format_exc())
                    raise
            
            # Executar em thread pool para não bloquear o event loop
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, _transcribe)
            
            # O resultado é um dicionário com a chave 'text'
            transcript = result.get("text", "").strip()
            
            if not transcript:
                print(f"[WhisperService] Aviso: Transcrição retornou vazio. Resultado completo: {result}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Transcrição retornou vazio"
                )
            
            print(f"[WhisperService] Transcrição gerada: {len(transcript)} caracteres")
            return transcript
        except HTTPException:
            raise
        except Exception as e:
            import traceback
            print(f"[WhisperService] Erro ao transcrever: {str(e)}")
            print(traceback.format_exc())
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao transcrever áudio: {str(e)}"
            )
    
    async def transcribe_url(self, audio_url: str, language: str = "pt") -> str:
        """
        Transcreve um áudio a partir de uma URL.
        
        Args:
            audio_url: URL do arquivo de áudio
            language: Código do idioma (pt para português)
        
        Returns:
            Texto transcrito
        """
        try:
            import requests
            
            response = requests.get(audio_url, timeout=30)
            response.raise_for_status()
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                temp_file.write(response.content)
                temp_path = temp_file.name
            
            try:
                transcript = await self.transcribe_file(temp_path, language)
                return transcript
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao transcrever áudio da URL: {str(e)}"
            )
    
    async def transcribe_bytes(self, audio_bytes: bytes, language: str = "pt", file_extension: str = ".mp3") -> str:
        """
        Transcreve áudio a partir de bytes.
        
        Args:
            audio_bytes: Bytes do arquivo de áudio
            language: Código do idioma (pt para português)
            file_extension: Extensão do arquivo (.mp3, .wav, .m4a, etc.)
        
        Returns:
            Texto transcrito
        """
        try:
            if not file_extension.startswith("."):
                file_extension = "." + file_extension
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                temp_file.write(audio_bytes)
                temp_path = temp_file.name
            
            try:
                transcript = await self.transcribe_file(temp_path, language)
                return transcript
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro ao transcrever áudio: {str(e)}"
            )

