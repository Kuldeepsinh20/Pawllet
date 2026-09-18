from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services import document_service

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/{document_id}")
def download_document(document_id: str, db: Session = Depends(get_db)):
    """Serve a stored document by its database ID — never exposes raw paths."""
    file_path, mime_type, original_filename = document_service.get_document_file(document_id, db)
    return FileResponse(
        path=file_path,
        media_type=mime_type,
        filename=original_filename,
    )


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: str, db: Session = Depends(get_db)):
    """Delete document metadata and its file from disk."""
    document_service.delete_document(document_id, db)
