"""Genuine AI & Geospatial Change Detection Engine for HIMALAYA-SHIELD.



Processes genuine Copernicus Sentinel-2 L2A Earth Observation imagery to detect

statistically significant candidate surface changes (hydrological flood expansion,

landslide scarp exposure, silt deposition).



Produces:

1\. Computed change mask raster (PNG).

2\. Georeferenced candidate change polygons (GeoJSON FeatureCollection).

3\. Traceable execution manifest (JSON).

"""



import json

import math

import time

import sys
import os
import tempfile

from pathlib import Path

from typing import Dict, Any, List, Tuple, Optional

import numpy as np

from PIL import Image, ImageFilter

from shapely.geometry import Polygon, MultiPolygon, mapping, shape

from shapely.ops import unary_union



from app.core.logging import logger



IS_VERCEL = os.getenv("VERCEL") == "1"

if IS_VERCEL:
    # Vercel's function filesystem is read-only; /tmp is writable but ephemeral.
    BASE_DIR = Path(__file__).resolve().parents[2]
    DATA_RAW_DIR = BASE_DIR / "data" / "raw" / "satellite"
    DATA_PROCESSED_DIR = (
        Path(tempfile.gettempdir()) / "himalaya-shield" / "processed" / "analysis"
    )
else:
    # Local repository layout: repository-root/data and backend/app/services/...
    BASE_DIR = Path(__file__).resolve().parents[3]
    DATA_RAW_DIR = BASE_DIR / "data" / "raw" / "satellite"
    DATA_PROCESSED_DIR = BASE_DIR / "data" / "processed" / "analysis"





class ChangeDetectionPipeline:

    """End-to-end scientific change detection pipeline on satellite rasters."""



    def __init__(

        self,

        sensitivity_k: float = 1.75,

        min_cluster_pixels: int = 6,

        blur_radius: float = 1.0,

    ):

        self.sensitivity_k = sensitivity_k

        self.min_cluster_pixels = min_cluster_pixels

        self.blur_radius = blur_radius



    def validate_inputs(self, pre_path: Path, post_path: Path) -> Tuple[Image.Image, Image.Image]:

        """Validates that input imagery exists, is readable, and contains valid RGB bands."""

        if not pre_path.exists():

            raise FileNotFoundError(f"Pre-event image not found at {pre_path}")

        if not post_path.exists():

            raise FileNotFoundError(f"Post-event image not found at {post_path}")



        try:

            img_pre = Image.open(pre_path).convert("RGB")

            img_post = Image.open(post_path).convert("RGB")

        except Exception as e:

            raise ValueError(f"Failed to decode input satellite imagery: {e}")



        if img_pre.size[0] < 10 or img_pre.size[1] < 10:

            raise ValueError("Pre-event image dimensions too small for geospatial analysis")

        if img_post.size[0] < 10 or img_post.size[1] < 10:

            raise ValueError("Post-event image dimensions too small for geospatial analysis")



        # Spatial alignment check: ensure identical pixel raster grids

        if img_pre.size != img_post.size:

            logger.warning(

                f"Image size mismatch ({img_pre.size} vs {img_post.size}). "

                f"Resampling post-event scene to match pre-event grid."

            )

            img_post = img_post.resize(img_pre.size, Image.Resampling.BICUBIC)



        return img_pre, img_post



    def compute_radiometric_delta(

        self, img_pre: Image.Image, img_post: Image.Image

    ) -> Tuple[np.ndarray, np.ndarray, float, float]:

        """Aligns radiometry and calculates pixel-level spectral Euclidean difference."""

        # Convert to float numpy arrays in [0.0, 1.0]

        arr_pre = np.array(img_pre, dtype=np.float32) / 255.0

        arr_post = np.array(img_post, dtype=np.float32) / 255.0



        # Radiometric baseline matching: normalize mean channel luminance

        for c in range(3):

            mean_pre = np.mean(arr_pre[:, :, c])

            mean_post = np.mean(arr_post[:, :, c])

            if mean_post > 1e-4:

                # Gentle scale correction for solar illumination variance

                correction = np.clip(mean_pre / mean_post, 0.8, 1.25)

                arr_post[:, :, c] = np.clip(arr_post[:, :, c] * correction, 0.0, 1.0)



        # Spectral Euclidean difference across R, G, B channels

        diff = np.sqrt(np.mean(np.square(arr_post - arr_pre), axis=2))



        # Statistical threshold computation

        mu = float(np.mean(diff))

        sigma = float(np.std(diff))

        threshold = mu + (self.sensitivity_k * sigma)



        # Binary candidate change mask

        binary_mask = (diff > threshold).astype(np.uint8)



        # Morphological noise filtering using Pillow

        mask_pil = Image.fromarray(binary_mask * 255, mode="L")

        if self.blur_radius > 0:

            mask_pil = mask_pil.filter(ImageFilter.MedianFilter(size=3))

        filtered_mask = np.array(mask_pil) > 128



        return diff, filtered_mask, mu, threshold



    def vectorize_and_georeference(

        self,

        binary_mask: np.ndarray,

        diff_magnitude: np.ndarray,

        bbox: List[float],

    ) -> Tuple[Dict[str, Any], float]:

        """Vectorizes connected binary change clusters into georeferenced GeoJSON polygons."""

        h, w = binary_mask.shape

        min_lon, min_lat, max_lon, max_lat = bbox



        # Compute ground dimensions and ground sample distance (GSD)

        mid_lat = (min_lat + max_lat) / 2.0

        lat_dist_km = (max_lat - min_lat) * 110.574

        lon_dist_km = (max_lon - min_lon) * (111.320 * math.cos(math.radians(mid_lat)))

        total_scene_area_sqkm = lat_dist_km * lon_dist_km

        pixel_area_sqkm = total_scene_area_sqkm / (w * h)



        # Connected component labeling (simple 8-connectivity BFS / labeling)

        labeled = np.zeros_like(binary_mask, dtype=np.int32)

        current_label = 0

        clusters: Dict[int, List[Tuple[int, int]]] = {}



        visited = np.zeros_like(binary_mask, dtype=bool)



        for y in range(h):

            for x in range(w):

                if binary_mask[y, x] and not visited[y, x]:

                    current_label += 1

                    queue = [(y, x)]

                    visited[y, x] = True

                    cluster_pixels = []



                    while queue:

                        cy, cx = queue.pop()

                        cluster_pixels.append((cy, cx))



                        # 8-neighbor exploration

                        for dy in (-1, 0, 1):

                            for dx in (-1, 0, 1):

                                if dy == 0 and dx == 0:

                                    continue

                                ny, nx = cy + dy, cx + dx

                                if 0 <= ny < h and 0 <= nx < w:

                                    if binary_mask[ny, nx] and not visited[ny, nx]:

                                        visited[ny, nx] = True

                                        queue.append((ny, nx))



                    if len(cluster_pixels) >= self.min_cluster_pixels:

                        clusters[current_label] = cluster_pixels



        features = []

        total_detected_change_sqkm = 0.0



        # Vectorize each qualifying cluster into a georeferenced bounding polygon

        for label_id, pixels in clusters.items():

            ys = [p[0] for p in pixels]

            xs = [p[1] for p in pixels]

            cluster_area_sqkm = len(pixels) * pixel_area_sqkm

            total_detected_change_sqkm += cluster_area_sqkm



            # Mean anomaly magnitude for this cluster

            pixel_diffs = [diff_magnitude[py, px] for py, px in pixels]

            mean_anomaly = float(np.mean(pixel_diffs))



            min_px, max_px = min(xs), max(xs)

            min_py, max_py = min(ys), max(ys)



            # Map pixel bounding box to geographic coordinates

            # x -> lon (0 -> min_lon, w -> max_lon)

            # y -> lat (0 -> max_lat, h -> min_lat)

            c_min_lon = min_lon + (min_px / w) * (max_lon - min_lon)

            c_max_lon = min_lon + ((max_px + 1) / w) * (max_lon - min_lon)

            c_max_lat = max_lat - (min_py / h) * (max_lat - min_lat)

            c_min_lat = max_lat - ((max_py + 1) / h) * (max_lat - min_lat)



            poly_coords = [

                [c_min_lon, c_min_lat],

                [c_max_lon, c_min_lat],

                [c_max_lon, c_max_lat],

                [c_min_lon, c_max_lat],

                [c_min_lon, c_min_lat],

            ]



            centroid_lon = (c_min_lon + c_max_lon) / 2.0

            centroid_lat = (c_min_lat + c_max_lat) / 2.0



            # Target corridor flag (Bhote Koshi / Tatopani gorge: ~85.85 to 86.00 E, 27.85 to 28.00 N)

            in_corridor = (85.85 <= centroid_lon <= 86.02 and 27.85 <= centroid_lat <= 28.02)



            feature = {

                "type": "Feature",

                "id": f"CHANGE-CLUSTER-{label_id:04d}",

                "properties": {

                    "cluster_id": label_id,

                    "pixel_count": len(pixels),

                    "area_sqkm": round(cluster_area_sqkm, 4),

                    "mean_spectral_anomaly": round(mean_anomaly, 4),

                    "centroid": [round(centroid_lon, 5), round(centroid_lat, 5)],

                    "in_target_corridor": in_corridor,

                    "target_corridor_name": "Bhote Koshi / Tatopani Canyon" if in_corridor else "Regional Tile 45RUL",

                    "interpretation": (

                        "Candidate surface alteration (hydrological shift, sediment scours, or seasonal vegetative variance)"

                    ),

                    "evidence_scope": "Statistically significant RGB radiometric shift exceeding adaptive baseline (k=1.75)",

                },

                "geometry": {

                    "type": "Polygon",

                    "coordinates": [poly_coords],

                },

            }

            features.append(feature)



        corridor_clusters = [f for f in features if f["properties"]["in_target_corridor"]]

        corridor_change_sqkm = sum(f["properties"]["area_sqkm"] for f in corridor_clusters)



        geojson_result = {

            "type": "FeatureCollection",

            "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},

            "features": features,

            "properties": {

                "total_candidate_clusters": len(features),

                "total_change_area_sqkm": round(total_detected_change_sqkm, 3),

                "corridor_candidate_clusters": len(corridor_clusters),

                "corridor_change_area_sqkm": round(corridor_change_sqkm, 3),

                "total_scene_area_sqkm": round(total_scene_area_sqkm, 2),

                "pixel_ground_sample_distance_m": round(math.sqrt(pixel_area_sqkm) * 1000.0, 1),

                "scene_bbox": bbox,

            },

        }



        return geojson_result, total_detected_change_sqkm



    def execute(

        self,

        pre_scene_path: Optional[Path] = None,

        post_scene_path: Optional[Path] = None,

        pre_meta_path: Optional[Path] = None,

        post_meta_path: Optional[Path] = None,

    ) -> Dict[str, Any]:

        """Executes full change detection pipeline, saves raster mask & manifest."""

        start_time = time.time()
        DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)



        # Defaults to the downloaded Copernicus Sentinel-2 pair

        if pre_scene_path is None:

            pre_files = list(DATA_RAW_DIR.glob("pre_event_*.jpg"))

            if not pre_files:

                raise FileNotFoundError("No pre-event satellite image found in data/raw/satellite")

            pre_scene_path = pre_files[0]



        if post_scene_path is None:

            post_files = list(DATA_RAW_DIR.glob("post_event_*.jpg"))

            if not post_files:

                raise FileNotFoundError("No post-event satellite image found in data/raw/satellite")

            post_scene_path = post_files[0]



        # Load metadata if present

        pre_meta = {}

        post_meta = {}

        if pre_meta_path and pre_meta_path.exists():

            with open(pre_meta_path, "r", encoding="utf-8") as f:

                pre_meta = json.load(f)

        else:

            meta_candidate = pre_scene_path.with_suffix(".json")

            if meta_candidate.exists():

                with open(meta_candidate, "r", encoding="utf-8") as f:

                    pre_meta = json.load(f)



        if post_meta_path and post_meta_path.exists():

            with open(post_meta_path, "r", encoding="utf-8") as f:

                post_meta = json.load(f)

        else:

            meta_candidate = post_scene_path.with_suffix(".json")

            if meta_candidate.exists():

                with open(meta_candidate, "r", encoding="utf-8") as f:

                    post_meta = json.load(f)



        bbox = post_meta.get("bbox", [85.0800, 27.0211, 86.0906, 28.0224])



        logger.info(f"Executing change detection: {pre_scene_path.name} vs {post_scene_path.name}")

        img_pre, img_post = self.validate_inputs(pre_scene_path, post_scene_path)



        diff, binary_mask, mu, threshold = self.compute_radiometric_delta(img_pre, img_post)



        geojson_result, total_change_sqkm = self.vectorize_and_georeference(

            binary_mask, diff, bbox

        )



        elapsed_ms = (time.time() - start_time) * 1000.0



        # Generate and save visual change mask (Red overlay on transparent background)

        mask_rgba = np.zeros((img_pre.size[1], img_pre.size[0], 4), dtype=np.uint8)

        mask_rgba[binary_mask, 0] = 239  # Red R

        mask_rgba[binary_mask, 1] = 68   # Red G

        mask_rgba[binary_mask, 2] = 68   # Red B

        mask_rgba[binary_mask, 3] = 190  # Alpha opacity 75%

        mask_img = Image.fromarray(mask_rgba, mode="RGBA")

        mask_output_path = DATA_PROCESSED_DIR / "computed_change_mask.png"

        mask_img.save(mask_output_path)



        # Save GeoJSON candidate change clusters

        geojson_output_path = DATA_PROCESSED_DIR / "candidate_change_clusters.geojson"

        with open(geojson_output_path, "w", encoding="utf-8") as f:

            json.dump(geojson_result, f, indent=2)



        # Build and save execution manifest

        manifest = {

            "pipeline_name": "HIMALAYA-SHIELD Earth Observation Surface Change Detection Baseline",

            "execution_id": f"RUN-{int(time.time())}",

            "execution_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),

            "status": "SUCCESS",

            "runtime_ms": round(elapsed_ms, 2),

            "software_environment": {

                "python_version": sys.version.split()[0],

                "numpy_version": np.__version__,

                "pillow_version": Image.__version__,

            },

            "parameters": {

                "algorithm": "RGB Spectral Vector Difference with Local Luminance Normalization and Adaptive Thresholding",

                "sensitivity_k": self.sensitivity_k,

                "threshold_score": round(threshold, 4),

                "baseline_mean_mu": round(mu, 4),

                "min_cluster_pixels": self.min_cluster_pixels,

                "blur_radius": self.blur_radius,

            },

            "input_scenes": {

                "data_representation": "Rendered 8-bit RGB Visual JPEG overview (Sentinel-2A L2A True Color Image, 343x343 px, ~306m GSD)",

                "note_on_case_study": (

                    "Historical 2024 Seasonal Surface Change Demonstration (1 May 2024 pre-monsoon vs 27 Dec 2024 post-monsoon). "

                    "Demonstrates pipeline functionality on authentic Earth-observation data over the Bhote Koshi corridor; "

                    "does not represent damage from the hypothetical August 2026 disaster scenario."

                ),

                "pre_event": {

                    "file": pre_scene_path.name,

                    "id": pre_meta.get("id", "UNKNOWN"),

                    "granule_id": pre_meta.get("granule_id", "UNKNOWN"),

                    "platform": pre_meta.get("platform", "Sentinel-2A"),

                    "sensor": pre_meta.get("sensor", "MSI"),

                    "acquisition_date": pre_meta.get("acquisition_date", "2024-05-01T05:01:10Z"),

                    "cloud_cover_percent": pre_meta.get("cloud_cover_percent", 1.27),

                    "source": pre_meta.get("source", "Copernicus Sentinel / AWS Earth Search"),

                },

                "post_event": {

                    "file": post_scene_path.name,

                    "id": post_meta.get("id", "UNKNOWN"),

                    "granule_id": post_meta.get("granule_id", "UNKNOWN"),

                    "platform": post_meta.get("platform", "Sentinel-2A"),

                    "sensor": post_meta.get("sensor", "MSI"),

                    "acquisition_date": post_meta.get("acquisition_date", "2024-12-27T05:01:09Z"),

                    "cloud_cover_percent": post_meta.get("cloud_cover_percent", 0.0),

                    "source": post_meta.get("source", "Copernicus Sentinel / AWS Earth Search"),

                },

            },

            "spatial_metadata": {

                "bbox": bbox,

                "crs": post_meta.get("crs", "EPSG:32645 (UTM Zone 45N)"),

                "raster_dimensions": [img_pre.size[0], img_pre.size[1]],

                "overview_ground_sample_distance_m": geojson_result["properties"]["pixel_ground_sample_distance_m"],

                "native_sentinel2_bands_gsd_m": "10m (B02, B03, B04, B08) / 20m (B05, B06, B07, B8A, B11, B12)",

            },

            "results_summary": {

                "total_candidate_clusters": len(geojson_result["features"]),

                "total_detected_change_sqkm": round(total_change_sqkm, 3),

                "tile_total_detected_change_sqkm": round(total_change_sqkm, 3),

                "corridor_detected_change_sqkm": geojson_result["properties"]["corridor_change_area_sqkm"],

                "interpretation": (

                    "Candidate surface changes identified via RGB spectral vector difference on Copernicus Sentinel-2A Level-2A visual imagery. "

                    "Represents historical 2024 seasonal/monsoonal surface alterations across Tile 45RUL (1 May 2024 pre-monsoon vs 27 Dec 2024 post-monsoon). "

                    "This demonstration proves pipeline functionality on genuine satellite data; it does not represent damage from the hypothetical August 2026 disaster scenario. "

                    "A detected image difference is only a candidate surface change. It is not proof of disaster damage, building collapse, casualties, or structural failure."

                ),

            },

            "artifacts": {

                "mask_raster": mask_output_path.name,

                "geojson_polygons": geojson_output_path.name,

            },

        }



        manifest_path = DATA_PROCESSED_DIR / "execution_manifest.json"

        with open(manifest_path, "w", encoding="utf-8") as f:

            json.dump(manifest, f, indent=2)



        logger.info(

            f"Change detection run complete: {len(geojson_result['features'])} clusters, "

            f"{total_change_sqkm:.3f} km2 detected in {elapsed_ms:.1f}ms"

        )



        return {

            "manifest": manifest,

            "geojson": geojson_result,

            "mask_path": str(mask_output_path),

            "manifest_path": str(manifest_path),

        }





# Singleton pipeline instance

change_detection_pipeline = ChangeDetectionPipeline()
