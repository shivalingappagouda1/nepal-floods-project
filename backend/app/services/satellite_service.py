"""Service for Satellite Analysis & Imagery Metadata."""

import json
from pathlib import Path
from typing import List, Optional, Dict, Any

from app.schemas.satellite import SatelliteScene, SatelliteAnalysisDelta, PipelineRunResult, PipelineStatus
from app.schemas.common import ProvenanceMeta, DataTier
from app.data import PRECOMPUTED_SATELLITE_SCENES, PRECOMPUTED_ANALYSES
from app.core.errors import ResourceNotFoundException
from app.services.change_detection_engine import change_detection_pipeline

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_RAW_DIR = BASE_DIR / "data" / "raw" / "satellite"
DATA_ANALYSIS_DIR = BASE_DIR / "data" / "processed" / "analysis"


class SatelliteService:
    def __init__(self):
        self.scenes: List[SatelliteScene] = PRECOMPUTED_SATELLITE_SCENES
        self.analyses: List[SatelliteAnalysisDelta] = PRECOMPUTED_ANALYSES

    async def get_scenes(self, sensor: Optional[str] = None) -> List[SatelliteScene]:
        if sensor:
            return [s for s in self.scenes if sensor.lower() in s.sensor.lower()]
        return self.scenes

    async def get_scene_by_id(self, scene_id: str) -> SatelliteScene:
        for s in self.scenes:
            if s.id.lower() == scene_id.lower():
                return s
        raise ResourceNotFoundException("SatelliteScene", scene_id)

    async def get_analyses(self) -> List[SatelliteAnalysisDelta]:
        return self.analyses

    async def get_analysis_by_id(self, analysis_id: str) -> SatelliteAnalysisDelta:
        for a in self.analyses:
            if a.id.lower() == analysis_id.lower():
                return a
        raise ResourceNotFoundException("SatelliteAnalysisDelta", analysis_id)

    async def get_pipeline_status(self) -> PipelineStatus:
        pre_files = list(DATA_RAW_DIR.glob("pre_event_*.jpg"))
        post_files = list(DATA_RAW_DIR.glob("post_event_*.jpg"))
        manifest_path = DATA_ANALYSIS_DIR / "execution_manifest.json"

        latest_manifest = None
        last_ts = None
        if manifest_path.exists():
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    latest_manifest = json.load(f)
                    last_ts = latest_manifest.get("execution_timestamp")
            except Exception:
                pass

        return PipelineStatus(
            realDataLoaded=bool(pre_files and post_files),
            preEventAvailable=bool(pre_files),
            postEventAvailable=bool(post_files),
            lastExecutionTimestamp=last_ts,
            latestManifest=latest_manifest,
            provenance=ProvenanceMeta(
                tier=DataTier.VERIFIED,
                source="Copernicus Sentinel-2 L2A / AWS Earth Search Open Data",
                algorithm="Pipeline Status Inspector",
                isDemoValue=False
            )
        )

    async def run_pipeline(self, sensitivity_k: float = 1.75) -> PipelineRunResult:
        change_detection_pipeline.sensitivity_k = sensitivity_k
        result = change_detection_pipeline.execute()
        manifest = result["manifest"]
        geojson = result["geojson"]

        return PipelineRunResult(
            status=manifest["status"],
            executionId=manifest["execution_id"],
            runtimeMs=manifest["runtime_ms"],
            totalCandidateClusters=manifest["results_summary"]["total_candidate_clusters"],
            totalDetectedChangeSqKm=manifest["results_summary"]["total_detected_change_sqkm"],
            corridorDetectedChangeSqKm=manifest["results_summary"].get("corridor_detected_change_sqkm"),
            preEventScene=manifest["input_scenes"]["pre_event"],
            postEventScene=manifest["input_scenes"]["post_event"],
            manifest=manifest,
            geojson=geojson,
            rasterEndpoints={
                "pre_event": "/api/v1/satellite/pipeline/raster/pre_event",
                "post_event": "/api/v1/satellite/pipeline/raster/post_event",
                "change_mask": "/api/v1/satellite/pipeline/raster/change_mask",
            },
            provenance=ProvenanceMeta(
                tier=DataTier.VERIFIED,
                source="Copernicus Sentinel-2A Level-2A (ESA / AWS Open Data)",
                algorithm="RGB Spectral Vector Delta & Connected-Component Georeferencing (Rendered Visual Overview)",
                isDemoValue=False
            )
        )

    async def get_latest_pipeline_run(self) -> PipelineRunResult:
        manifest_path = DATA_ANALYSIS_DIR / "execution_manifest.json"
        geojson_path = DATA_ANALYSIS_DIR / "candidate_change_clusters.geojson"

        if not manifest_path.exists() or not geojson_path.exists():
            # If not yet executed, run it now
            return await self.run_pipeline()

        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        with open(geojson_path, "r", encoding="utf-8") as f:
            geojson = json.load(f)

        return PipelineRunResult(
            status=manifest["status"],
            executionId=manifest["execution_id"],
            runtimeMs=manifest["runtime_ms"],
            totalCandidateClusters=manifest["results_summary"]["total_candidate_clusters"],
            totalDetectedChangeSqKm=manifest["results_summary"]["total_detected_change_sqkm"],
            corridorDetectedChangeSqKm=manifest["results_summary"].get("corridor_detected_change_sqkm"),
            preEventScene=manifest["input_scenes"]["pre_event"],
            postEventScene=manifest["input_scenes"]["post_event"],
            manifest=manifest,
            geojson=geojson,
            rasterEndpoints={
                "pre_event": "/api/v1/satellite/pipeline/raster/pre_event",
                "post_event": "/api/v1/satellite/pipeline/raster/post_event",
                "change_mask": "/api/v1/satellite/pipeline/raster/change_mask",
            },
            provenance=ProvenanceMeta(
                tier=DataTier.VERIFIED,
                source="Copernicus Sentinel-2A Level-2A (ESA / AWS Open Data)",
                algorithm="RGB Spectral Vector Delta & Connected-Component Georeferencing (Rendered Visual Overview)",
                isDemoValue=False
            )
        )

    def get_raster_file(self, raster_type: str) -> Path:
        if raster_type == "pre_event":
            files = list(DATA_RAW_DIR.glob("pre_event_*.jpg"))
            if files:
                return files[0]
        elif raster_type == "post_event":
            files = list(DATA_RAW_DIR.glob("post_event_*.jpg"))
            if files:
                return files[0]
        elif raster_type == "change_mask":
            mask_path = DATA_ANALYSIS_DIR / "computed_change_mask.png"
            if mask_path.exists():
                return mask_path

        raise ResourceNotFoundException("RasterFile", raster_type)


satellite_service = SatelliteService()
