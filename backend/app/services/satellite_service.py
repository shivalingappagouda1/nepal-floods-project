"""Service for Satellite Analysis & Imagery Metadata."""

from typing import List, Optional
from app.schemas.satellite import SatelliteScene, SatelliteAnalysisDelta
from app.data import PRECOMPUTED_SATELLITE_SCENES, PRECOMPUTED_ANALYSES
from app.core.errors import ResourceNotFoundException


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


satellite_service = SatelliteService()
