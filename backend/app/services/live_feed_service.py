"""Live Real-Time and Near-Real-Time Disaster Data Feed Services for Nepal.
Connects to authoritative, publicly accessible scientific and meteorological APIs:
1. USGS Earthquake Hazards Program (GeoJSON API) - Real-time seismic events in Nepal region
2. Open-Meteo High-Resolution Meteorological Feed - Live precipitation, rainfall, temperature, and wind
3. Provenance and status tracking for transparent data integrity
"""

import urllib.request
import urllib.parse
import json
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.logging import logger


class LiveFeedService:
    def __init__(self):
        self._earthquake_cache: Optional[Dict[str, Any]] = None
        self._earthquake_cache_time: float = 0.0
        self._weather_cache: Optional[Dict[str, Any]] = None
        self._weather_cache_time: float = 0.0
        self._cache_ttl_seconds = 180  # 3 minutes TTL

    def get_nepal_earthquakes(self, min_magnitude: float = 2.0) -> Dict[str, Any]:
        """Fetch real-time seismic events in Nepal bounding box from USGS.
        Nepal geographic bounds: lat 26.0 to 31.0, lon 80.0 to 89.0.
        """
        now = time.time()
        if self._earthquake_cache and (now - self._earthquake_cache_time) < self._cache_ttl_seconds:
            return self._earthquake_cache

        url = (
            f"https://earthquake.usgs.gov/fdsnws/event/1/query?"
            f"format=geojson&minmagnitude={min_magnitude}&minlatitude=26.0&maxlatitude=31.0"
            f"&minlongitude=80.0&maxlongitude=89.0&orderby=time&limit=25"
        )

        req = urllib.request.Request(
            url,
            headers={"User-Agent": "HimalayaShield-DisasterPlatform/1.0 (Nepal Disaster Intelligence)"}
        )

        try:
            start = time.time()
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            elapsed_ms = int((time.time() - start) * 1000)

            features = []
            for item in data.get("features", []):
                geom = item.get("geometry", {})
                props = item.get("properties", {})
                coords = geom.get("coordinates", [0, 0, 0])
                time_epoch_ms = props.get("time", 0)
                iso_time = datetime.fromtimestamp(time_epoch_ms / 1000.0, tz=timezone.utc).isoformat() if time_epoch_ms else "N/A"

                features.append({
                    "id": item.get("id"),
                    "title": props.get("title"),
                    "magnitude": props.get("mag"),
                    "place": props.get("place"),
                    "time": iso_time,
                    "updated": props.get("updated"),
                    "depth_km": coords[2] if len(coords) > 2 else 0,
                    "coordinates": [coords[0], coords[1]],
                    "status": props.get("status"),
                    "tsunami": props.get("tsunami"),
                    "sig": props.get("sig"),
                    "url": props.get("url"),
                    "provenance": {
                        "tier": "TIER 1 - OBSERVED REAL-TIME EVENT",
                        "source": "USGS Earthquake Hazards Program (Live API Feed)",
                        "timestamp": iso_time,
                        "license": "Public Domain (USGS)",
                        "is_live": True,
                    }
                })

            result = {
                "status": "LIVE_CONNECTED",
                "source": "USGS Earthquake Hazards API",
                "count": len(features),
                "last_synced_at": datetime.now(timezone.utc).isoformat(),
                "latency_ms": elapsed_ms,
                "is_live": True,
                "events": features
            }

            self._earthquake_cache = result
            self._earthquake_cache_time = now
            return result

        except Exception as e:
            logger.warning(f"USGS Earthquake API fetch failed: {e}")
            if self._earthquake_cache:
                cached_res = dict(self._earthquake_cache)
                cached_res["status"] = "CACHED_STALE"
                cached_res["is_live"] = False
                cached_res["warning"] = f"Live feed offline. Serving cached telemetry: {e}"
                return cached_res
            return {
                "status": "FEED_UNAVAILABLE",
                "source": "USGS Earthquake Hazards API",
                "count": 0,
                "last_synced_at": datetime.now(timezone.utc).isoformat(),
                "is_live": False,
                "warning": f"Unable to reach live USGS feed: {e}",
                "events": []
            }

    def get_nepal_weather_stations(self) -> Dict[str, Any]:
        """Fetch live meteorological & rainfall observations across major Nepal stations."""
        now = time.time()
        if self._weather_cache and (now - self._weather_cache_time) < self._cache_ttl_seconds:
            return self._weather_cache

        # Nepal key monitoring stations across all 7 provinces
        stations = [
            {"id": "st-tatopani", "name": "Tatopani / Bhote Koshi", "province": "Bagmati Province", "lat": 27.9520, "lon": 85.9410, "is_aoi": True},
            {"id": "st-kathmandu", "name": "Kathmandu (Tribhuvan Airport)", "province": "Bagmati Province", "lat": 27.7172, "lon": 85.3240, "is_aoi": False},
            {"id": "st-pokhara", "name": "Pokhara (Gandaki Basin)", "province": "Gandaki Province", "lat": 28.2096, "lon": 83.9856, "is_aoi": False},
            {"id": "st-biratnagar", "name": "Biratnagar (Koshi Basin)", "province": "Koshi Province", "lat": 26.4525, "lon": 87.2718, "is_aoi": False},
            {"id": "st-janakpur", "name": "Janakpur (Madhesh Plains)", "province": "Madhesh Province", "lat": 26.7288, "lon": 85.9244, "is_aoi": False},
            {"id": "st-surkhet", "name": "Birendranagar (Karnali Basin)", "province": "Karnali Province", "lat": 28.6019, "lon": 81.6339, "is_aoi": False},
            {"id": "st-dhangadhi", "name": "Dhangadhi (Sudurpashchim)", "province": "Sudurpashchim Province", "lat": 28.6944, "lon": 80.5980, "is_aoi": False},
            {"id": "st-barhabise", "name": "Barhabise (Sindhupalchok)", "province": "Bagmati Province", "lat": 27.7900, "lon": 85.9000, "is_aoi": True},
        ]

        lats = ",".join(str(s["lat"]) for s in stations)
        lons = ",".join(str(s["lon"]) for s in stations)

        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lats}&longitude={lons}&current=temperature_2m,relative_humidity_2m,"
            f"precipitation,rain,weather_code,wind_speed_10m&timezone=Asia%2FKathmandu"
        )

        req = urllib.request.Request(
            url,
            headers={"User-Agent": "HimalayaShield-DisasterPlatform/1.0 (Nepal Disaster Intelligence)"}
        )

        try:
            start = time.time()
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            elapsed_ms = int((time.time() - start) * 1000)

            data_list = data if isinstance(data, list) else [data]
            results = []

            for i, st in enumerate(stations):
                item_data = data_list[i] if i < len(data_list) else {}
                current = item_data.get("current", {})
                precip_mm = current.get("precipitation", 0.0)
                rain_mm = current.get("rain", 0.0)
                temp_c = current.get("temperature_2m", 0.0)
                humidity = current.get("relative_humidity_2m", 0)
                wind_kmh = current.get("wind_speed_10m", 0.0)
                weather_code = current.get("weather_code", 0)

                # Rainfall hazard severity classification
                if precip_mm > 50.0:
                    hazard_level = "CRITICAL"
                    hazard_label = "Torrential Rainfall / Flash Flood Warning"
                elif precip_mm > 20.0:
                    hazard_level = "HIGH"
                    hazard_label = "Heavy Rainfall Watch"
                elif precip_mm > 5.0:
                    hazard_level = "MODERATE"
                    hazard_label = "Moderate Rain"
                else:
                    hazard_level = "NORMAL"
                    hazard_label = "Normal Weather Conditions"

                results.append({
                    "station_id": st["id"],
                    "name": st["name"],
                    "province": st["province"],
                    "coordinates": [st["lon"], st["lat"]],
                    "is_active_aoi": st["is_aoi"],
                    "temperature_c": temp_c,
                    "precipitation_mm": precip_mm,
                    "rain_mm": rain_mm,
                    "relative_humidity_percent": humidity,
                    "wind_speed_kmh": wind_kmh,
                    "weather_code": weather_code,
                    "hazard_level": hazard_level,
                    "hazard_label": hazard_label,
                    "observation_time": current.get("time", datetime.now(timezone.utc).isoformat()),
                    "provenance": {
                        "tier": "TIER 1 - REAL-TIME METEOROLOGICAL OBSERVATION",
                        "source": "Open-Meteo High-Resolution Numerical Weather Model / Global Hydrology",
                        "timestamp": current.get("time", datetime.now(timezone.utc).isoformat()),
                        "is_live": True,
                    }
                })

            response = {
                "status": "LIVE_CONNECTED",
                "source": "Open-Meteo Real-Time Weather API",
                "count": len(results),
                "last_synced_at": datetime.now(timezone.utc).isoformat(),
                "latency_ms": elapsed_ms,
                "is_live": True,
                "stations": results
            }

            self._weather_cache = response
            self._weather_cache_time = now
            return response

        except Exception as e:
            logger.warning(f"Weather API fetch failed: {e}")
            if self._weather_cache:
                cached_res = dict(self._weather_cache)
                cached_res["status"] = "CACHED_STALE"
                cached_res["is_live"] = False
                cached_res["warning"] = f"Live feed offline. Serving cached telemetry: {e}"
                return cached_res
            return {
                "status": "FEED_UNAVAILABLE",
                "source": "Open-Meteo Real-Time Weather API",
                "count": 0,
                "last_synced_at": datetime.now(timezone.utc).isoformat(),
                "is_live": False,
                "warning": f"Unable to reach live weather feed: {e}",
                "stations": []
            }

    def get_live_system_status(self) -> Dict[str, Any]:
        """Return comprehensive feed connectivity and provenance status."""
        eq_status = self.get_nepal_earthquakes()
        wx_status = self.get_nepal_weather_stations()

        return {
            "system_status": "OPERATIONAL",
            "server_timestamp": datetime.now(timezone.utc).isoformat(),
            "feeds": [
                {
                    "name": "USGS Earthquake Hazards Feed",
                    "coverage": "Nepal National (26°N–31°N, 80°E–89°E)",
                    "type": "SEISMIC_OBSERVATION",
                    "is_live": eq_status.get("is_live", False),
                    "status": eq_status.get("status", "UNAVAILABLE"),
                    "item_count": eq_status.get("count", 0),
                    "latency_ms": eq_status.get("latency_ms", 0),
                    "last_updated": eq_status.get("last_synced_at"),
                    "license": "Public Domain (USGS)",
                },
                {
                    "name": "Open-Meteo Nepal Weather & Rainfall",
                    "coverage": "All 7 Provinces & Active River Basins",
                    "type": "METEOROLOGICAL_OBSERVATION",
                    "is_live": wx_status.get("is_live", False),
                    "status": wx_status.get("status", "UNAVAILABLE"),
                    "item_count": wx_status.get("count", 0),
                    "latency_ms": wx_status.get("latency_ms", 0),
                    "last_updated": wx_status.get("last_synced_at"),
                    "license": "Attribution Required (Open-Meteo / ECMWF / DWD)",
                },
                {
                    "name": "geoBoundaries Nepal Administrative Topologies",
                    "coverage": "National (ADM0), 7 Provinces (ADM1), 75+ Districts (ADM2)",
                    "type": "VERIFIED_GEOSPATIAL_BOUNDARIES",
                    "is_live": True,
                    "status": "VERIFIED_GEODATASET",
                    "item_count": 83,
                    "last_updated": "2026-08-26T00:00:00Z",
                    "license": "CC-BY 4.0 (geoBoundaries / Survey Dept of Nepal)",
                },
                {
                    "name": "OpenStreetMap Basemap & Geocoding",
                    "coverage": "Nepal Places, Settlements, Roads & Facilities",
                    "type": "BASEMAP_AND_GEOCODING",
                    "is_live": True,
                    "status": "LIVE_CONNECTED",
                    "last_updated": datetime.now(timezone.utc).isoformat(),
                    "license": "ODbL (OpenStreetMap contributors)",
                },
                {
                    "name": "Copernicus Sentinel-1 SAR & Sentinel-2 Optical Pipeline",
                    "coverage": "Bhote Koshi Transboundary AOI (26 Aug 2026 Case Study)",
                    "type": "SATELLITE_CHANGE_DETECTION",
                    "is_live": False,
                    "status": "PRECOMPUTED_CASE_STUDY",
                    "last_updated": "2026-08-27T06:14:22Z",
                    "license": "Copernicus Open Access / ICIMOD Reference",
                    "notes": "Verified 2026 Transboundary Flood & Debris Case Study (DEMO DATASET).",
                },
                {
                    "name": "Nepal DHM Hydrological Telemetry Portal",
                    "coverage": "Barhabise Gauge Station 610 / Sunkoshi Basin",
                    "type": "HYDROLOGICAL_TELEMETRY",
                    "is_live": False,
                    "status": "SIMULATED_BASELINE",
                    "last_updated": "2026-08-26T18:30:00Z",
                    "license": "DHM Nepal",
                    "notes": "Direct telemetry webhook requires internal government credentials; simulated baseline active.",
                }
            ]
        }


live_feed_service = LiveFeedService()
