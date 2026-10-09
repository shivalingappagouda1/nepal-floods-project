"""Satellite Imagery Catalog and Change Detection API router."""

from typing import List, Optional
from fastapi import APIRouter, Query, Response
from fastapi.responses import FileResponse
from app.schemas.satellite import (
    SatelliteScene,
    SatelliteAnalysisDelta,
    PipelineRunResult,
    PipelineStatus,
)
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


# --- GENUINE AI & GEOSPATIAL CHANGE DETECTION PIPELINE ENDPOINTS ---

@router.get("/pipeline/status", response_model=BaseResponse[PipelineStatus], summary="Check pipeline data and execution status")
async def get_pipeline_status():
    """Returns current status of real Copernicus imagery and latest execution manifest."""
    status = await satellite_service.get_pipeline_status()
    return BaseResponse(
        success=True,
        data=status,
        provenance=status.provenance,
        message="Satellite processing pipeline status retrieved."
    )


@router.post("/pipeline/run", response_model=BaseResponse[PipelineRunResult], summary="Execute real change detection pipeline")
async def run_pipeline(
    sensitivity_k: float = Query(1.75, ge=0.5, le=4.0, description="Statistical threshold multiplier (k)")
):
    """Executes genuine change detection on Copernicus Sentinel-2 L2A scenes."""
    result = await satellite_service.run_pipeline(sensitivity_k=sensitivity_k)
    return BaseResponse(
        success=True,
        data=result,
        provenance=result.provenance,
        message=f"Executed real change detection: {result.totalCandidateClusters} clusters ({result.totalDetectedChangeSqKm:.2f} sq km) in {result.runtimeMs:.1f}ms."
    )


@router.get("/pipeline/latest", response_model=BaseResponse[PipelineRunResult], summary="Get latest real pipeline execution result")
async def get_latest_pipeline_run():
    """Returns the most recent genuine change detection execution result and manifest."""
    result = await satellite_service.get_latest_pipeline_run()
    return BaseResponse(
        success=True,
        data=result,
        provenance=result.provenance,
        message="Retrieved latest genuine change detection run."
    )


@router.get("/pipeline/raster/{image_type}", summary="Stream actual satellite raster or computed change mask")
async def get_raster(image_type: str):
    """Streams the real pre-event scene, post-event scene, or computed change mask raster."""
    path = satellite_service.get_raster_file(image_type)
    media_type = "image/jpeg" if path.suffix in [".jpg", ".jpeg"] else "image/png"
    return FileResponse(path, media_type=media_type)
