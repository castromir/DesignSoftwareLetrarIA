import json
import os
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    cors_origins: List[str] = ["*"]  # Default para desenvolvimento
    environment: str = "development"
    debug: bool = True

    google_client_id: str | None = None
    google_client_secret: str | None = None

    whisper_model_size: str = "base"
    openai_api_key: str | None = (
        None  # Mantido para compatibilidade, mas não usado mais
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",  # Ignorar campos extras no .env
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Processar CORS_ORIGINS do ambiente
        cors_origins_env = os.getenv("CORS_ORIGINS", '["*"]')

        if cors_origins_env:
            try:
                # Tentar parsear como JSON
                parsed = json.loads(cors_origins_env)
                if isinstance(parsed, list):
                    self.cors_origins = parsed
                    print(
                        f"[Config] CORS origins carregadas do JSON: {self.cors_origins}"
                    )
                else:
                    print(f"[Config] CORS_ORIGINS não é uma lista, usando default")
                    self.cors_origins = ["*"]
            except (json.JSONDecodeError, TypeError) as e:
                print(f"[Config] Erro ao parsear CORS_ORIGINS JSON: {e}")
                # Tentar split por vírgula como fallback
                if "," in cors_origins_env:
                    self.cors_origins = [
                        origin.strip() for origin in cors_origins_env.split(",")
                    ]
                    print(f"[Config] CORS origins do split: {self.cors_origins}")
                else:
                    # Usar valor único
                    self.cors_origins = [cors_origins_env.strip()]
                    print(f"[Config] CORS origins valor único: {self.cors_origins}")
        else:
            self.cors_origins = ["*"]
            print(f"[Config] CORS_ORIGINS vazio, usando default: {self.cors_origins}")


settings = Settings()

# Log de configuração ao carregar
print("=" * 60)
print("LetrarIA - Configuração Carregada")
print("=" * 60)
print(f"Environment: {settings.environment}")
print(f"Debug: {settings.debug}")
print(f"Database URL: {settings.database_url[:50]}...")
print(f"CORS Origins: {settings.cors_origins}")
print(f"Whisper Model: {settings.whisper_model_size}")
print("=" * 60)
