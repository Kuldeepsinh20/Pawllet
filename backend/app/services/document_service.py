"""
Document service — safe file storage and retrieval.
Never exposes raw filesystem paths to clients.
"""
import os
import uuid
import mimetypes
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"}


def _safe_extension(filename: str) -> str:
    """Extract and validate file extension."""
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"File type not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    return ext


def _unique_filename(ext: str) -> str:
    return f"{uuid.uuid4().hex}{ext}"


async def save_upload(
    pet_id: str,
    document_type: str,
    file: UploadFile,
    db: Session,
) -> Document:
    """Save uploaded file to disk and persist metadata to DB."""
    # Validate size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE // 1024 // 1024} MB.",
        )

    # Validate MIME type (from content-type header and extension)
    content_type = file.content_type or ""
    ext = _safe_extension(file.filename or "")
    if content_type not in ALLOWED_MIME_TYPES:
        # Guess from extension as fallback
        guessed, _ = mimetypes.guess_type(f"file{ext}")
        if guessed not in ALLOWED_MIME_TYPES:
            raise HTTPException(status_code=415, detail="File type not allowed.")
        content_type = guessed

    # Build safe stored filename
    stored_name = _unique_filename(ext)
    upload_dir = settings.upload_dir_abs
    file_path = os.path.join(upload_dir, stored_name)

    # Write to disk
    with open(file_path, "wb") as f:
        f.write(contents)

    # Persist metadata
    doc = Document(
        pet_id=pet_id,
        document_type=document_type,
        original_filename=Path(file.filename or "unknown").name,
        stored_filename=stored_name,
        file_path=file_path,
        mime_type=content_type,
        file_size=len(contents),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_document_file(document_id: str, db: Session) -> Tuple[str, str, str]:
    """Return (file_path, mime_type, original_filename) for a document."""
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    if not os.path.isfile(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server.")
    return doc.file_path, doc.mime_type, doc.original_filename


def delete_document(document_id: str, db: Session) -> None:
    """Delete document metadata and its file from disk."""
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    # Remove file
    try:
        if os.path.isfile(doc.file_path):
            os.remove(doc.file_path)
    except OSError:
        pass  # Log in production; don't crash
    db.delete(doc)
    db.commit()
