from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.pet import PetCreate, PetUpdate, PetDetailResponse, PetListItem
from app.schemas.document import DocumentResponse
from app.services import pet_service, document_service
from fastapi import UploadFile, File, Form

router = APIRouter(prefix="/pets", tags=["Pets"])


@router.post("", response_model=PetDetailResponse, status_code=201)
def create_pet(data: PetCreate, db: Session = Depends(get_db)):
    """Create a complete pet record with owner, health, tags and categories."""
    result = pet_service.create_pet(data, db)
    return result


@router.get("", response_model=List[PetListItem])
def list_pets(
    search: Optional[str] = Query(None),
    species: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List pets with optional search and filter."""
    return pet_service.list_pets(db, search=search, species=species, gender=gender, limit=limit, offset=offset)


@router.get("/{pet_id}", response_model=PetDetailResponse)
def get_pet(pet_id: str, db: Session = Depends(get_db)):
    """Retrieve a single pet with all related data."""
    return pet_service.get_pet(pet_id, db)


@router.put("/{pet_id}", response_model=PetDetailResponse)
def update_pet(pet_id: str, data: PetUpdate, db: Session = Depends(get_db)):
    """Update pet, owner, health or tag data."""
    return pet_service.update_pet(pet_id, data, db)


@router.delete("/{pet_id}", status_code=204)
def delete_pet(pet_id: str, db: Session = Depends(get_db)):
    """Delete pet and all related records."""
    pet_service.delete_pet(pet_id, db)


@router.post("/{pet_id}/documents", response_model=DocumentResponse, status_code=201)
async def upload_document(
    pet_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload a document (PDF/image) and store metadata in DB."""
    # Verify pet exists
    pet_service.get_pet(pet_id, db)
    doc = await document_service.save_upload(pet_id, document_type, file, db)
    return doc
