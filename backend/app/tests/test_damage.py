"""Tests for Damage Assessment API."""

import pytest


@pytest.mark.anyio
async def test_list_damage_categories(client):
    response = await client.get("/api/damage/categories")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) == 5
    categories = [c["category"] for c in json_data["data"]]
    assert "NO_SIGNIFICANT_CHANGE" in categories
    assert "POSSIBLE_DAMAGE" in categories
    assert "MODERATE_DAMAGE" in categories
    assert "SEVERE_DAMAGE" in categories
    assert "DESTROYED_INACCESSIBLE" in categories


@pytest.mark.anyio
async def test_list_damage_features(client):
    response = await client.get("/api/damage/features")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 5
    # Verify no invented numerical confidence
    for f in json_data["data"]:
        assert f["confidenceDisplay"] == "CONFIDENCE: Not available"


@pytest.mark.anyio
async def test_damage_summary(client):
    response = await client.get("/api/damage/summary")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    summary = json_data["data"]
    assert summary["totalFeaturesEvaluated"] >= 5
    assert "Not certified structural engineering" in summary["disclaimer"]
