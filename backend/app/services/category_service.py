"""
Category service — derives pet categories from stored data.
All rules are data-driven and extensible per-species.
"""
from datetime import date
from typing import List, Tuple, Optional
from app.utils.age_calculator import get_age_group

# ── Breed group keyword map ───────────────────────────────────────────────────
BREED_GROUPS: List[Tuple[str, str]] = [
    ("retriever", "Retriever"),
    ("labrador", "Retriever"),
    ("shepherd", "Shepherd"),
    ("husky", "Nordic/Spitz"),
    ("malamute", "Nordic/Spitz"),
    ("poodle", "Poodle"),
    ("bulldog", "Bulldog"),
    ("terrier", "Terrier"),
    ("spaniel", "Spaniel"),
    ("hound", "Hound"),
    ("beagle", "Hound"),
    ("rottweiler", "Working"),
    ("doberman", "Working"),
    ("boxer", "Working"),
    ("shih tzu", "Toy"),
    ("chihuahua", "Toy"),
    ("pomeranian", "Toy"),
    ("persian", "Long-hair"),
    ("siamese", "Oriental"),
    ("maine coon", "Large Breed"),
    ("bengal", "Exotic"),
    ("parrot", "Parrot"),
    ("cockatiel", "Parrot"),
    ("macaw", "Parrot"),
    ("rabbit", "Lagomorph"),
    ("hamster", "Rodent"),
    ("guinea pig", "Rodent"),
    ("cow", "Bovine"),
    ("goat", "Caprine"),
    ("horse", "Equine"),
    ("sheep", "Ovine"),
]

# ── Size rules per species (weight in kg) ─────────────────────────────────────
SIZE_RULES = {
    "Dogs": [
        (5, "Toy"),
        (10, "Small"),
        (25, "Medium"),
        (40, "Large"),
        (float("inf"), "Giant"),
    ],
    "Cats": [
        (4, "Small"),
        (6, "Medium"),
        (float("inf"), "Large"),
    ],
}


def _breed_group(breed: str) -> str:
    lower = breed.lower()
    for keyword, group in BREED_GROUPS:
        if keyword in lower:
            return group
    return "Other"


def _size(species: str, weight_kg: float) -> Optional[str]:
    rules = SIZE_RULES.get(species)
    if not rules:
        return None
    for threshold, label in rules:
        if weight_kg < threshold:
            return label
    return rules[-1][1]


def generate_categories(
    species: str,
    breed: str,
    dob: date,
    weight_kg: float,
    diseases: List[str],
    allergies: List[str],
) -> List[dict]:
    """Return list of {category_type, category_value} dicts."""
    cats = []

    # 1. Species
    cats.append({"category_type": "species", "category_value": species})

    # 2. Age group
    cats.append({"category_type": "age_group", "category_value": get_age_group(dob)})

    # 3. Size (species-aware)
    size = _size(species, weight_kg)
    if size:
        cats.append({"category_type": "size", "category_value": size})

    # 4. Breed group
    cats.append({"category_type": "breed_group", "category_value": _breed_group(breed)})

    # 5. Health status
    health_val = "Has Health Conditions" if diseases else "Healthy"
    cats.append({"category_type": "health", "category_value": health_val})

    # 6. Allergy status
    allergy_val = "Has Allergies" if allergies else "No Known Allergies"
    cats.append({"category_type": "allergy_status", "category_value": allergy_val})

    return cats
