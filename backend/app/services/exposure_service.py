"""Service for Tactical Exposure, Layers, and Command KPIs."""

from typing import List
from app.schemas.exposure import ExposureLayerInfo, KPICardData
from app.data import EXPOSURE_LAYERS, TACTICAL_KPIS


class ExposureService:
    def __init__(self):
        self.layers: List[ExposureLayerInfo] = EXPOSURE_LAYERS
        self.kpis: List[KPICardData] = TACTICAL_KPIS

    async def get_layers(self) -> List[ExposureLayerInfo]:
        return self.layers

    async def get_kpis(self) -> List[KPICardData]:
        return self.kpis


exposure_service = ExposureService()
