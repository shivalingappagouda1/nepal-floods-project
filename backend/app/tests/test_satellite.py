"""Tests for Satellite Analysis API."""

import pytest


@pytest.mark.anyio
async def test_list_satellite_scenes(client):
    response = await client.get("/api/satellite/scenes")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 3
    # Verify provenance labeling
    scene = json_data["data"][0]
    assert scene["previewType"] == "PROTOTYPE_IMAGERY"
    assert scene["processingMode"] == "Precomputed analysis"


@pytest.mark.anyio
async def test_filter_satellite_scenes_by_sensor(client):
    response = await client.get("/api/satellite/scenes?sensor=Sentinel-1")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    for s in json_data["data"]:
        assert "Sentinel-1" in s["sensor"]


@pytest.mark.anyio
async def test_list_satellite_analyses(client):
    response = await client.get("/api/satellite/analyses")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1
    analysis = json_data["data"][0]
    assert "CONFIDENCE: Not available" in analysis["confidenceNote"]
