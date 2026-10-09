"""Administrative Boundary Service for Nepal.
Exposes verified ADM0 (Country), ADM1 (7 Provinces), and ADM2 (Districts) Topologies.
"""

import json
import os
from typing import Dict, Any
from app.core.logging import logger


class BoundaryService:
    def __init__(self):
        self._adm0: Dict[str, Any] = {"type": "FeatureCollection", "features": []}
        self._adm1: Dict[str, Any] = {"type": "FeatureCollection", "features": []}
        self._adm2: Dict[str, Any] = {"type": "FeatureCollection", "features": []}
        self._load_data()

    def _load_data(self):
        base_dir = os.path.join(os.path.dirname(__file__), "../../../data/reference")
        try:
            adm0_file = os.path.join(base_dir, "nepal_adm0.geojson")
            if os.path.exists(adm0_file):
                with open(adm0_file, encoding="utf-8") as f:
                    self._adm0 = json.load(f)

            adm1_file = os.path.join(base_dir, "nepal_adm1.geojson")
            if os.path.exists(adm1_file):
                with open(adm1_file, encoding="utf-8") as f:
                    self._adm1 = json.load(f)

            adm2_file = os.path.join(base_dir, "nepal_adm2.geojson")
            if os.path.exists(adm2_file):
                with open(adm2_file, encoding="utf-8") as f:
                    self._adm2 = json.load(f)
        except Exception as e:
            logger.warning(f"Error loading reference boundary files: {e}")

    def get_country_boundary(self) -> Dict[str, Any]:
        return self._adm0

    def get_provinces_boundary(self) -> Dict[str, Any]:
        return self._adm1

    def get_districts_boundary(self) -> Dict[str, Any]:
        return self._adm2


boundary_service = BoundaryService()
