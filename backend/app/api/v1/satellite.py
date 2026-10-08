"""Satellite Imagery Catalog and Change Detection API router."""

from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.satellite import SatelliteScene, SatelliteAnalysisDelta
from app.services import satellite_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/satellite", tags=["Satellite Analysis"])


@router.get("/scenes", response_model=BaseResponse[List[SatelliteScene]], summary="List satellite imagery scenes")
async def list_scenes(
    sensor: Optional[str] = Query(None, description="Filter by sensor platform, e.g., 'Sentinel-1' or 'Sentinel-2'")
):
    """Retrieves satellite scenes catalog with explicit prototype imagery and precomputed analysis provenance."""
    scenes = await satellite_service.get_scenes(sensor=sensor)
    return BaseResponse(
        success=True,
        data=scenes,
        message=f"Retrieved {len(scenes)} satellite scenes (Precomputed prototype metadata)."
    )


@router.get("/scenes/{scene_id}", response_model=BaseResponse[SatelliteScene], summary="Get satellite scene by ID")
async def get_scene(scene_id: str):
    """Retrieves metadata and granule parameters for a single satellite scene."""
    scene = await satellite_service.get_scene_by_id(scene_id)
    return BaseResponse(
        success=True,
        data=scene,
        provenance=scene.provenance
    )


@router.get("/analyses", response_model=BaseResponse[List[SatelliteAnalysisDelta]], summary="List change detection analyses")
async def list_analyses():
    """Retrieves precomputed satellite change detection analyses."""
    analyses = await satellite_service.get_analyses()
    return BaseResponse(
        success=True,
        data=analyses,
        message="Retrieved precomputed satellite change detection deltas."
    )


@router.get("/analyses/{analysis_id}", response_model=BaseResponse[SatelliteAnalysisDelta], summary="Get change analysis by ID")
async def get_analysis(analysis_id: str):
    """Retrieves a single change detection analysis delta."""
    analysis = await satellite_service.get_analysis_by_id(analysis_id)
    return BaseResponse(
        success=True,
        data=analysis,
        provenance=analysis.provenance
    )
