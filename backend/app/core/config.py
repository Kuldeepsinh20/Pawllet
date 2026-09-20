import json
import os
from typing import List, Union
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pawlet_db"

    # CORS Origins configuration
    # Can be a comma-separated string, JSON list, or list of strings
    CORS_ORIGINS: Union[str, List[str]] = (
        "https://pawlet-inky.vercel.app,"
        "http://localhost:3000,http://localhost:3001,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:5173"
    )

    # Regex pattern to match any pawlet vercel deployment (e.g. pawlet-inky.vercel.app, pawlet.vercel.app)
    CORS_ORIGIN_REGEX: str = r"^https:\/\/(pawlet[a-z0-9-]*\.vercel\.app)$"

    UPLOAD_DIR: str = "../storage/uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB

    # Authentication & Security
    JWT_SECRET_KEY: str = "pawlet_jwt_secret_key_change_in_production_2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Default Admin Seed Credentials (used to initialize DB if empty)
    ADMIN_USERNAME: str = "Pawllet@care"
    ADMIN_PASSWORD: str = "pawlletpetcare"

    @property
    def cors_origins_list(self) -> List[str]:
        """
        Parses CORS_ORIGINS from string (comma-separated or JSON list) or list,
        normalizes each URL (stripping whitespace, trailing slashes, surrounding quotes),
        and guarantees mandatory production origin and local development origins.
        """
        mandatory_origins = [
            "https://pawlet-inky.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:5173",
        ]

        raw = self.CORS_ORIGINS
        parsed_entries = []

        if isinstance(raw, list):
            parsed_entries = list(raw)
        elif isinstance(raw, str):
            trimmed = raw.strip()
            if trimmed.startswith("[") and trimmed.endswith("]"):
                try:
                    loaded = json.loads(trimmed)
                    if isinstance(loaded, list):
                        parsed_entries = [str(item) for item in loaded]
                except Exception:
                    parsed_entries = trimmed.strip("[]").split(",")
            else:
                parsed_entries = trimmed.split(",")

        normalized: set[str] = set()
        for item in parsed_entries + mandatory_origins:
            if not item:
                continue
            # Strip whitespace, quotes, and trailing slashes
            cleaned = str(item).strip().strip("'\"").rstrip("/")
            if cleaned:
                normalized.add(cleaned)

        return sorted(list(normalized))

    @property
    def upload_dir_abs(self) -> str:
        """Resolve upload dir relative to the backend/ folder."""
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        path = os.path.abspath(os.path.join(backend_dir, self.UPLOAD_DIR))
        os.makedirs(path, exist_ok=True)
        return path

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
