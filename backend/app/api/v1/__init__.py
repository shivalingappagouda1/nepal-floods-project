"""API v1 endpoints package initialization."""

from fastapi import APIRouter
from app.api.v1 import (
    health,
    events,
    satellite,
    damage,
    risk,
    exposure,
    response,
    live,
    geocoding,
    boundaries
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(events.router)
api_router.include_router(satellite.router)
api_router.include_router(damage.router)
api_router.include_router(risk.router)
api_router.include_router(exposure.router)
api_router.include_router(response.router)
api_router.include_router(live.router)
api_router.include_router(geocoding.router)
api_router.include_router(boundaries.router)
