"""
Pet service — all database operations for pets in a single transaction.
"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

from app.models.owner import Owner
from app.models.pet import Pet
from app.models.health import HealthDetail
from app.models.vaccine import Vaccine
from app.models.allergy import Allergy
from app.models.disease import Disease
from app.models.medication import Medication
from app.models.food import Food
from app.models.category import PetCategory
from app.schemas.pet import PetCreate, PetUpdate
from app.services.category_service import generate_categories
from app.utils.age_calculator import calculate_age


# ── Helpers ───────────────────────────────────────────────────────────────────

def _build_tags(model_cls, pet_id: str, names: List[str]):
    return [model_cls(pet_id=pet_id, name=n.strip()) for n in names if n.strip()]


def _pet_to_detail(pet: Pet) -> dict:
    """Convert ORM Pet object to a dict matching PetDetailResponse."""
    return {
        "id": pet.id,
        "species": pet.species,
        "name": pet.name,
        "breed": pet.breed,
        "dob": pet.dob,
        "age": calculate_age(pet.dob),
        "place": pet.place,
        "height": pet.height,
        "weight": pet.weight,
        "gender": pet.gender,
        "created_at": pet.created_at,
        "owner": pet.owner,
        "health": pet.health,
        "vaccines": [v.name for v in pet.vaccines],
        "allergies": [a.name for a in pet.allergies],
        "diseases": [d.name for d in pet.diseases],
        "medications": [m.name for m in pet.medications],
        "food": [f.name for f in pet.food],
        "categories": [
            {"type": c.category_type, "value": c.category_value}
            for c in pet.categories
        ],
        "documents": pet.documents,
    }


def _load_full(pet_id: str, db: Session) -> Pet:
    pet = (
        db.query(Pet)
        .options(
            joinedload(Pet.owner),
            joinedload(Pet.health),
            joinedload(Pet.vaccines),
            joinedload(Pet.allergies),
            joinedload(Pet.diseases),
            joinedload(Pet.medications),
            joinedload(Pet.food),
            joinedload(Pet.categories),
            joinedload(Pet.documents),
        )
        .filter(Pet.id == pet_id)
        .first()
    )
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found.")
    return pet


# ── Create ────────────────────────────────────────────────────────────────────

def create_pet(data: PetCreate, db: Session) -> dict:
    """Create owner + pet + health + tags + categories in a single transaction."""
    try:
        # 1. Owner
        owner = Owner(
            name=data.owner.name,
            contact=data.owner.contact,
            aadhar=data.owner.aadhar or None,
            address=data.owner.address,
        )
        db.add(owner)
        db.flush()  # get owner.id without committing

        # 2. Pet
        pet = Pet(
            owner_id=owner.id,
            species=data.species,
            name=data.name,
            breed=data.breed,
            dob=data.dob,
            place=data.place,
            height=data.height,
            weight=data.weight,
            gender=data.gender,
        )
        db.add(pet)
        db.flush()  # get pet.id

        # 3. Health details
        health_data = data.health or {}
        if isinstance(health_data, dict):
            grooming = health_data.get("grooming")
            routine = health_data.get("routine")
            last_visit = health_data.get("last_visit")
        else:
            grooming = health_data.grooming
            routine = health_data.routine
            last_visit = health_data.last_visit

        health = HealthDetail(
            pet_id=pet.id,
            grooming=grooming or None,
            routine=routine or None,
            last_visit=last_visit or None,
        )
        db.add(health)

        # 4. Tags
        for item in _build_tags(Vaccine, pet.id, data.vaccines):
            db.add(item)
        for item in _build_tags(Allergy, pet.id, data.allergies):
            db.add(item)
        for item in _build_tags(Disease, pet.id, data.diseases):
            db.add(item)
        for item in _build_tags(Medication, pet.id, data.medications):
            db.add(item)
        for item in _build_tags(Food, pet.id, data.food):
            db.add(item)

        # 5. Categories
        cat_dicts = generate_categories(
            species=data.species,
            breed=data.breed,
            dob=data.dob,
            weight_kg=data.weight,
            diseases=data.diseases,
            allergies=data.allergies,
        )
        for c in cat_dicts:
            db.add(PetCategory(
                pet_id=pet.id,
                category_type=c["category_type"],
                category_value=c["category_value"],
            ))

        db.commit()
        db.refresh(pet)

        full_pet = _load_full(pet.id, db)
        return _pet_to_detail(full_pet)

    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create pet record.") from exc


# ── List ──────────────────────────────────────────────────────────────────────

def list_pets(
    db: Session,
    search: Optional[str] = None,
    species: Optional[str] = None,
    gender: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[dict]:
    q = (
        db.query(Pet)
        .options(joinedload(Pet.owner))
        .join(Pet.owner)
    )

    if species:
        q = q.filter(Pet.species == species)
    if gender:
        q = q.filter(Pet.gender == gender)
    if search:
        term = f"%{search}%"
        q = q.filter(
            Pet.name.ilike(term) |
            Pet.breed.ilike(term) |
            Pet.species.ilike(term) |
            Owner.name.ilike(term)
        )

    pets = q.order_by(Pet.created_at.desc()).offset(offset).limit(limit).all()
    return [
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
            "owner_name": p.owner.name,
            "owner_contact": p.owner.contact,
        }
        for p in pets
    ]


# ── Get single ────────────────────────────────────────────────────────────────

def get_pet(pet_id: str, db: Session) -> dict:
    pet = _load_full(pet_id, db)
    return _pet_to_detail(pet)


# ── Update ────────────────────────────────────────────────────────────────────

def update_pet(pet_id: str, data: PetUpdate, db: Session) -> dict:
    pet = _load_full(pet_id, db)

    try:
        # Update pet fields
        for field in ("species", "name", "breed", "dob", "place", "height", "weight", "gender"):
            val = getattr(data, field, None)
            if val is not None:
                setattr(pet, field, val)

        # Update owner
        if data.owner:
            for field in ("name", "contact", "address"):
                val = getattr(data.owner, field, None)
                if val is not None:
                    setattr(pet.owner, field, val)
            if data.owner.aadhar is not None:
                pet.owner.aadhar = data.owner.aadhar or None

        # Update health
        if data.health:
            if pet.health:
                pet.health.grooming = data.health.grooming
                pet.health.routine = data.health.routine
                pet.health.last_visit = data.health.last_visit
            else:
                db.add(HealthDetail(
                    pet_id=pet.id,
                    grooming=data.health.grooming,
                    routine=data.health.routine,
                    last_visit=data.health.last_visit,
                ))

        # Replace tags if provided
        for field, model_cls, rel_attr in [
            ("vaccines", Vaccine, "vaccines"),
            ("allergies", Allergy, "allergies"),
            ("diseases", Disease, "diseases"),
            ("medications", Medication, "medications"),
            ("food", Food, "food"),
        ]:
            new_tags = getattr(data, field, None)
            if new_tags is not None:
                for old in getattr(pet, rel_attr):
                    db.delete(old)
                for item in _build_tags(model_cls, pet.id, new_tags):
                    db.add(item)

        # Regenerate categories
        current_diseases = data.diseases if data.diseases is not None else [d.name for d in pet.diseases]
        current_allergies = data.allergies if data.allergies is not None else [a.name for a in pet.allergies]
        for old_cat in pet.categories:
            db.delete(old_cat)
        for c in generate_categories(
            species=pet.species,
            breed=pet.breed,
            dob=pet.dob,
            weight_kg=pet.weight,
            diseases=current_diseases,
            allergies=current_allergies,
        ):
            db.add(PetCategory(
                pet_id=pet.id,
                category_type=c["category_type"],
                category_value=c["category_value"],
            ))

        db.commit()
        return get_pet(pet_id, db)

    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update pet record.") from exc


# ── Delete ────────────────────────────────────────────────────────────────────

def delete_pet(pet_id: str, db: Session) -> None:
    pet = db.get(Pet, pet_id)
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found.")
    # Delete associated document files from disk
    for doc in pet.documents:
        try:
            import os
            if os.path.isfile(doc.file_path):
                os.remove(doc.file_path)
        except OSError:
            pass
    owner = pet.owner
    db.delete(pet)
    if owner and len(owner.pets) <= 1:
        db.delete(owner)
    db.commit()
