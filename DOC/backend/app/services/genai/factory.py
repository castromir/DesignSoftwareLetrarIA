from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.genai.base import BaseAIService


def get_ai_service(session: AsyncSession) -> BaseAIService:
    """Retorna o serviço de IA configurado via AI_PROVIDER (.env)."""
    provider = (settings.ai_provider or "gemini").lower()

    if provider == "ollama":
        from app.services.genai.ollama import OllamaService
        return OllamaService(session)

    from app.services.genai.service import GeminiService
    return GeminiService(session)
