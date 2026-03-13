import logging

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.services.genai.base import BaseAIService, AIServiceError

logger = logging.getLogger(__name__)

_SEPARATOR = "\n\n---\n\n"


class OllamaService(BaseAIService):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.base_url = (settings.ollama_base_url or "").rstrip("/")
        self.model = settings.ollama_model

    async def _call_model(self, prompt: str) -> str:
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

        url = f"{self.base_url}/api/generate"
        logger.info("[ollama] POST %s | model=%s | prompt_len=%d | system_len=%d",
                    url, self.model, len(user_part), len(system_part))

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, json=payload)
                logger.info("[ollama] HTTP %s", response.status_code)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPStatusError as exc:
            logger.error("[ollama] HTTP error %s: %s", exc.response.status_code, exc.response.text[:300])
            raise AIServiceError(f"Ollama retornou HTTP {exc.response.status_code}") from exc
        except httpx.HTTPError as exc:
            logger.error("[ollama] Conexão falhou: %s", exc)
            raise AIServiceError(f"Erro ao chamar Ollama: {exc}") from exc

        answer = data.get("response", "")
        logger.info("[ollama] Resposta recebida | len=%d | preview=%.150r", len(answer), answer)

        if not answer:
            raise AIServiceError("Resposta vazia recebida do Ollama")
        return answer
