from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json
import os


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    cors_origins: List[str] = []
    environment: str = "development"
    debug: bool = True
    
    google_client_id: str | None = None
    google_client_secret: str | None = None
    
    whisper_model_size: str = "base"
    openai_api_key: str | None = None  # Mantido para compatibilidade, mas não usado mais
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"  # Ignorar campos extras no .env
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        cors_origins_env = os.getenv("CORS_ORIGINS", "[]")
        if isinstance(cors_origins_env, str):
            try:
                self.cors_origins = json.loads(cors_origins_env)
            except (json.JSONDecodeError, TypeError):
                if cors_origins_env:
                    self.cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]
                else:
                    self.cors_origins = []


settings = Settings()

