"""Asset Exposure Analysis Engine for HIMALAYA-SHIELD.

Performs spatial intersection and proximity buffering between real candidate surface change
clusters and genuine OpenStreetMap mapped infrastructure assets in the Bhote Koshi / Tatopani corridor.

Categorizes assets as:
- INTERSECTS: Geometry intersects a candidate surface alteration cluster.
- NEAR: Geometry lies within proximity buffer (~500m) of candidate change.
- UNAFFECTED: Geometry lies outside analyzed change envelope.
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from shapely.geometry import shape, Point, LineString, Polygon
from shapely.ops import unary_union

from app.core.logging import logger

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_OSM_PATH = BASE_DIR / "data" / "raw" / "osm" / "bhote_koshi_infrastructure_osm.geojson"
DATA_ANALYSIS_DIR = BASE_DIR / "data" / "processed" / "analysis"


class AssetExposureAnalyzer:
    """Evaluates mapped infrastructure exposure against detected surface changes."""

    def __init__(self, proximity_buffer_deg: float = 0.005):
        # 0.005 degrees in latitude is approx 550 meters
        self.proximity_buffer_deg = proximity_buffer_deg

    def evaluate_exposure(
        self,
        change_geojson: Optional[Dict[str, Any]] = None,
        osm_geojson: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Evaluates infrastructure exposure against candidate change clusters."""
        # Load change clusters if not provided
        if change_geojson is None:
            change_file = DATA_ANALYSIS_DIR / "candidate_change_clusters.geojson"
            if not change_file.exists():
                return {
                    "status": "NO_ANALYSIS_AVAILABLE",
                    "message": "Candidate change clusters not yet computed. Run satellite pipeline first.",
                    "assessed_assets": [],
                    "summary": {
                        "intersecting_count": 0,
                        "near_count": 0,
                        "unaffected_count": 0,
                        "total_count": 0,
                    },
                }
            with open(change_file, "r", encoding="utf-8") as f:
                change_geojson = json.load(f)

        # Load genuine OSM infrastructure
        if osm_geojson is None:
            if not DATA_OSM_PATH.exists():
                return {
                    "status": "OSM_DATA_UNAVAILABLE",
                    "message": "OpenStreetMap infrastructure dataset not found in data/raw/osm.",
                    "assessed_assets": [],
                    "summary": {
                        "intersecting_count": 0,
                        "near_count": 0,
                        "unaffected_count": 0,
                        "total_count": 0,
                    },
                }
            with open(DATA_OSM_PATH, "r", encoding="utf-8") as f:
                osm_geojson = json.load(f)

        change_features = change_geojson.get("features", [])
        osm_features = osm_geojson.get("features", [])

        if not change_features:
            return {
                "status": "ZERO_CHANGE_DETECTED",
                "message": "No significant surface change clusters detected in imagery.",
                "assessed_assets": [],
                "summary": {
                    "intersecting_count": 0,
                    "near_count": 0,
                    "unaffected_count": len(osm_features),
                    "total_count": len(osm_features),
                },
            }

        # Build union of change polygons and union of proximity buffers
        change_geoms = []
        for feat in change_features:
            try:
                g = shape(feat["geometry"])
                if g.is_valid:
                    change_geoms.append(g)
            except Exception as e:
                logger.warning(f"Skipping invalid change geometry: {e}")

        if not change_geoms:
            union_changes = Polygon()
            union_buffer = Polygon()
        else:
            union_changes = unary_union(change_geoms)
            union_buffer = union_changes.buffer(self.proximity_buffer_deg)

        assessed_assets = []
        intersecting_count = 0
        near_count = 0
        unaffected_count = 0

        for asset in osm_features:
            props = asset.get("properties", {})
            osm_id = props.get("osm_id", "UNKNOWN")
            asset_name = props.get("name", "Unnamed Asset")
            asset_type = props.get("asset_type", "infrastructure")
            geom = shape(asset["geometry"])

            exposure_status = "UNAFFECTED"
            evidence_details = "Asset coordinates located outside candidate change zone and buffer."
            advisory_priority = "ROUTINE_MONITORING"

            if union_changes.intersects(geom):
                exposure_status = "INTERSECTS"
                intersecting_count += 1
                evidence_details = (
                    "Asset footprint or corridor directly intersects candidate surface alteration cluster. "
                    "Potential surface sedimentation, hydrological inundation, or erosion track detected. "
                    "Ground reconnaissance required; does not confirm physical collapse."
                )
                advisory_priority = "HIGH_PRIORITY_INSPECTION"
            elif union_buffer.intersects(geom):
                exposure_status = "NEAR"
                near_count += 1
                evidence_details = (
                    f"Asset is within proximity buffer (~{int(self.proximity_buffer_deg * 111000)}m) "
                    "of detected surface alteration. Secondary slope or wash risk possible."
                )
                advisory_priority = "ELEVATED_ADVISORY"
            else:
                unaffected_count += 1

            assessed_assets.append({
                "osm_id": osm_id,
                "name": asset_name,
                "nepali_name": props.get("nepali_name"),
                "asset_type": asset_type,
                "importance": props.get("importance", "STANDARD"),
                "source": props.get("source", "OpenStreetMap contributors (ODbL 1.0)"),
                "exposure_status": exposure_status,
                "advisory_priority": advisory_priority,
                "evidence_details": evidence_details,
                "coordinates": asset["geometry"]["coordinates"],
                "geometry_type": asset["geometry"]["type"],
                "verification_notice": "HUMAN_VERIFICATION_REQUIRED",
            })

        result = {
            "status": "SUCCESS",
            "corridor": osm_geojson.get("corridor", "Bhote Koshi River Valley"),
            "data_source": "OpenStreetMap contributors (ODbL 1.0) & Copernicus Sentinel-2 L2A",
            "summary": {
                "total_count": len(assessed_assets),
                "intersecting_count": intersecting_count,
                "near_count": near_count,
                "unaffected_count": unaffected_count,
            },
            "disclaimer": (
                "Spatial intersection indicates candidate exposure to satellite-detected surface alteration. "
                "It does not constitute proof of structural collapse, casualties, or damage. "
                "All assessments require physical verification by authorized field personnel."
            ),
            "assessed_assets": assessed_assets,
        }

        # Save assessment to disk
        out_path = DATA_ANALYSIS_DIR / "asset_exposure_assessment.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)

        return result


asset_exposure_analyzer = AssetExposureAnalyzer()
