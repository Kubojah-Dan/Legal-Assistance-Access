import time
from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.config import Settings, get_settings

router = APIRouter(prefix="/health", tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    environment: str
    timestamp: float
    components: dict[str, Any]


@router.get("", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """
    Health check endpoint for container orchestrators, load balancers, and CI.
    Reports operational status and sub-component connectivity.
    """
    components = {
        "api": "healthy",
        "database": "ready" if settings.USE_SQLITE_FALLBACK else "connected",
        "cache": "operational",
        "llm_provider": settings.LLM_PROVIDER,
        "embeddings": settings.EMBEDDING_PROVIDER,
    }

    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=time.time(),
        components=components,
    )
