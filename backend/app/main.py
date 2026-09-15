import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import get_settings
from app.middleware.logging import StructuredLoggingMiddleware
from app.routers.health import router as health_router

# Configure root logger
settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger("nyayamitra")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing NyayaMitra Legal Access Platform Backend...")
    # Initial startup tasks (e.g. database connect, source registry verify)
    yield
    logger.info("Shutting down NyayaMitra Backend...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="NyayaMitra: AI for Legal Assistance & Access in India",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-ID"],
)

# Custom Structured Logging & PII Protection Middleware
app.add_middleware(StructuredLoggingMiddleware)


# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response


app.add_middleware(SecurityHeadersMiddleware)

# Mount versioned API routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return JSONResponse({
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "message": "Welcome to NyayaMitra Legal Access Platform API",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    })
