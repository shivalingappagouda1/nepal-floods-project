"""Emergency Response Decision-Support API router."""

from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.response import (
    PriorityZone,
    ResponsePriorityTier,
    StagedReliefUnit,
    DirectiveSubmissionRequest,
    DirectiveSubmissionResponse
)
from app.services import response_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/response", tags=["Emergency Response"])


@router.get("/zones", response_model=BaseResponse[List[PriorityZone]], summary="List prioritized response zones")
async def list_response_zones(
    tier: Optional[ResponsePriorityTier] = Query(None, description="Filter by response priority tier (PRIORITY_1, PRIORITY_2, PRIORITY_3)")
):
    """Retrieves ranked response zones with factor explainability, route unavailable notices, and advisory directives."""
    zones = await response_service.get_zones(tier=tier)
    return BaseResponse(
        success=True,
        data=zones,
        message=f"Retrieved {len(zones)} response priority zones."
    )


@router.get("/zones/{zone_id}", response_model=BaseResponse[PriorityZone], summary="Get priority zone by ID")
async def get_response_zone(zone_id: str):
    """Retrieves detailed tactical profile and routing status for a specific priority zone."""
    zone = await response_service.get_zone_by_id(zone_id)
    return BaseResponse(
        success=True,
        data=zone,
        provenance=zone.provenance
    )


@router.get("/units", response_model=BaseResponse[List[StagedReliefUnit]], summary="List staged emergency relief units")
async def list_staged_units():
    """Retrieves illustrative template records for staged disaster relief and engineering units."""
    units = await response_service.get_staged_units()
    return BaseResponse(
        success=True,
        data=units,
        message="Staged relief units retrieved (Illustrative templates)."
    )


@router.post("/directives/submit", response_model=BaseResponse[DirectiveSubmissionResponse], summary="Submit advisory directive for Incident Commander review")
async def submit_directive(request: DirectiveSubmissionRequest):
    """Logs an advisory operational recommendation to the Incident Commander queue (non-autonomous human-in-the-loop)."""
    response = await response_service.submit_directive(request)
    return BaseResponse(
        success=True,
        data=response,
        provenance=response.provenance,
        message=f"Advisory directive queued for {response.zoneId}."
    )
