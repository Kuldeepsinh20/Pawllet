from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pawlet_db"
    CORS_ORIGINS: str = (
        "http://localhost:3000,http://localhost:3001,http://localhost:5173,"
        "http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:5173,"
        "https://pawlet-inky.vercel.app"
    )
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
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def upload_dir_abs(self) -> str:
        """Resolve upload dir relative to the backend/ folder."""
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        path = os.path.abspath(os.path.join(backend_dir, self.UPLOAD_DIR))
        os.makedirs(path, exist_ok=True)
        return path

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
