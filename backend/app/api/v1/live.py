"""Live feeds router for real-time seismic, weather, and status tracking."""

from fastapi import APIRouter, Query
from app.services.live_feed_service import live_feed_service

router = APIRouter(prefix="/live", tags=["Live Real-Time Feeds"])


@router.get("/earthquakes")
def get_live_earthquakes(min_mag: float = Query(2.0, ge=1.0, le=9.0, description="Minimum earthquake magnitude")):
    """Fetch live USGS earthquakes occurring within Nepal coordinates."""
    return live_feed_service.get_nepal_earthquakes(min_magnitude=min_mag)


@router.get("/weather")
def get_live_weather():
    """Fetch live meteorological & precipitation observations for Nepal monitoring stations."""
    return live_feed_service.get_nepal_weather_stations()


@router.get("/status")
def get_system_feed_status():
    """Return provenance, operational status, and latency for all connected feeds."""
    return live_feed_service.get_live_system_status()
