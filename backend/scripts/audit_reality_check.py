"""Reality check and scientific audit script for HIMALAYA-SHIELD."""

import json
from pathlib import Path
from PIL import Image
import numpy as np
from shapely.geometry import shape

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RAW_DIR = BASE_DIR / "data" / "raw" / "satellite"
OSM_DIR = BASE_DIR / "data" / "raw" / "osm"
ANALYSIS_DIR = BASE_DIR / "data" / "processed" / "analysis"


def audit_images():
    print("==================================================================")
    print("1. IMAGE FILES & METADATA AUDIT")
    print("==================================================================")
    pre_files = list(RAW_DIR.glob("pre_event_*.jpg"))
    post_files = list(RAW_DIR.glob("post_event_*.jpg"))
    
    print(f"Pre-event files found: {[f.name for f in pre_files]}")
    print(f"Post-event files found: {[f.name for f in post_files]}")
    
    for f in pre_files + post_files:
        img = Image.open(f)
        size_bytes = f.stat().st_size
        meta_file = f.with_suffix(".json")
        meta = {}
        if meta_file.exists():
            with open(meta_file, encoding="utf-8") as mf:
                meta = json.load(mf)
                
        print(f"\nFile: {f.name}")
        print(f"  Format: {img.format}, Mode: {img.mode}, Dimensions: {img.size}")
        print(f"  File size: {size_bytes:,} bytes")
        print(f"  Underlying data type: Rendered RGB 8-bit JPEG (Thumbnail visual product)")
        print(f"  Raw bands present: 3 channels (R, G, B) - NOT raw 12-band multispectral Sentinel-2 L2A!")
        print(f"  Granule ID: {meta.get('granule_id')}")
        print(f"  Acquisition date: {meta.get('acquisition_date')}")
        print(f"  Cloud cover: {meta.get('cloud_cover_percent')}%")
        print(f"  BBox: {meta.get('bbox')}")


def audit_intersections():
    print("\n==================================================================")
    print("2. GEOMETRY & INTERSECTION AUDIT")
    print("==================================================================")
    with open(ANALYSIS_DIR / "candidate_change_clusters.geojson", encoding="utf-8") as f:
        clusters = json.load(f)["features"]
        
    with open(OSM_DIR / "bhote_koshi_infrastructure_osm.geojson", encoding="utf-8") as f:
        osm = json.load(f)["features"]
        
    print(f"Loaded {len(clusters)} candidate clusters and {len(osm)} OSM assets.")
    
    for a in osm:
        a_geom = shape(a["geometry"])
        name = a["properties"]["name"]
        
        intersecting = []
        near = []
        for c in clusters:
            c_geom = shape(c["geometry"])
            if a_geom.intersects(c_geom):
                intersecting.append(c["id"])
            elif a_geom.distance(c_geom) < 0.005:
                near.append((c["id"], round(a_geom.distance(c_geom) * 111.0, 2)))
                
        print(f"\nAsset: {name} ({a['geometry']['type']})")
        print(f"  Direct intersection: {intersecting}")
        print(f"  Near (<550m): {near}")


def audit_area_calculation():
    print("\n==================================================================")
    print("3. AREA CALCULATION AUDIT")
    print("==================================================================")
    with open(ANALYSIS_DIR / "execution_manifest.json", encoding="utf-8") as f:
        manifest = json.load(f)
        
    results = manifest["results_summary"]
    bbox = manifest["spatial_metadata"]["bbox"]
    dims = manifest["spatial_metadata"]["raster_dimensions"]
    
    print(f"Reported total change area: {results['total_detected_change_sqkm']} sq km")
    print(f"Tile Bounding Box: {bbox}")
    print(f"Raster dimensions: {dims} (343 x 343 pixels)")
    
    min_lon, min_lat, max_lon, max_lat = bbox
    mid_lat = (min_lat + max_lat) / 2.0
    lat_dist_km = (max_lat - min_lat) * 110.574
    lon_dist_km = (max_lon - min_lon) * (111.320 * np.cos(np.radians(mid_lat)))
    total_tile_sqkm = lat_dist_km * lon_dist_km
    sqkm_per_pixel = total_tile_sqkm / (dims[0] * dims[1])
    
    print(f"Total tile footprint: {lat_dist_km:.1f} km (lat) x {lon_dist_km:.1f} km (lon) = {total_tile_sqkm:.1f} sq km")
    print(f"Approx ground resolution per pixel: {sqkm_per_pixel:.4f} sq km/pixel (~{np.sqrt(sqkm_per_pixel)*1000:.0f} m GSD)")
    print(f"NOTE: A 343x343 thumbnail represents ~{np.sqrt(sqkm_per_pixel)*1000:.0f}m per pixel, whereas native Sentinel-2 MSI is 10m.")


if __name__ == "__main__":
    audit_images()
    audit_intersections()
    audit_area_calculation()
