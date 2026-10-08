"""Tactical Exposure, Layers, and Command KPIs API router."""

from typing import List
from fastapi import APIRouter
from app.schemas.exposure import ExposureLayerInfo, KPICardData
from app.services import exposure_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/exposure", tags=["Exposure & Lifelines"])


@router.get("/layers", response_model=BaseResponse[List[ExposureLayerInfo]], summary="List map exposure layers")
async def list_layers():
    """Retrieves exposure and hazard layer catalog metadata."""
    layers = await exposure_service.get_layers()
    return BaseResponse(
        success=True,
        data=layers,
        message="Exposure and hazard layers retrieved."
    )


@router.get("/kpis", response_model=BaseResponse[List[KPICardData]], summary="List tactical command KPIs")
async def list_kpis():
    """Retrieves high-level command KPI cards with explicit prototype data provenance."""
    kpis = await exposure_service.get_kpis()
    return BaseResponse(
        success=True,
        data=kpis,
        message="Tactical command KPIs retrieved."
    )
