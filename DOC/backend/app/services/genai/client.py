from functools import lru_cache
from typing import Dict

from google import genai

from app.config import settings


class GeminiClientError(RuntimeError):
    pass


def _resolve_api_key() -> str:
    api_key = settings.google_genai_api_key
    if not api_key:
        raise GeminiClientError("Google Gemini API key is not configured")
    return api_key


@lru_cache(maxsize=1)
def get_genai_client() -> genai.Client:
    api_key = _resolve_api_key()
    return genai.Client(api_key=api_key)


@lru_cache(maxsize=1)
def get_genai_model_config() -> Dict[str, str]:
    config: Dict[str, str] = {"model": settings.google_genai_model}
    if settings.google_genai_location:
        config["location"] = settings.google_genai_location
    return config

