from __future__ import annotations

import os
from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path


def _csv(value: str, fallback: list[str]) -> list[str]:
    items = [item.strip() for item in value.split(",") if item.strip()]
    return items or fallback


def _bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class AppSettings:
    app_name: str = os.getenv("APP_NAME", "Jarvis Enterprise Voice Assistant")
    app_env: str = os.getenv("APP_ENV", "development")
    api_prefix: str = os.getenv("API_PREFIX", "/api/v1")
    assistant_name: str = os.getenv("ASSISTANT_NAME", "Jarvis")
    default_locale: str = os.getenv("DEFAULT_LOCALE", "en-IN")
    database_path: Path = Path(os.getenv("DATABASE_PATH", "data/voice_assistant.db"))
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    cors_origins: list[str] = field(
        default_factory=lambda: _csv(
            os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://192.168.1.183:3000"),
            ["http://localhost:3000"],
        )
    )
    jwt_secret: str = os.getenv("JWT_SECRET", "change-this-secret-before-production")
    jwt_issuer: str = os.getenv("JWT_ISSUER", "voice-assistant-platform")
    jwt_audience: str = os.getenv("JWT_AUDIENCE", "voice-assistant-web")
    access_token_minutes: int = int(os.getenv("ACCESS_TOKEN_MINUTES", "120"))
    enable_desktop_actions: bool = _bool("ENABLE_DESKTOP_ACTIONS", False)
    music_directory: Path = Path(os.getenv("MUSIC_DIRECTORY", str(Path.home() / "Music")))
    default_user_email: str = os.getenv("DEFAULT_USER_EMAIL", "admin@example.com")
    default_user_password: str = os.getenv("DEFAULT_USER_PASSWORD", "admin123")
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_user: str = os.getenv("SMTP_USER", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    settings = AppSettings()
    settings.database_path.parent.mkdir(parents=True, exist_ok=True)
    return settings
