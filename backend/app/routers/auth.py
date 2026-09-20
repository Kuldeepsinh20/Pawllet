import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.admin_user import AdminUser
from app.schemas.auth import LoginRequest, TokenResponse, AdminUserResponse
from app.dependencies.auth import get_current_admin

logger = logging.getLogger("pawlet.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login_admin(data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate admin user against PostgreSQL hashed credentials and issue a JWT token."""
    username = data.username.strip()

    # Self-healing bootstrap: if database has no admin users, initialize default admin
    user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not user and db.query(AdminUser).count() == 0:
        if username == settings.ADMIN_USERNAME:
            hashed = get_password_hash(settings.ADMIN_PASSWORD)
            user = AdminUser(
                username=settings.ADMIN_USERNAME,
                hashed_password=hashed,
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    if not user or not user.is_active or not verify_password(data.password, user.hashed_password):
        logger.warning(f"[AUTH Failed] Invalid login attempt for username: '{username}'")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.info(f"[AUTH Success] Admin user logged in: '{username}'")
    access_token = create_access_token(subject=user.username)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username,
    )


@router.get("/me", response_model=AdminUserResponse)
def get_current_admin_info(current_admin: AdminUser = Depends(get_current_admin)):
    """Validate current Bearer token and return active admin user identity."""
    return AdminUserResponse(
        username=current_admin.username,
        is_authenticated=True,
    )
