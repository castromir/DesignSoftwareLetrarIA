import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.genai.base import BaseAIService, AIServiceError

# Delimitador usado para separar system prompt do conteúdo no prompt concatenado
_SEPARATOR = "\n\n---\n\n"


class OllamaService(BaseAIService):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.base_url = (settings.ollama_base_url or "").rstrip("/")
        self.model = settings.ollama_model

    async def _call_model(self, prompt: str) -> str:
        # Separa system prompt do user message pelo separador padrão
        if _SEPARATOR in prompt:
            system_part, user_part = prompt.split(_SEPARATOR, 1)
        else:
            system_part = ""
            user_part = prompt

        messages = []
        if system_part.strip():
            messages.append({"role": "system", "content": system_part.strip()})
        messages.append({"role": "user", "content": user_part.strip()})

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload,
                )
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            raise AIServiceError(f"Erro ao chamar Ollama: {exc}") from exc

        answer = data.get("message", {}).get("content", "")
        if not answer:
            raise AIServiceError("Resposta vazia recebida do Ollama")
        return answer
