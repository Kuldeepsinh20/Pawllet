from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/pawlet_db"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:5173"
    UPLOAD_DIR: str = "../storage/uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB

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
