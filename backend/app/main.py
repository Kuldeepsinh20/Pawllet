"""
Pawlet FastAPI Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.base import Base
from app.models.admin_user import AdminUser
from app.routers import auth, admin, pets, documents


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed initial admin user if not present
    try:
        Base.metadata.create_all(bind=engine)
        with SessionLocal() as db:
            existing_admin = db.query(AdminUser).filter(AdminUser.username == settings.ADMIN_USERNAME).first()
            if not existing_admin:
                hashed = get_password_hash(settings.ADMIN_PASSWORD)
                new_admin = AdminUser(
                    username=settings.ADMIN_USERNAME,
                    hashed_password=hashed,
                    is_active=True,
                )
                db.add(new_admin)
                db.commit()
    except Exception as e:
        print(f"Warning during startup database initialization: {e}")
    yield


app = FastAPI(
    title="Pawlet API",
    description="Backend API for the Pawlet 'List Your Pets' portal.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Explicit production & local development origins, credentials enabled, standard methods.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
    ],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(pets.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")


# ── Global exception handler ──────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
    )


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": "pawlet-api"}
