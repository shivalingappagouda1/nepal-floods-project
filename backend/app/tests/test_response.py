"""Tests for Emergency Response API."""

import pytest


@pytest.mark.anyio
async def test_list_response_zones(client):
    response = await client.get("/api/response/zones")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 5
    first_zone = json_data["data"][0]
    assert first_zone["id"] == "Zone A"
    assert first_zone["priorityTier"] == "PRIORITY_1"
    assert first_zone["routeStatus"]["routeDescription"] == "Route analysis unavailable."
    assert first_zone["confidenceDisplay"] == "CONFIDENCE: Not available"


@pytest.mark.anyio
async def test_filter_response_zones_by_tier(client):
    response = await client.get("/api/response/zones?tier=PRIORITY_1")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    for z in json_data["data"]:
        assert z["priorityTier"] == "PRIORITY_1"


@pytest.mark.anyio
async def test_get_single_response_zone(client):
    response = await client.get("/api/response/zones/Zone%20A")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["id"] == "Zone A"


@pytest.mark.anyio
async def test_list_staged_units(client):
    response = await client.get("/api/response/units")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 3


@pytest.mark.anyio
async def test_submit_advisory_directive(client):
    payload = {
        "zoneId": "Zone A",
        "actionDirective": "Prioritize high-line ropeway reconnaissance."
    }
    response = await client.post("/api/response/directives/submit", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    data = json_data["data"]
    assert data["zoneId"] == "Zone A"
    assert data["status"] == "QUEUED_FOR_COMMAND_SIGN_OFF"
    assert data["humanReviewRequired"] == "Human review required"
    assert data["queueType"] == "Decision-support queue only"
    assert "human-in-the-loop" in data["advisoryNotice"]
    assert "Human review required" in data["advisoryNotice"]
    assert "Decision-support queue only" in data["advisoryNotice"]
