"""Tests for Disaster Events API."""

import pytest


@pytest.mark.anyio
async def test_list_events(client):
    response = await client.get("/api/events")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 1
    event = json_data["data"][0]
    assert event["code"] == "NP-CN-20260826-GLOF"


@pytest.mark.anyio
async def test_get_single_event(client):
    response = await client.get("/api/events/DISASTER-2026-08-26-NP-CN")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    event = json_data["data"]
    assert event["basin"] == "Poiqu / Bhote Koshi River Basin (Koshi River System)"
    assert len(event["verifiedWaypoints"]) >= 4
    assert len(event["authoritativeSources"]) >= 3


@pytest.mark.anyio
async def test_get_event_waypoints(client):
    response = await client.get("/api/events/DISASTER-2026-08-26-NP-CN/waypoints")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 4
    first_wp = json_data["data"][0]
    assert first_wp["id"] == "WP-MITERI"


@pytest.mark.anyio
async def test_event_not_found(client):
    response = await client.get("/api/events/NON-EXISTENT-EVENT")
    assert response.status_code == 404
    json_data = response.json()
    assert json_data["success"] is False
    assert json_data["error"]["code"] == "SERVICE_ERROR"
