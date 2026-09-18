from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base, new_uuid

if TYPE_CHECKING:
    from app.models.pet import Pet


class Owner(Base):
    __tablename__ = "owners"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact: Mapped[str] = mapped_column(String(100), nullable=False)
    aadhar: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    pets: Mapped[List["Pet"]] = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
