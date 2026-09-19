from pydantic import BaseModel
from typing import Dict, List, Optional
from app.schemas.pet import PetListItem


class DashboardSummaryResponse(BaseModel):
    total_pets: int
    total_owners: int
    species: Dict[str, int]
    pets_with_allergies: int
    pets_with_diseases: int
    pets_with_documents: int


class SegmentDataResponse(BaseModel):
    species: Dict[str, int]
    age_group: Dict[str, int]
    gender: Dict[str, int]
    health: Dict[str, int]
    allergy_status: Dict[str, int]
    size: Dict[str, int]


class PaginatedPetsResponse(BaseModel):
    items: List[PetListItem]
    total: int
    limit: int
    offset: int
