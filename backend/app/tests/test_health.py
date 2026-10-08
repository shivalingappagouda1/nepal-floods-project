"""Tests for Health Check Endpoints."""

import pytest


@pytest.mark.anyio
async def test_root_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "himalaya-shield-backend"
    assert "version" in data
    assert "timestamp" in data


@pytest.mark.anyio
async def test_api_health_check(client):
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
