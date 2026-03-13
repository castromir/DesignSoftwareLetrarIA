import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.genai.base import BaseAIService, AIServiceError


class OllamaService(BaseAIService):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.base_url = (settings.ollama_base_url or "").rstrip("/")
        self.model = settings.ollama_model

    async def _call_model(self, prompt: str) -> str:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise AIServiceError(f"Erro ao chamar Ollama: {exc}") from exc

        answer = data.get("response", "")
        if not answer:
            raise AIServiceError("Resposta vazia recebida do Ollama")
        return answer
