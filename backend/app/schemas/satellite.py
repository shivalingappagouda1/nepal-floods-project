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
