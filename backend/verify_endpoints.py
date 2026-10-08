from fastapi.testclient import TestClient
from app.main import app


def test_all_endpoints():
    client = TestClient(app)
    print("==================================================")
    print("HIMALAYA-SHIELD BACKEND API INTEGRATION TEST SUITE")
    print("==================================================")

    endpoints = [
        ("GET", "/health", None, 200),
        ("GET", "/api/health", None, 200),
        ("GET", "/api/events", None, 200),
        ("GET", "/api/events/DISASTER-2026-08-26-NP-CN", None, 200),
        ("GET", "/api/events/DISASTER-2026-08-26-NP-CN/waypoints", None, 200),
        ("GET", "/api/satellite/scenes", None, 200),
        ("GET", "/api/satellite/scenes/S1A-IW-GRDH-20260827", None, 200),
        ("GET", "/api/satellite/analyses", None, 200),
        ("GET", "/api/damage/categories", None, 200),
        ("GET", "/api/damage/features", None, 200),
        ("GET", "/api/damage/summary", None, 200),
        ("GET", "/api/risk/zones", None, 200),
        ("GET", "/api/risk/weights", None, 200),
        ("POST", "/api/risk/calculate", {"zoneId": "Zone A", "customWeights": {"slopeWeight": 0.40, "satelliteChangeWeight": 0.30}}, 200),
        ("GET", "/api/exposure/layers", None, 200),
        ("GET", "/api/exposure/kpis", None, 200),
        ("GET", "/api/response/zones", None, 200),
        ("GET", "/api/response/zones/Zone%20A", None, 200),
        ("GET", "/api/response/units", None, 200),
        ("POST", "/api/response/directives/submit", {"zoneId": "Zone A", "actionDirective": "Verify ropeway access"}, 200),
    ]

    passed = 0
    failed = 0

    for method, path, payload, expected_status in endpoints:
        try:
            if method == "GET":
                res = client.get(path)
            else:
                res = client.post(path, json=payload)

            if res.status_code == expected_status:
                print(f"[PASS] {method:4} {path:45} -> Status: {res.status_code}")
                passed += 1
            else:
                print(f"[FAIL] {method:4} {path:45} -> Expected {expected_status}, got {res.status_code}: {res.text}")
                failed += 1
        except Exception as e:
            print(f"[ERR ] {method:4} {path:45} -> Error: {e}")
            failed += 1

    print("==================================================")
    print(f"RESULTS: {passed} PASSED, {failed} FAILED across {len(endpoints)} endpoints")
    print("==================================================")

    if failed > 0:
        raise SystemExit(1)


if __name__ == "__main__":
    test_all_endpoints()
