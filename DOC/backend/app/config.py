from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    cors_origins: List[str] = []
    environment: str = "development"
    debug: bool = True
    
    google_client_id: str | None = None
    google_client_secret: str | None = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

