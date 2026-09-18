from datetime import datetime, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base, new_uuid

if TYPE_CHECKING:
    from app.models.pet import Pet


class HealthDetail(Base):
    __tablename__ = "health_details"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    pet_id: Mapped[str] = mapped_column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False, unique=True)
    grooming: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    routine: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_visit: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    pet: Mapped["Pet"] = relationship("Pet", back_populates="health")
