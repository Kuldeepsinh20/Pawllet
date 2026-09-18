from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base, new_uuid

if TYPE_CHECKING:
    from app.models.owner import Owner
    from app.models.health import HealthDetail
    from app.models.vaccine import Vaccine
    from app.models.allergy import Allergy
    from app.models.disease import Disease
    from app.models.medication import Medication
    from app.models.food import Food
    from app.models.category import PetCategory
    from app.models.document import Document


class Pet(Base):
    __tablename__ = "pets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("owners.id", ondelete="CASCADE"), nullable=False)
    species: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    breed: Mapped[str] = mapped_column(String(255), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    place: Mapped[str] = mapped_column(String(255), nullable=False)
    height: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    owner: Mapped["Owner"] = relationship("Owner", back_populates="pets")
    health: Mapped[Optional["HealthDetail"]] = relationship(
        "HealthDetail", back_populates="pet", cascade="all, delete-orphan", uselist=False
    )
    vaccines: Mapped[List["Vaccine"]] = relationship("Vaccine", back_populates="pet", cascade="all, delete-orphan")
    allergies: Mapped[List["Allergy"]] = relationship("Allergy", back_populates="pet", cascade="all, delete-orphan")
    diseases: Mapped[List["Disease"]] = relationship("Disease", back_populates="pet", cascade="all, delete-orphan")
    medications: Mapped[List["Medication"]] = relationship("Medication", back_populates="pet", cascade="all, delete-orphan")
    food: Mapped[List["Food"]] = relationship("Food", back_populates="pet", cascade="all, delete-orphan")
    categories: Mapped[List["PetCategory"]] = relationship("PetCategory", back_populates="pet", cascade="all, delete-orphan")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="pet", cascade="all, delete-orphan")
