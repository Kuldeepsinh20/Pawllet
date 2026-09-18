from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class HealthCreate(BaseModel):
    grooming: Optional[str] = None
    routine: Optional[str] = None
    last_visit: Optional[date] = None


class HealthResponse(BaseModel):
    id: str
    grooming: Optional[str] = None
    routine: Optional[str] = None
    last_visit: Optional[date] = None

    model_config = {"from_attributes": True}
