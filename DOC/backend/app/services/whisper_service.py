import os
import tempfile
from typing import Optional
from fastapi import HTTPException, status
from openai import OpenAI
from app.config import settings


class WhisperService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.openai_api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY não configurada. Configure no arquivo .env ou nas settings.")
        self.client = OpenAI(api_key=self.api_key)
    
    async def transcribe_file(self, audio_file_path: str, language: str = "pt") -> str:
        """
        Transcreve um arquivo de áudio usando Whisper.
        
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
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    language=language,
                    response_format="text"
                )
                return transcript.strip()
        except Exception as e:
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

