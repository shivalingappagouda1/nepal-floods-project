"""Tactical Exposure, Layers, and Command KPIs API router."""

from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.exposure import ExposureLayerInfo, KPICardData
from app.services import exposure_service
from app.services.exposure_analyzer import asset_exposure_analyzer
from app.schemas.common import BaseResponse, ProvenanceMeta, DataTier

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


@router.get("/satellite-assets", summary="Assess mapped OSM infrastructure against candidate change clusters")
async def assess_satellite_assets():
    """Evaluates spatial intersection and buffer proximity between real OSM assets and candidate change areas."""
    result = asset_exposure_analyzer.evaluate_exposure()
    return BaseResponse(
        success=True,
        data=result,
        provenance=ProvenanceMeta(
            tier=DataTier.VERIFIED,
            source="OpenStreetMap contributors (ODbL 1.0) & Copernicus Sentinel-2 L2A",
            algorithm="Spatial Intersection and Proximity Buffer Evaluation",
            isDemoValue=False
        ),
        message=f"Evaluated {result['summary']['total_count']} mapped assets ({result['summary']['intersecting_count']} intersecting, {result['summary']['near_count']} near buffer)."
    )
