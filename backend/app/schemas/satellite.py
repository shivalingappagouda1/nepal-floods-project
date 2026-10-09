"""Schemas for Satellite Imagery Catalog and Change Detection Analysis."""

from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMeta, DataTier


class SatelliteScene(BaseModel):
    id: str
    sensor: str  # Sentinel-1 SAR, Sentinel-2 Optical, Landsat-9
    platform: str
    granuleId: str
    acquisitionDate: str
    orbitType: Optional[str] = None
    cloudCoverPercentage: Optional[float] = None
    resolutionMeters: float
    bbox: List[float] = Field(description="[minLng, minLat, maxLng, maxLat]")
    previewType: str = Field(default="PROTOTYPE_IMAGERY", description="Visual asset type: Prototype imagery")
    processingMode: str = Field(default="Precomputed analysis", description="Precomputed analysis / Synthetic")
    provenance: ProvenanceMeta


class SatelliteAnalysisDelta(BaseModel):
    id: str
    title: str
    sensorPair: str
    baselineDate: str
    crisisDate: str
    changeDetectionMethod: str
    detectedChangeAreaSqKm: float
    metricsDescription: str
    processingMode: str = Field(default="Precomputed analysis", description="Precomputed analysis")
    confidenceNote: str = Field(default="CONFIDENCE: Not available (Omitted until empirical ground-truth validation is connected)")
    spatialFootprint: List[Tuple[float, float]]
    provenance: ProvenanceMeta


class PipelineRunResult(BaseModel):
    status: str
    executionId: str
    runtimeMs: float
    totalCandidateClusters: int
    totalDetectedChangeSqKm: float
    corridorDetectedChangeSqKm: Optional[float] = None
    preEventScene: dict
    postEventScene: dict
    manifest: dict
    geojson: dict
    rasterEndpoints: dict
    provenance: ProvenanceMeta


class PipelineStatus(BaseModel):
    realDataLoaded: bool
    preEventAvailable: bool
    postEventAvailable: bool
    lastExecutionTimestamp: Optional[str] = None
    latestManifest: Optional[dict] = None
    provenance: ProvenanceMeta
