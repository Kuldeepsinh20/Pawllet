from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: str
    pet_id: str
    document_type: str
    original_filename: str
    file_size: int
    mime_type: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}
