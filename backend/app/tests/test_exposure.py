"""Tests for Tactical Exposure & KPIs API."""

import pytest


@pytest.mark.anyio
async def test_list_exposure_layers(client):
    response = await client.get("/api/exposure/layers")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 3


@pytest.mark.anyio
async def test_list_tactical_kpis(client):
    response = await client.get("/api/exposure/kpis")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 4
    kpi_labels = [k["label"] for k in json_data["data"]]
    assert "Population Exposure" in kpi_labels
    assert "Satellite Change Area" in kpi_labels
    assert "Road Accessibility" in kpi_labels
