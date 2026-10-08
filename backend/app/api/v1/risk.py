"""Geospatial Risk Analysis API router."""

from typing import List
from fastapi import APIRouter
from app.schemas.risk import (
    RiskZoneResult,
    RiskEngineWeights,
    RiskCalculationRequest
)
from app.services import risk_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])


@router.get("/zones", response_model=BaseResponse[List[RiskZoneResult]], summary="List risk assessment zones")
async def list_risk_zones():
    """Retrieves explainable geospatial risk assessments with 6-factor breakdown and prototype risk score label."""
    zones = await risk_service.get_zones()
    return BaseResponse(
        success=True,
        data=zones,
        message=f"Retrieved {len(zones)} risk evaluation zones."
    )


@router.get("/zones/{zone_id}", response_model=BaseResponse[RiskZoneResult], summary="Get risk zone by ID")
async def get_risk_zone(zone_id: str):
    """Retrieves factor explainability and prototype risk score for a single zone."""
    zone = await risk_service.get_zone_by_id(zone_id)
    return BaseResponse(
        success=True,
        data=zone,
        provenance=zone.provenance
    )


@router.get("/weights", response_model=BaseResponse[RiskEngineWeights], summary="Get default risk engine weights")
async def get_risk_weights():
    """Retrieves the default configurable weights used by the transparent risk scoring engine."""
    weights = await risk_service.get_weights()
    return BaseResponse(
        success=True,
        data=weights,
        message="Risk engine default weights retrieved."
    )


@router.post("/calculate", response_model=BaseResponse[RiskZoneResult], summary="Calculate dynamic risk score")
async def calculate_risk(request: RiskCalculationRequest):
    """Executes the explainable risk scoring formula with custom weights or factor overrides."""
    result = await risk_service.calculate_risk(request)
    return BaseResponse(
        success=True,
        data=result,
        provenance=result.provenance,
        message=f"Calculated prototype risk score: {result.calculatedScore}/100"
    )
