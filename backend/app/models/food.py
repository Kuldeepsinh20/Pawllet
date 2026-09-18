from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.models.base import Base, new_uuid

if TYPE_CHECKING:
    from app.models.pet import Pet


class Food(Base):
    __tablename__ = "food"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    pet_id: Mapped[str] = mapped_column(String(36), ForeignKey("pets.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    pet: Mapped["Pet"] = relationship("Pet", back_populates="food")
