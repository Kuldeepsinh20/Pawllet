from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.dependencies.auth import get_current_admin
from app.models.admin_user import AdminUser
from app.schemas.admin import DashboardSummaryResponse, SegmentDataResponse, PaginatedPetsResponse
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard", response_model=DashboardSummaryResponse)
def get_dashboard(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retrieve live aggregate metrics for the admin overview dashboard."""
    return admin_service.get_dashboard_summary(db)


@router.get("/segments", response_model=SegmentDataResponse)
def get_segments(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retrieve multi-dimensional pet segmentation counts."""
    return admin_service.get_segments_data(db)


@router.get("/pets", response_model=PaginatedPetsResponse)
def get_pets(
    search: Optional[str] = Query(None),
    species: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    category_type: Optional[str] = Query(None),
    category_value: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Retrieve paginated, searchable, and filtered pet records for admin."""
    return admin_service.get_admin_pets(
        db=db,
        search=search,
        species=species,
        gender=gender,
        category_type=category_type,
        category_value=category_value,
        limit=limit,
        offset=offset,
    )
