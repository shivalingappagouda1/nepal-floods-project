"""Geocoding & Place Search Service for Nepal.
Integrates OSM Nominatim API with verified local Nepal administrative topology fallback.
Supports search for:
- Villages and settlements
- Towns and cities
- 77 Districts
- 7 Provinces
- Rivers and landmarks
- Hospitals and health posts
"""

import urllib.request
import urllib.parse
import json
import time
import os
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class GeocodingService:
    def __init__(self):
        self._cache: Dict[str, List[Dict[str, Any]]] = {}
        self._last_osm_call_time: float = 0.0
        self._local_provinces: List[Dict[str, Any]] = []
        self._local_districts: List[Dict[str, Any]] = []
        self._load_local_boundaries()

    def _load_local_boundaries(self):
        """Load verified local administrative boundaries for instant offline/caching fallback."""
        try:
            p_path = os.path.join(os.path.dirname(__file__), "../../../data/reference/nepal_adm1.geojson")
            if os.path.exists(p_path):
                with open(p_path, encoding="utf-8") as f:
                    data = json.load(f)
                    self._local_provinces = data.get("features", [])

            d_path = os.path.join(os.path.dirname(__file__), "../../../data/reference/nepal_adm2.geojson")
            if os.path.exists(d_path):
                with open(d_path, encoding="utf-8") as f:
                    data = json.load(f)
                    self._local_districts = data.get("features", [])
        except Exception as e:
            logger.warning(f"Could not load local boundary reference files: {e}")

    def search(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """Search places across Nepal with real geocoding + local verified boundaries."""
        clean_q = query.strip().lower()
        if not clean_q:
            return []

        if clean_q in self._cache:
            return self._cache[clean_q][:limit]

        results: List[Dict[str, Any]] = []

        # 1. First check local verified provinces
        for f in self._local_provinces:
            pname = f.get("properties", {}).get("shapeName", "")
            if clean_q in pname.lower() or pname.lower() in clean_q:
                results.append({
                    "place_id": f"local-prov-{pname.replace(' ', '-').lower()}",
                    "name": pname,
                    "display_name": f"{pname}, Nepal",
                    "type": "PROVINCE",
                    "category": "administrative",
                    "is_area": True,
                    "has_boundary": True,
                    "geojson": f.get("geometry"),
                    "coordinates": self._compute_centroid(f.get("geometry")),
                    "provenance": {
                        "source": "geoBoundaries Open Dataset (Survey Dept of Nepal)",
                        "tier": "VERIFIED_GEODATASET"
                    }
                })

        # 2. Check local verified districts
        for f in self._local_districts:
            dname = f.get("properties", {}).get("shapeName", "")
            if clean_q in dname.lower() or dname.lower() in clean_q:
                results.append({
                    "place_id": f"local-dist-{dname.replace(' ', '-').lower()}",
                    "name": f"{dname} District",
                    "display_name": f"{dname} District, Nepal",
                    "type": "DISTRICT",
                    "category": "administrative",
                    "is_area": True,
                    "has_boundary": True,
                    "geojson": f.get("geometry"),
                    "coordinates": self._compute_centroid(f.get("geometry")),
                    "provenance": {
                        "source": "geoBoundaries Open Dataset (Survey Dept of Nepal)",
                        "tier": "VERIFIED_GEODATASET"
                    }
                })

        # 3. If needed, query OpenStreetMap Nominatim for settlements, rivers, landmarks
        if len(results) < limit:
            try:
                # Rate limit protection: at least 0.5s between calls
                elapsed = time.time() - self._last_osm_call_time
                if elapsed < 0.5:
                    time.sleep(0.5 - elapsed)

                self._last_osm_call_time = time.time()
                encoded_q = urllib.parse.quote(query)
                url = (
                    f"https://nominatim.openstreetmap.org/search?"
                    f"q={encoded_q}&countrycodes=np&format=json&polygon_geojson=1&addressdetails=1&limit={limit}"
                )

                req = urllib.request.Request(
                    url,
                    headers={"User-Agent": "HimalayaShield-DisasterPlatform/1.0 (contact@himalayashield.org.np)"}
                )

                with urllib.request.urlopen(req, timeout=5) as resp:
                    osm_data = json.loads(resp.read().decode("utf-8"))

                for item in osm_data:
                    display_name = item.get("display_name", "")
                    place_type = item.get("type", "place").upper()
                    category = item.get("class", "place")
                    lat = float(item.get("lat", 0.0))
                    lon = float(item.get("lon", 0.0))
                    geojson = item.get("geojson", {})
                    is_area = geojson.get("type") in ["Polygon", "MultiPolygon"]

                    results.append({
                        "place_id": f"osm-{item.get('place_id')}",
                        "name": item.get("name") or display_name.split(",")[0],
                        "display_name": display_name,
                        "type": place_type,
                        "category": category,
                        "is_area": is_area,
                        "has_boundary": is_area,
                        "geojson": geojson if is_area else None,
                        "coordinates": [lon, lat],
                        "boundingbox": item.get("boundingbox"),
                        "provenance": {
                            "source": "OpenStreetMap Nominatim Live Geocoder",
                            "tier": "TIER 1 - LIVE GEOCODING",
                            "license": "ODbL (OpenStreetMap contributors)"
                        }
                    })

            except Exception as e:
                logger.warning(f"Nominatim geocoding lookup failed: {e}")

        # Deduplicate results by place_id or name
        deduped = []
        seen = set()
        for r in results:
            key = r["name"].lower()
            if key not in seen:
                seen.add(key)
                deduped.append(r)

        self._cache[clean_q] = deduped
        return deduped[:limit]

    def _compute_centroid(self, geometry: Optional[Dict[str, Any]]) -> List[float]:
        """Compute bounding box center for a polygon or multipolygon."""
        if not geometry:
            return [84.1240, 28.3949]

        gtype = geometry.get("type")
        coords = geometry.get("coordinates", [])

        all_lons: List[float] = []
        all_lats: List[float] = []

        def extract_pts(pts):
            if not pts:
                return
            if isinstance(pts[0], (int, float)):
                all_lons.append(pts[0])
                all_lats.append(pts[1])
            else:
                for sub in pts:
                    extract_pts(sub)

        extract_pts(coords)
        if all_lons and all_lats:
            return [sum(all_lons) / len(all_lons), sum(all_lats) / len(all_lats)]
        return [84.1240, 28.3949]


geocoding_service = GeocodingService()
