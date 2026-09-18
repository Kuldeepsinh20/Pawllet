from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator
from app.schemas.owner import OwnerCreate, OwnerResponse
from app.schemas.health import HealthCreate, HealthResponse
from app.schemas.document import DocumentResponse


# ── Category ──────────────────────────────────────────────────────────────────
class CategoryResponse(BaseModel):
    type: str
    value: str

    model_config = {"from_attributes": True}


# ── Pet Create (POST /api/v1/pets body) ───────────────────────────────────────
class PetCreate(BaseModel):
    # Owner info
    owner: OwnerCreate

    # Pet fields
    species: str
    name: str
    breed: str
    dob: date
    place: str
    height: float
    weight: float
    gender: str

    # Health (optional page 2)
    health: Optional[HealthCreate] = None
    vaccines: List[str] = []
    allergies: List[str] = []
    diseases: List[str] = []
    medications: List[str] = []
    food: List[str] = []

    @field_validator("species")
    @classmethod
    def validate_species(cls, v: str) -> str:
        allowed = {"Dogs", "Cats", "Birds", "Small mammals", "Farm Animals"}
        if v not in allowed:
            raise ValueError(f"species must be one of: {', '.join(sorted(allowed))}")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        allowed = {"Male", "Female"}
        if v not in allowed:
            raise ValueError("gender must be Male or Female")
        return v

    @field_validator("height", "weight")
    @classmethod
    def validate_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Must be greater than 0")
        return v


# ── Pet Update ────────────────────────────────────────────────────────────────
class PetUpdate(BaseModel):
    species: Optional[str] = None
    name: Optional[str] = None
    breed: Optional[str] = None
    dob: Optional[date] = None
    place: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    gender: Optional[str] = None

    owner: Optional[OwnerCreate] = None
    health: Optional[HealthCreate] = None
    vaccines: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    diseases: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    food: Optional[List[str]] = None


# ── List item (GET /api/v1/pets) ──────────────────────────────────────────────
class PetListItem(BaseModel):
    id: str
    species: str
    name: str
    breed: str
    dob: date
    age: str
    place: str
    height: float
    weight: float
    gender: str
    created_at: datetime
    owner_name: str
    owner_contact: str

    model_config = {"from_attributes": True}


# ── Full detail (GET /api/v1/pets/{id}) ───────────────────────────────────────
class PetDetailResponse(BaseModel):
    id: str
    species: str
    name: str
    breed: str
    dob: date
    age: str
    place: str
    height: float
    weight: float
    gender: str
    created_at: datetime

    owner: OwnerResponse
    health: Optional[HealthResponse] = None
    vaccines: List[str] = []
    allergies: List[str] = []
    diseases: List[str] = []
    medications: List[str] = []
    food: List[str] = []
    categories: List[CategoryResponse] = []
    documents: List[DocumentResponse] = []

    model_config = {"from_attributes": True}
