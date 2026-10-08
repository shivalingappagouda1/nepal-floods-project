# HIMALAYA-SHIELD: Engineering & Factual Integrity Rules

**Document Version:** 1.0.0  
**Enforcement Level:** Mandatory for all contributors, agents, and automated pipelines.

---

## 1. Core Engineering & Factual Integrity Rules

1. **No Toy or Demo-Looking Applications:**
   The interface, architecture, and backend systems must reflect professional, mission-critical emergency operations standards. Typography, contrast, density, and spatial rendering must match real-world defense, civil-protection, or UN EOC command platforms.

2. **Zero Falsified Disaster Facts:**
   Never invent dates, earthquake magnitudes, death tolls, rainfall totals, or disaster chronologies. The August 26, 2026 transboundary event demonstration must reflect accurate Himalayan geomorphology, drainage corridors (Bhote Koshi / Trishuli / Marsyangdi basins), and real geographic entities.

3. **Zero Fabricated API Responses or Scientific Measurements:**
   Never generate fake satellite spectral values, imaginary sensor resolutions, invented population counts, or arbitrary structural damage statistics disguised as empirical facts.

4. **Explicit Labeling of Illustrative / Demonstration Values:**
   Whenever actual ground-truth data is pending or simulated for architectural validation, it MUST be explicitly labeled in the UI and API payload with standard badges:
   - `[DEMO / ILLUSTRATIVE]`
   - `[AWAITING SATELLITE PASS]`
   - `[PRELIMINARY ESTIMATE]`
   - `is_demo_value: true` in JSON payloads.

5. **Strict Source Traceability & Provenance:**
   Every factual metric, map layer, or statistical figure presented must carry a clear provenance link or citation (e.g., *Source: Copernicus Sentinel-2 MSI, acquired 2026-08-27; Baseline: OpenStreetMap Nepal contributors / HDX / DHM Nepal*).

6. **Calibrated AI Confidence Scores:**
   All machine-learning or spectral change-detection outputs must display an accompanying confidence score ($[0.0, 1.0]$ or percentage) and the specific algorithmic method used (e.g., *Method: Differential MNDWI Thresholding ($\theta=0.35$)*).

7. **Scientific Humility & Honest ML Boundaries:**
   Do not claim that AI can "predict" earthquakes, exact glacier collapses, or flash flood onset times with absolute certainty. Frame all ML outputs as hazard exposure assessments, empirical change detections, or probabilistic vulnerability models.

8. **Human-in-the-Loop Decision Support:**
   The system is strictly an advisory decision-support tool. It must never make autonomous life-or-death dispatch decisions. Critical actions (e.g., evacuation order recommendations, rescue team priority routing) must require human confirmation, override controls, and audit trails.

9. **Modular & Future-Proof Decoupling:**
   Maintain clean abstractions across data ingestion, AI processing, business logic, and presentation layers. Future live satellite APIs, real-time sensor streams (IoT river gauges), and PostGIS instances must be swappable without requiring frontend refactors.

10. **Disciplined Scope Management:**
    Do not over-engineer speculative features not required for the hackathon MVP. Maintain laser focus on the core value chain:
    $$\text{Satellite Evidence} \rightarrow \text{Change Detection} \rightarrow \text{Affected Area Viz} \rightarrow \text{Damage/Exposure Assessment} \rightarrow \text{Risk Scoring} \rightarrow \text{Emergency Priority} \rightarrow \text{Response Recommendation}$$

---

## 2. Data Categorization Standards

Every data point in HIMALAYA-SHIELD belongs to one of three strict tiers:

| Tier | Category | Label in UI | Requirement |
|---|---|---|---|
| **Tier 1** | **Empirical Ground Truth / Real Baseline** | `VERIFIED DATA` | Traceable to official sources (OSM, Sentinel-2, HDX, Gov of Nepal DHM). |
| **Tier 2** | **Algorithmically Computed** | `AI / COMPUTED ESTIMATE` | Must include confidence score, method name, and input data timestamps. |
| **Tier 3** | **Placeholder / Simulated** | `DEMO / ILLUSTRATIVE` | Marked with prominent visual indicator; never presented as real fact. |

---

## 3. Code Quality & Version Control Standards

- **TypeScript:** Strict type checking enabled (`strict: true`). Zero `any` types in domain and API data models.
- **Python / FastAPI:** Python 3.10+ typing (`typing` / Pydantic v2). All API endpoints must have explicit return schemas.
- **Git Commits:** Conventional Commits standard (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`). Clean, atomic commits with descriptive messages.
- **Performance:** Geospatial raster operations must be windowed or pre-processed to prevent memory bottlenecks in containerized environments.
