from google import genai
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.genai.base import BaseAIService, AIServiceError
from app.services.genai.client import get_genai_client, get_genai_model_config

# Mantido para compatibilidade com imports existentes
GeminiServiceError = AIServiceError

# Delimitador usado para separar system prompt do conteúdo no prompt concatenado
_SEPARATOR = "\n\n---\n\n"


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

        # Tenta usar system_instruction (SDK >= 0.7) com fallback para prompt único
        if _SEPARATOR in prompt:
            system_part, user_part = prompt.split(_SEPARATOR, 1)
        else:
            system_part = ""
            user_part = prompt

        try:
            generate_config = genai.types.GenerateContentConfig(
                system_instruction=system_part.strip() or None,
            )
            response = self.client.models.generate_content(
                model=model_id,
                contents=user_part.strip(),
                config=generate_config,
            )
        except (AttributeError, TypeError):
            # Versão mais antiga do SDK: passa tudo como prompt único
            full_prompt = f"{system_part.strip()}\n\n{user_part.strip()}" if system_part.strip() else user_part.strip()
            try:
                response = self.client.models.generate_content(
                    model=model_id,
                    contents=full_prompt,
                    **config,
                )
            except Exception as exc:
                raise AIServiceError("Falha ao gerar conteúdo com o Gemini") from exc
        except Exception as exc:
            raise AIServiceError("Falha ao gerar conteúdo com o Gemini") from exc

        answer = getattr(response, "text", None)
        if not answer:
            raise AIServiceError("Resposta vazia recebida do Gemini")
        return answer
