# HIMALAYA-SHIELD: Project Architecture Specification

**System Classification:** AI-Assisted Disaster Intelligence & Emergency Response Decision-Support System  
**Primary Demonstration Case:** August 2026 Nepal–China Transboundary Flooding & Debris Flow Disaster (Bhote Koshi / Trishuli River Basins)  
**System Status:** Architecture & Design Phase  

---

## 1. System Overview

HIMALAYA-SHIELD is an advanced geospatial disaster intelligence platform engineered to support emergency operations centers (EOCs), humanitarian response teams, and civil protection agencies during high-altitude transboundary geological and hydrological disasters in the Himalayan corridor.

The system ingests pre- and post-disaster satellite imagery, applies computer vision and spectral change-detection algorithms, maps inundated and landslide-impacted zones, cross-references critical infrastructure exposure (buildings, roads, bridges, medical facilities), calculates composite risk scores, and generates human-in-the-loop emergency response priority queues.

```
+-----------------------------------------------------------------------------------+
|                                  HIMALAYA-SHIELD                                  |
|               AI Disaster Intelligence & Decision-Support Pipeline                 |
+-----------------------------------------------------------------------------------+
                                          |
    +-------------------------------------+------------------------------------+
    |                                                                          |
    v                                                                          v
[Satellite Raster Data]                                              [Baseline Vector Data]
(Sentinel-2, Landsat, Planet)                                        (OSM, HDX, Gov Nepal)
    |                                                                          |
    +-------------------------------------+------------------------------------+
                                          |
                                          v
                    +-------------------------------------------+
                    |        Geospatial & AI Pipeline           |
                    |  - Spectral Indices (NDWI, MNDWI, NDVI)   |
                    |  - Differential Change Detection          |
                    |  - Flood & Landslide Mask Polygonization  |
                    |  - Spatial Overlay & Exposure Analysis    |
                    |  - Multi-Criteria Risk Scoring Engine     |
                    +-------------------------------------------+
                                          |
                                          v
                    +-------------------------------------------+
                    |          FastAPI Application Layer        |
                    |  - RESTful v1 Endpoints & OpenAPI Docs    |
                    |  - Provenance & Confidence Serialization  |
                    |  - GeoJSON / Vector Tile Streamer         |
                    +-------------------------------------------+
                                          |
                                          v
                    +-------------------------------------------+
                    |      MapLibre & React Command Center      |
                    |  - Real-time Geospatial Map Canvas        |
                    |  - Layer Matrix & Spectral Split-Views    |
                    |  - Actionable Emergency Priority Queue    |
                    |  - Human-in-the-Loop Triage Controls      |
                    +-------------------------------------------+
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack
- **Core Framework:** React 18+ with Vite (TypeScript strict mode)
- **Styling & Design System:** Tailwind CSS with custom command-center tokens (dark slate/zinc palette, amber/red warning hierarchies, monospace telemetry readouts)
- **Geospatial Map Engine:** MapLibre GL JS (WebGL-accelerated vector and raster rendering, custom shader layers, split-pane comparison view)
- **State Management & Caching:** TanStack Query (React Query) for server state and asynchronous caching; Zustand for synchronous UI state (active layers, selected AOI, filter parameters, inspector panels)
- **Icons & Visuals:** Lucide React for consistent tactical iconography
- **Data Visualization:** Recharts / custom SVG micro-charts for risk histograms and elevation profiles

### 2.2 Component Hierarchy & Layout
```
AppShell
├── TopBar (System Telemetry, Live Clock, AOI Selector, Active Incident Badge)
├── Sidebar (Navigation: Dashboard, Satellite Analysis, Damage Assessment, Risk Scoring, EOC Response)
├── MainContentArea
│   ├── MapViewport (Full-canvas MapLibre GL JS instance)
│   │   ├── LayerControlOverlay (Satellite, Flood, Landslide, Infrastructure, Demographics)
│   │   ├── MapInspectTool (Coordinates, Elevation, Exposure Popup)
│   │   ├── SplitViewSlider (Pre- vs Post-Disaster Visual Comparison)
│   │   └── SeverityLegend (Standardized UN OCHA / NDMA color scales)
│   └── TacticalSidePanel (Collapsible right-hand analytical deck)
│       ├── KPIGrid (Total Area Flooded, Critical Structures at Risk, Road Blockages, Displaced Estimate)
│       ├── RiskIndicator (Multi-variable composite score meter with confidence bands)
│       ├── PriorityList (Actionable evacuation/rescue recommendations with Human Override)
│       └── ProvenanceInspector (Data origin, satellite sensor ID, acquisition timestamp, model confidence)
└── BottomStatusBar (Data freshness, API latency, active coordinate CRS: EPSG:4326 / EPSG:32645)
```

---

## 3. Backend Architecture

### 3.1 Technology Stack
- **Framework:** Python 3.10+ with FastAPI (Asynchronous ASGI server via Uvicorn)
- **Data Validation & Serialization:** Pydantic v2 with strict schemas, provenance typing, and ISO-8601 timestamps
- **Architecture Pattern:** Controller-Service-Repository pattern with clean separation of concerns

### 3.2 Modular Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── incidents.py      # Active disaster metadata & boundaries
│   │       │   ├── satellite.py      # Pre/post raster metadata & tile URLs
│   │       │   ├── change_detect.py  # Inference triggers & change polygons
│   │       │   ├── damage.py         # Infrastructure exposure & damage matrices
│   │       │   ├── risk_score.py     # Composite risk calculations & ranking
│   │       │   └── response.py       # Actionable EOC recommendations & triage
│   │       └── router.py             # Root v1 API router aggregation
│   ├── core/
│   │   ├── config.py                 # Pydantic BaseSettings (env vars, CRS defaults)
│   │   ├── logging.py                # Structured JSON logging
│   │   └── errors.py                 # Standardized error response handlers
│   ├── models/
│   │   ├── domain.py                 # Core domain entities (Incident, AOI, HazardZone)
│   │   └── schemas.py                # Pydantic request/response DTOs with ProvenanceMeta
│   ├── services/
│   │   ├── raster_service.py         # GeoTIFF loading, band arithmetic, clipping
│   │   ├── change_service.py         # Spectral difference & threshold segmentation
│   │   ├── damage_service.py         # Spatial intersection of flood mask with OSM layers
│   │   └── priority_service.py       # Multi-criteria decision analysis (MCDA) engine
│   └── main.py                       # FastAPI instantiation, CORS, lifecycle hooks
```

---

## 4. AI & Computer Vision Architecture

### 4.1 Processing Modalities
1. **Spectral Water & Sediment Change Detection:**
   - Pre- and post-event spectral index generation:
     $$\text{NDWI} = \frac{\text{Green} - \text{NIR}}{\text{Green} + \text{NIR}}$$
     $$\text{MNDWI} = \frac{\text{Green} - \text{SWIR}}{\text{Green} + \text{SWIR}}$$
     $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$$
   - Differential index thresholding ($\Delta \text{MNDWI} > \theta_{\text{flood}}$, $\Delta \text{NDVI} < \theta_{\text{debris}}$) for identifying freshly inundated river plains and stripped vegetation / landslide scarps.
2. **Segmentation & Morphological Filtering:**
   - OpenCV morphological operations (opening/closing) to eliminate single-pixel sensor noise.
   - Connected-component labeling and polygonization via `rasterio.features.shapes`.
3. **Confidence & Provenance Calibration:**
   - Every detected polygon includes:
     - `confidence_score`: Floating-point scalar $[0.0, 1.0]$ based on cloud-mask clearance, spectral separation distance, and sensor ground sample distance (GSD).
     - `provenance`: Dictionary detailing sensor platform, acquisition date/time, processing algorithm, and operator validation status.

---

## 5. Geospatial Architecture

### 5.1 Standards & CRS
- **Storage & Vector Interchange:** WGS 84 (`EPSG:4326`) for global interoperability and GeoJSON output.
- **Projected Geospatial Analysis:** UTM Zone 45N (`EPSG:32645`) for accurate metric distance, area, and buffer calculations across Central/Eastern Nepal and the Himalaya border.
- **Raster Formats:** Cloud-Optimized GeoTIFF (COG) for efficient partial spatial reading and streaming.

### 5.2 Tooling
- **GeoPandas & Shapely:** High-performance spatial joins (e.g., finding all health facilities within a 500m buffer of active debris flow polygons).
- **Rasterio & GDAL:** Windowed raster reading, reprojection, and polygonization.
- **R-Tree Spatial Indexing:** Sub-millisecond vector intersection queries.

---

## 6. End-to-End Data Flow

```
+--------------------------------------------------------------------------------+
| 1. Ingestion Phase                                                             |
| Sentinel-2 / Landsat-9 Pre-Disaster (e.g. Aug 10) & Post-Disaster (Aug 27) COG |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 2. AI & Spectral Processing Phase                                              |
| Compute delta-MNDWI & delta-NDVI; generate binary change mask; filter artifacts|
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 3. Vectorization & Spatial Enrichment                                          |
| Convert raster masks to GeoJSON polygons; transform to EPSG:32645;             |
| perform spatial joins with OSM highway, building, and healthcare shapefiles    |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 4. Multi-Criteria Risk & Priority Scoring                                      |
| Calculate Impact Severity = w1(PopDensity) + w2(InfraDamage) + w3(Isolation)   |
| Assign Priority Ranks (P1: Critical Evac, P2: Access Blocked, P3: Monitor)    |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 5. Decision-Support API Delivery                                               |
| FastAPI serves GeoJSON FeatureCollections + KPI payloads + Provenance headers  |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| 6. Tactical Visualization & Human-in-the-Loop Triage                           |
| MapLibre renders layers; Emergency Commander reviews, flags, or approves EOC   |
+--------------------------------------------------------------------------------+
```

---

## 7. Folder Structure

```
nepal-floods-project-2/
├── .github/                      # CI/CD workflows and validation scripts
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── __init__.py
│   │   │       │   ├── incidents.py
│   │   │       │   ├── satellite.py
│   │   │       │   ├── change_detect.py
│   │   │       │   ├── damage.py
│   │   │       │   ├── risk_score.py
│   │   │       │   └── response.py
│   │   │       └── router.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── errors.py
│   │   │   └── logging.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── domain.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── raster_service.py
│   │   │   ├── change_service.py
│   │   │   ├── damage_service.py
│   │   │   └── priority_service.py
│   │   ├── __init__.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_geospatial.py
│   │   └── test_risk_engine.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/                     # React / Vite / TypeScript Frontend
│   ├── public/
│   │   └── data/                 # Baseline GeoJSON assets for instant offline execution
│   ├── src/
│   │   ├── assets/               # Branding, logos, tactical icons
│   │   ├── components/           # Reusable UI component library
│   │   │   ├── common/           # Buttons, Badges, Modals, Card, Tooltips
│   │   │   ├── layout/           # AppShell, TopBar, Sidebar, BottomStatusBar
│   │   │   └── tactical/         # KPIGrid, RiskIndicator, SeverityLegend, PriorityList, ProvenanceCard
│   │   ├── features/             # Business modules
│   │   │   ├── dashboard/        # Executive overview panel
│   │   │   ├── satellite/        # Spectral band selector & split-view
│   │   │   ├── damage/           # Infrastructure exposure table & stats
│   │   │   ├── risk/             # Hazard heatmaps & vulnerability matrices
│   │   │   └── response/         # Resource dispatch & human triage workflow
│   │   ├── hooks/                # Custom React hooks (useMapInstance, useDisasterData)
│   │   ├── services/             # Axios/Fetch API clients & mock-switchable adapters
│   │   ├── store/                # Zustand application stores
│   │   ├── types/                # Strict TypeScript interfaces (Incident, Layer, RiskScore)
│   │   ├── utils/                # Coordinate formatters, color mappers, math helpers
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── data/                         # Local geospatial repository (git-ignored raw binaries)
│   ├── raw/                      # Original satellite rasters & baseline shapefiles
│   ├── processed/                # Normalized GeoTIFFs, vectorized change masks
│   └── reference/                # Official disaster sitreps & factual reference data
├── docs/                         # Formal system documentation
│   ├── PROJECT_ARCHITECTURE.md   # This document
│   ├── DEVELOPMENT_RULES.md      # Factual integrity and code guidelines
│   └── ROADMAP.md                # MVP, post-hackathon, and long-term milestones
├── scripts/                      # Geospatial preprocessing & data download helpers
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 8. API Strategy

- **Protocol:** HTTP/2 RESTful API with JSON/GeoJSON standard content negotiation.
- **Versioning:** `/api/v1` prefix across all endpoints.
- **Provenance Standard:** All response objects wrap results with metadata indicating computation source:
  ```json
  {
    "status": "success",
    "provenance": {
      "source_type": "CALCULATED",
      "algorithm": "differential_mndwi_v1",
      "satellite_sensor": "Sentinel-2 MSI",
      "acquisition_timestamp": "2026-08-27T04:45:00Z",
      "confidence_score": 0.88,
      "is_demo_value": false
    },
    "data": { ... }
  }
  ```
- **Error Standard:** RFC 7807 Problem Details compliant JSON errors.

---

## 9. Testing Strategy

1. **Frontend Unit & Component Testing:** Vitest and React Testing Library for isolated UI components, data formatting, and state changes.
2. **Backend API Testing:** Pytest and HTTPX `AsyncClient` verifying request validation, status codes, and OpenAPI schema compliance.
3. **Geospatial Precision Testing:** Unit tests verifying coordinate reprojections (EPSG:4326 $\leftrightarrow$ EPSG:32645) and polygon intersection validity against known ground-truth geometries.
4. **Data Provenance Compliance Testing:** Automated tests verifying that no endpoint emits unmarked synthetic or hardcoded numbers without explicit `is_demo_value: true` or traceable citations.

---

## 10. Deployment Strategy

- **Local Hackathon Execution:** Multi-container `docker-compose.yml` launching:
  - Frontend: Vite dev server / Nginx lightweight container on port `3000`
  - Backend: FastAPI ASGI server on port `8000`
  - Zero-barrier data architecture: Embedded GeoJSON/GeoParquet files allow the application to boot and demonstrate immediately without requiring complex external database initialization.
- **Production Staging (Post-MVP):** Containerized deployment to cloud container platforms (AWS ECS / GCP Cloud Run) with PostGIS managed database and S3/GCS Cloud-Optimized GeoTIFF bucket storage.

---

## 11. Security Considerations

- **CORS Policies:** Explicit whitelist for frontend origins; zero wildcard credentials in production.
- **Input Sanitization:** Geospatial bounding boxes (`bbox`) validated against mathematical limits (Latitude $[-90, 90]$, Longitude $[-180, 180]$) to prevent denial-of-service through absurd query extents.
- **Path Traversal Protection:** Raster file endpoints use strict ID-to-path mapping; no raw filesystem path parameters allowed.

---

## 12. Future Extensibility

- **Live Ingestion Adapters:** Pluggable adapter interface (`SatelliteIngestionProvider`) enabling seamless addition of Copernicus Sentinel Hub, Planet Labs PlanetScope API, or USGS EarthExplorer feeds without changing backend business logic or frontend clients.
- **Multi-Hazard Expansion:** Extensible hazard scoring engine designed to incorporate seismological shake maps, glacial lake depth soundings, and meteorological rainfall thresholds.
