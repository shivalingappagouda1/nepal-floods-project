"""Geocoding API router for Nepal places, settlements, districts, and provinces."""

from fastapi import APIRouter, Query
from app.services.geocoding_service import geocoding_service

router = APIRouter(prefix="/geocoding", tags=["Geocoding & Place Search"])


@router.get("/search")
def search_places(
    q: str = Query(..., min_length=1, description="Place, village, town, district, or province name"),
    limit: int = Query(8, ge=1, le=25, description="Maximum number of results to return")
):
    """Search places across Nepal with real geocoding + local verified boundaries."""
    return geocoding_service.search(query=q, limit=limit)
