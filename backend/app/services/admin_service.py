from typing import Optional, Dict, Any, List
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session

from app.models.pet import Pet
from app.models.owner import Owner
from app.models.allergy import Allergy
from app.models.disease import Disease
from app.models.document import Document
from app.models.category import PetCategory
from app.utils.age_calculator import calculate_age


def get_dashboard_summary(db: Session) -> Dict[str, Any]:
    """Calculate live aggregated metrics for the admin overview dashboard."""
    total_pets = db.query(func.count(Pet.id)).scalar() or 0
    total_owners = db.query(func.count(Owner.id)).scalar() or 0

    # Species breakdown
    species_rows = (
        db.query(Pet.species, func.count(Pet.id))
        .group_by(Pet.species)
        .all()
    )
    species_dict = {
        "Dogs": 0,
        "Cats": 0,
        "Birds": 0,
        "Small mammals": 0,
        "Farm Animals": 0,
    }
    for sp, count in species_rows:
        species_dict[sp] = count

    pets_with_allergies = db.query(func.count(distinct(Allergy.pet_id))).scalar() or 0
    pets_with_diseases = db.query(func.count(distinct(Disease.pet_id))).scalar() or 0
    pets_with_documents = db.query(func.count(distinct(Document.pet_id))).scalar() or 0

    return {
        "total_pets": total_pets,
        "total_owners": total_owners,
        "species": species_dict,
        "pets_with_allergies": pets_with_allergies,
        "pets_with_diseases": pets_with_diseases,
        "pets_with_documents": pets_with_documents,
    }


def get_segments_data(db: Session) -> Dict[str, Dict[str, int]]:
    """Aggregate multi-dimensional segmentation counts from the database."""
    rows = (
        db.query(
            PetCategory.category_type,
            PetCategory.category_value,
            func.count(PetCategory.id),
        )
        .group_by(PetCategory.category_type, PetCategory.category_value)
        .all()
    )

    result = {
        "species": {},
        "age_group": {},
        "gender": {},
        "health": {},
        "allergy_status": {},
        "size": {},
    }
    for cat_type, cat_val, count in rows:
        if cat_type in result:
            result[cat_type][cat_val] = count

    return result


def get_admin_pets(
    db: Session,
    search: Optional[str] = None,
    species: Optional[str] = None,
    gender: Optional[str] = None,
    category_type: Optional[str] = None,
    category_value: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> Dict[str, Any]:
    """Retrieve paginated and filtered pets for the admin data grid."""
    q = db.query(Pet).join(Pet.owner)

    if species:
        q = q.filter(Pet.species == species)
    if gender:
        q = q.filter(Pet.gender == gender)
    if category_type and category_value:
        q = q.join(Pet.categories).filter(
            PetCategory.category_type == category_type,
            PetCategory.category_value == category_value,
        )
    if search:
        term = f"%{search}%"
        q = q.filter(
            Pet.name.ilike(term)
            | Pet.breed.ilike(term)
            | Pet.species.ilike(term)
            | Owner.name.ilike(term)
        )

    total = q.count()
    pets = q.order_by(Pet.created_at.desc()).offset(offset).limit(limit).all()

    items = [
        {
            "id": p.id,
            "species": p.species,
            "name": p.name,
            "breed": p.breed,
            "dob": p.dob,
            "age": calculate_age(p.dob),
            "place": p.place,
            "height": p.height,
            "weight": p.weight,
            "gender": p.gender,
            "created_at": p.created_at,
            "owner_name": p.owner.name if p.owner else "",
            "owner_contact": p.owner.contact if p.owner else "",
        }
        for p in pets
    ]

    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    }
