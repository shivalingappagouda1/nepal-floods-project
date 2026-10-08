"""Health check endpoint."""

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter(tags=["Health"])


class HealthStatusResponse(BaseModel):
    status: str = "healthy"
    service: str = "himalaya-shield-backend"
    version: str = settings.VERSION
    timestamp: str
    environment: str = settings.ENVIRONMENT
    isPrototypeMode: bool = settings.IS_PROTOTYPE_MODE


@router.get("/health", response_model=HealthStatusResponse, summary="Backend health check")
async def get_health():
    """Returns the operational status, version, and environment of the backend."""
    return HealthStatusResponse(
        status="healthy",
        service="himalaya-shield-backend",
        version=settings.VERSION,
        timestamp=datetime.now(timezone.utc).isoformat(),
        environment=settings.ENVIRONMENT,
        isPrototypeMode=settings.IS_PROTOTYPE_MODE
    )
