"""Disaster Events and Transboundary Case Studies API router."""

from typing import List
from fastapi import APIRouter
from app.schemas.events import DisasterCaseStudy, DisasterEventSummary, VerifiedGeographicWaypoint
from app.services import event_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/events", tags=["Disaster Events"])


@router.get("", response_model=BaseResponse[List[DisasterEventSummary]], summary="List all disaster events")
async def list_events():
    """Retrieves all registered real-world disaster case studies and incident models."""
    events = await event_service.get_all_events()
    return BaseResponse(
        success=True,
        data=events,
        message="Disaster events retrieved successfully."
    )


@router.get("/{event_id}", response_model=BaseResponse[DisasterCaseStudy], summary="Get specific disaster case study")
async def get_event(event_id: str):
    """Retrieves detailed case study information including verified waypoints and authoritative sources."""
    event = await event_service.get_event_by_id(event_id)
    return BaseResponse(
        success=True,
        data=event,
        provenance=event.provenance,
        message=f"Disaster event '{event.name}' retrieved."
    )


@router.get("/{event_id}/waypoints", response_model=BaseResponse[List[VerifiedGeographicWaypoint]], summary="Get verified event waypoints")
async def get_event_waypoints(event_id: str):
    """Retrieves authoritative geographic waypoints for the specified event."""
    waypoints = await event_service.get_event_waypoints(event_id)
    return BaseResponse(
        success=True,
        data=waypoints,
        message=f"Retrieved {len(waypoints)} verified geographic waypoints."
    )
