"""
Pawlet FastAPI Application
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from starlette.datastructures import Headers
from starlette.responses import Response, JSONResponse
from starlette.types import Scope, Receive, Send

from app.core.config import settings
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.base import Base
from app.models.admin_user import AdminUser
from app.routers import auth, admin, pets, documents

logger = logging.getLogger("pawlet.cors")


class LoggingCORSMiddleware(CORSMiddleware):
    """
    Enhanced CORS middleware that logs CORS rejections and approvals
    without exposing passwords, tokens, or credentials.
    """
    def preflight_response(self, request_headers: Headers) -> Response:
        response = super().preflight_response(request_headers)
        origin = request_headers.get("origin")
        method = request_headers.get("access-control-request-method")
        if response.status_code == 400:
            logger.warning(
                f"[CORS Preflight Rejected] Origin: '{origin}', Method: '{method}'. "
                f"Configured origins count: {len(self.allow_origins)}"
            )
        else:
            logger.info(
                f"[CORS Preflight Approved] Origin: '{origin}', Method: '{method}'"
            )
        return response

    async def simple_response(self, scope: Scope, receive: Receive, send: Send, request_headers: Headers) -> None:
        origin = request_headers.get("origin")
        if origin and not self.is_allowed_origin(origin):
            logger.warning(
                f"[CORS Simple Request Disallowed] Origin: '{origin}' on Path: '{scope.get('path')}', Method: '{scope.get('method')}'"
            )
        await super().simple_response(scope, receive, send, request_headers)


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
# Explicitly configured origins with regex fallback for vercel deployments,
# credentials=True with explicit origins (not wildcard origin), and full HTTP method support.
app.add_middleware(
    LoggingCORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,
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
