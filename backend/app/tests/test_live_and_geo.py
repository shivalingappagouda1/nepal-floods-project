"""Tests for Live Feeds, Geocoding, and Boundaries endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_live_feed_status():
    response = client.get("/api/live/status")
    assert response.status_code == 200
    data = response.json()
    assert data["system_status"] == "OPERATIONAL"
    assert "feeds" in data
    assert len(data["feeds"]) >= 4


def test_live_earthquakes():
    response = client.get("/api/live/earthquakes?min_mag=2.0")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "events" in data
    assert isinstance(data["events"], list)


def test_live_weather():
    response = client.get("/api/live/weather")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "stations" in data
    assert isinstance(data["stations"], list)


def test_geocoding_search():
    response = client.get("/api/geocoding/search?q=Bagmati")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert any("Bagmati" in item["name"] for item in data)


def test_boundaries_endpoints():
    r_country = client.get("/api/boundaries/country")
    assert r_country.status_code == 200
    assert r_country.json()["type"] == "FeatureCollection"

    r_provinces = client.get("/api/boundaries/provinces")
    assert r_provinces.status_code == 200
    assert len(r_provinces.json()["features"]) == 7

    r_districts = client.get("/api/boundaries/districts")
    assert r_districts.status_code == 200
    assert len(r_districts.json()["features"]) >= 75
