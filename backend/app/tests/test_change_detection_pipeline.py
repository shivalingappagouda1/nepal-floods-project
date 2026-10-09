"""Tests for Change Detection Pipeline, Asset Exposure Engine, and FastAPI Endpoints."""

import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from PIL import Image
import numpy as np

from app.main import create_application
from app.services.change_detection_engine import ChangeDetectionPipeline, change_detection_pipeline
from app.services.exposure_analyzer import AssetExposureAnalyzer, asset_exposure_analyzer


@pytest.fixture
def client():
    app = create_application()
    return TestClient(app)


def test_pipeline_validation_error_on_missing_file(tmp_path):
    pipeline = ChangeDetectionPipeline()
    missing_file = tmp_path / "non_existent.jpg"
    valid_file = tmp_path / "valid.jpg"
    Image.new("RGB", (50, 50), color="blue").save(valid_file)

    with pytest.raises(FileNotFoundError):
        pipeline.validate_inputs(missing_file, valid_file)

    with pytest.raises(FileNotFoundError):
        pipeline.validate_inputs(valid_file, missing_file)


def test_pipeline_resampling_on_size_mismatch(tmp_path):
    pipeline = ChangeDetectionPipeline()
    pre_path = tmp_path / "pre.jpg"
    post_path = tmp_path / "post.jpg"

    Image.new("RGB", (64, 64), color="green").save(pre_path)
    Image.new("RGB", (32, 32), color="red").save(post_path)

    img_pre, img_post = pipeline.validate_inputs(pre_path, post_path)
    assert img_pre.size == img_post.size
    assert img_post.size == (64, 64)


def test_pipeline_spectral_delta_calculation(tmp_path):
    pipeline = ChangeDetectionPipeline(sensitivity_k=1.5)
    
    # Pre: solid green, Post: green with a red patch
    arr_pre = np.zeros((40, 40, 3), dtype=np.uint8)
    arr_pre[:, :] = [30, 150, 40]
    
    arr_post = np.copy(arr_pre)
    arr_post[10:20, 10:20] = [200, 50, 30]  # Simulated disaster disturbance patch

    img_pre = Image.fromarray(arr_pre, mode="RGB")
    img_post = Image.fromarray(arr_post, mode="RGB")

    diff, binary_mask, mu, threshold = pipeline.compute_radiometric_delta(img_pre, img_post)

    assert diff.shape == (40, 40)
    assert binary_mask.shape == (40, 40)
    assert threshold > mu
    # Patch pixels should be flagged in candidate change mask
    assert np.any(binary_mask[10:20, 10:20])


def test_pipeline_vectorize_and_georeference():
    pipeline = ChangeDetectionPipeline(min_cluster_pixels=4)
    mask = np.zeros((100, 100), dtype=bool)
    mask[20:30, 20:30] = True  # 10x10 patch = 100 pixels

    diff = np.ones((100, 100), dtype=np.float32) * 0.5
    bbox = [85.0, 27.0, 86.0, 28.0]

    geojson, area_sqkm = pipeline.vectorize_and_georeference(mask, diff, bbox)
    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 1
    feat = geojson["features"][0]
    assert feat["properties"]["pixel_count"] == 100
    assert area_sqkm > 0
    # Centroid must be within bbox
    lon, lat = feat["properties"]["centroid"]
    assert 85.0 <= lon <= 86.0
    assert 27.0 <= lat <= 28.0


def test_full_pipeline_execution():
    result = change_detection_pipeline.execute()
    manifest = result["manifest"]
    assert manifest["status"] == "SUCCESS"
    assert manifest["runtime_ms"] > 0
    assert "pre_event" in manifest["input_scenes"]
    assert "post_event" in manifest["input_scenes"]
    assert manifest["results_summary"]["total_candidate_clusters"] > 0
    assert manifest["results_summary"]["total_detected_change_sqkm"] > 0
    assert Path(result["mask_path"]).exists()
    assert Path(result["manifest_path"]).exists()


def test_asset_exposure_evaluation():
    exp = asset_exposure_analyzer.evaluate_exposure()
    assert exp["status"] == "SUCCESS"
    summary = exp["summary"]
    assert summary["total_count"] > 0
    assert summary["intersecting_count"] >= 0
    assert len(exp["assessed_assets"]) == summary["total_count"]

    # Verify that asset metadata is preserved
    for asset in exp["assessed_assets"]:
        assert "osm_id" in asset
        assert "name" in asset
        assert asset["exposure_status"] in ["INTERSECTS", "NEAR", "UNAFFECTED"]
        assert asset["verification_notice"] == "HUMAN_VERIFICATION_REQUIRED"


def test_api_pipeline_status_endpoint(client):
    resp = client.get("/api/satellite/pipeline/status")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["data"]["realDataLoaded"] is True
    assert data["data"]["preEventAvailable"] is True
    assert data["data"]["postEventAvailable"] is True


def test_api_pipeline_run_endpoint(client):
    resp = client.post("/api/satellite/pipeline/run?sensitivity_k=2.0")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["data"]["status"] == "SUCCESS"
    assert data["data"]["totalCandidateClusters"] > 0
    assert "rasterEndpoints" in data["data"]


def test_api_pipeline_latest_endpoint(client):
    resp = client.get("/api/satellite/pipeline/latest")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["data"]["totalCandidateClusters"] > 0


def test_api_pipeline_raster_stream(client):
    resp = client.get("/api/satellite/pipeline/raster/pre_event")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("image/")

    resp_mask = client.get("/api/satellite/pipeline/raster/change_mask")
    assert resp_mask.status_code == 200
    assert resp_mask.headers["content-type"] == "image/png"


def test_api_exposure_satellite_assets_endpoint(client):
    resp = client.get("/api/exposure/satellite-assets")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["data"]["summary"]["total_count"] >= 6
