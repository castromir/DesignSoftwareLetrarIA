from sqlalchemy.ext.asyncio import AsyncSession

from app.services.genai.base import BaseAIService, AIServiceError
from app.services.genai.client import get_genai_client, get_genai_model_config


# Mantido para compatibilidade com imports existentes
GeminiServiceError = AIServiceError


class GeminiService(BaseAIService):
    def __init__(self, session: AsyncSession):
        super().__init__(session)
        self.client = get_genai_client()
        self.model_config = get_genai_model_config()

    async def _call_model(self, prompt: str) -> str:
        config = self.model_config.copy()
        model_id = config.pop("model", "models/gemini-2.5-flash")
        config.pop("location", None)
        if not model_id.startswith("models/"):
            model_id = f"models/{model_id}"

        try:
            response = self.client.models.generate_content(
                model=model_id,
                contents=prompt,
                **config,
            )
        except Exception as exc:
            raise AIServiceError("Falha ao gerar conteúdo com o Gemini") from exc

        answer = getattr(response, "text", None)
        if not answer:
            raise AIServiceError("Resposta vazia recebida do Gemini")
        return answer
