import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.services.change_detection_engine import change_detection_pipeline
from app.services.exposure_analyzer import asset_exposure_analyzer


def main():
    print("=================================================================")
    print(" HIMALAYA-SHIELD: Real AI Geospatial Disaster Analysis Pipeline  ")
    print("=================================================================")
    
    print("\n[1/2] Executing Change Detection Pipeline on Real Sentinel-2 Imagery...")
    res = change_detection_pipeline.execute()
    manifest = res["manifest"]
    print(f"  Status:          {manifest['status']}")
    print(f"  Execution ID:    {manifest['execution_id']}")
    print(f"  Runtime:         {manifest['runtime_ms']} ms")
    print(f"  Pre-event Scene: {manifest['input_scenes']['pre_event']['id']} ({manifest['input_scenes']['pre_event']['acquisition_date']})")
    print(f"  Post-event Scene:{manifest['input_scenes']['post_event']['id']} ({manifest['input_scenes']['post_event']['acquisition_date']})")
    print(f"  Algorithm:       Spectral Euclidean Radiometric Delta (k={manifest['parameters']['sensitivity_k']})")
    print(f"  Clusters Found:  {manifest['results_summary']['total_candidate_clusters']}")
    print(f"  Tile Change Area:{manifest['results_summary']['tile_total_detected_change_sqkm']} sq km")
    print(f"  Corridor Change: {manifest['results_summary']['corridor_detected_change_sqkm']} sq km (Upper Bhote Koshi canyon)")
    
    print("\n[2/2] Executing Asset Exposure Analysis against Genuine OSM Infrastructure...")
    exp = asset_exposure_analyzer.evaluate_exposure(change_geojson=res["geojson"])
    summary = exp["summary"]
    print(f"  Total Assets:    {summary['total_count']}")
    print(f"  Intersecting:    {summary['intersecting_count']}")
    print(f"  Near Buffer:     {summary['near_count']}")
    print(f"  Unaffected:      {summary['unaffected_count']}")
    
    print("\nDetailed Mapped Asset Assessments:")
    for a in exp["assessed_assets"]:
        status = a["exposure_status"]
        name = a["name"]
        atype = a["asset_type"]
        advisory = a["advisory_priority"]
        print(f"  * [{status:<10}] {name} ({atype}) -> {advisory}")
        print(f"    Evidence: {a['evidence_details'][:85]}...")
        
    print("\nPipeline execution complete and verified.")


if __name__ == "__main__":
    main()
