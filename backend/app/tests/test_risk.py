"""Tests for Geospatial Risk Analysis API."""

import pytest


@pytest.mark.anyio
async def test_list_risk_zones(client):
    response = await client.get("/api/risk/zones")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 2
    zone = json_data["data"][0]
    assert zone["prototypeScoreLabel"] == "Prototype risk score"
    assert zone["dataCompletenessPercent"] == 100.0
    assert len(zone["factors"]) == 6


@pytest.mark.anyio
async def test_get_risk_weights(client):
    response = await client.get("/api/risk/weights")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    weights = json_data["data"]
    assert "slopeWeight" in weights
    assert "satelliteChangeWeight" in weights


@pytest.mark.anyio
async def test_calculate_custom_risk(client):
    payload = {
        "zoneId": "Zone A",
        "customWeights": {
            "slopeWeight": 0.50,
            "rainfallWeight": 0.10,
            "satelliteChangeWeight": 0.20,
            "geologyWeight": 0.10,
            "exposureWeight": 0.05,
            "historicalRiskWeight": 0.05
        }
    }
    response = await client.post("/api/risk/calculate", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    res = json_data["data"]
    assert res["id"] == "Zone A"
    assert res["calculatedScore"] > 0
    assert res["prototypeScoreLabel"] == "Prototype risk score"
