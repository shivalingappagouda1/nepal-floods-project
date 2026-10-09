"""Verified Administrative Boundary API endpoints for Nepal."""

from fastapi import APIRouter
from app.services.boundary_service import boundary_service

router = APIRouter(prefix="/boundaries", tags=["Administrative Boundaries"])


@router.get("/country")
def get_country_boundary():
    """Return verified Nepal ADM0 national boundary (WGS 84 GeoJSON)."""
    return boundary_service.get_country_boundary()


@router.get("/provinces")
def get_provinces_boundary():
    """Return verified Nepal 7 Province ADM1 boundaries (WGS 84 GeoJSON)."""
    return boundary_service.get_provinces_boundary()


@router.get("/districts")
def get_districts_boundary():
    """Return verified Nepal 77 District ADM2 boundaries (WGS 84 GeoJSON)."""
    return boundary_service.get_districts_boundary()
