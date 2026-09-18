from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class OwnerCreate(BaseModel):
    name: str
    contact: str
    aadhar: Optional[str] = None
    address: str


class OwnerResponse(BaseModel):
    id: str
    name: str
    contact: str
    aadhar: Optional[str] = None
    address: str
    created_at: datetime

    model_config = {"from_attributes": True}
