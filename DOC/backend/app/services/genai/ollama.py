import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.genai.base import BaseAIService, AIServiceError

_SEPARATOR = "\n\n---\n\n"


class OllamaService(BaseAIService):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.base_url = (settings.ollama_base_url or "").rstrip("/")
        self.model = settings.ollama_model

    async def _call_model(self, prompt: str) -> str:
        # Monta o prompt final: system_part + separador + user_part como texto único
        # /api/generate aceita campo "system" separado para system instruction
        if _SEPARATOR in prompt:
            system_part, user_part = prompt.split(_SEPARATOR, 1)
        else:
            system_part = ""
            user_part = prompt

        payload = {
            "model": self.model,
            "prompt": user_part.strip(),
            "stream": False,
        }
        if system_part.strip():
            payload["system"] = system_part.strip()

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise AIServiceError(f"Erro ao chamar Ollama: {exc}") from exc

        answer = data.get("response", "")
        if not answer:
            raise AIServiceError("Resposta vazia recebida do Ollama")
        return answer
