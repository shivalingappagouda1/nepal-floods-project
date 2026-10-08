"""Authoritative Case Study and Precomputed Disaster Intelligence Datasets."""

from app.schemas.events import DisasterCaseStudy, VerifiedGeographicWaypoint, AuthoritativeSourceRef
from app.schemas.satellite import SatelliteScene, SatelliteAnalysisDelta
from app.schemas.damage import DamageCategory, DamageCategoryConfig, DamageFeature, DamageAssessmentSummary
from app.schemas.risk import RiskZoneResult, RiskFactorAssessment, RiskFactorLevel, RiskEngineWeights
from app.schemas.exposure import ExposureLayerInfo, KPICardData
from app.schemas.response import PriorityZone, ResponsePriorityTier, RouteStatus, ResponseFactorAssessment, StagedReliefUnit
from app.schemas.common import ProvenanceMeta, DataTier, SeverityLevel


# 1. 2026 Nepal-China Transboundary Disaster Case Study
CASE_STUDY_2026 = DisasterCaseStudy(
    id="DISASTER-2026-08-26-NP-CN",
    code="NP-CN-20260826-GLOF",
    name="26 August 2026 Nepal–China Transboundary Hydrological & Debris Surge",
    eventDate="2026-08-26",
    basin="Poiqu / Bhote Koshi River Basin (Koshi River System)",
    country="Nepal & China (Transboundary)",
    region="Sindhupalchok District (Bagmati Province, Nepal) / Nyalam County (Tibet Autonomous Region, China)",
    eventType="Transboundary Flash Flood & Debris Surge",
    mechanismStatus="Mechanism under investigation",
    mechanismNotes="Preliminary scientific assessment: Upstream hydrological anomaly along the Poiqu River corridor in Tibet traversing the border at Tatopani/Kodari into Sindhupalchok. Exact trigger (high-altitude glacial lake drainage vs. tributary landslide dam breach) remains under active investigation by regional scientific bodies.",
    monitoringReadiness="DHM Nepal Barhabise Gauge (Station 610) & Sentinel-2 T45RWQ multi-spectral staging active.",
    verifiedWaypoints=[
        VerifiedGeographicWaypoint(
            id="WP-MITERI",
            name="Miteri Friendship Bridge (Transboundary Border Point)",
            coordinates=(85.9461, 27.9575),
            elevationMeters=1770,
            significance="Primary international overland crossing point connecting Nepal (Kodari/Tatopani) and China (Zhangmu/Nyalam).",
            authoritySource="OpenStreetMap Relation 184633 / NDRRMA Nepal"
        ),
        VerifiedGeographicWaypoint(
            id="WP-TATOPANI",
            name="Tatopani Customs & Dry Port Complex",
            coordinates=(85.9425, 27.9515),
            elevationMeters=1650,
            significance="Critical commercial customs terminal and transit infrastructure along the narrow canyon bank.",
            authoritySource="Nepal Ministry of Industry, Commerce and Supplies / BIPAD Portal"
        ),
        VerifiedGeographicWaypoint(
            id="WP-LARCHA",
            name="Larcha / Bhairabkunda Khola Confluence",
            coordinates=(85.9220, 27.9050),
            elevationMeters=1420,
            significance="High-risk tributary junction known for historical debris flows and bridge approach severance.",
            authoritySource="ICIMOD Koshi Basin Baseline / OpenStreetMap"
        ),
        VerifiedGeographicWaypoint(
            id="WP-BARHABISE",
            name="Barhabise DHM Hydrological Station (Station ID: 610)",
            coordinates=(85.8980, 27.7890),
            elevationMeters=870,
            significance="Official Department of Hydrology and Meteorology real-time river level and flood warning gauge.",
            authoritySource="Department of Hydrology and Meteorology (DHM), Government of Nepal"
        ),
    ],
    authoritativeSources=[
        AuthoritativeSourceRef(
            id="SRC-DHM",
            name="Department of Hydrology and Meteorology (DHM)",
            authority="Government of Nepal",
            url="http://www.dhm.gov.np/",
            evidenceScope="Bhote Koshi River Basin gauging telemetry and flood alert thresholds.",
            accessDate="2026-10-08",
            status="MONITORING_ACTIVE"
        ),
        AuthoritativeSourceRef(
            id="SRC-NDRRMA",
            name="National Disaster Risk Reduction and Management Authority (NDRRMA)",
            authority="Ministry of Home Affairs, Government of Nepal",
            url="https://bipadportal.gov.np/",
            evidenceScope="Disaster incident catalog, impact validation protocols, and administrative boundaries.",
            accessDate="2026-10-08",
            status="CONFIRMED_BASELINE"
        ),
        AuthoritativeSourceRef(
            id="SRC-ICIMOD",
            name="International Centre for Integrated Mountain Development (ICIMOD)",
            authority="Regional Intergovernmental Knowledge Center (Hindu Kush Himalaya)",
            url="https://www.icimod.org/",
            evidenceScope="Transboundary Koshi basin morphology, glacial lake inventory, and hazard vulnerability mapping.",
            accessDate="2026-10-08",
            status="PRELIMINARY_INVESTIGATION"
        ),
    ],
    decisionSupportRecommendations=[
        "Prioritize physical gauge monitoring at Barhabise (Station 610) to confirm river level trends.",
        "Conduct aerial/ground reconnaissance between Miteri Bridge and Larcha confluence.",
        "Review Sentinel-1 SAR coherence delta for tributary blockages before dispatching heavy machinery."
    ],
    provenance=ProvenanceMeta(
        tier=DataTier.VERIFIED,
        source="Authoritative Transboundary Hazard Registry (DHM / NDRRMA / ICIMOD)",
        timestamp="2026-08-26T14:30:00Z",
        algorithm="Authoritative Case Study Verification",
        isDemoValue=False
    )
)


# 2. Satellite Scenes Catalog & Precomputed Deltas
PRECOMPUTED_SATELLITE_SCENES = [
    SatelliteScene(
        id="S1A-IW-GRDH-20260827",
        sensor="Sentinel-1 SAR C-Band",
        platform="Sentinel-1A",
        granuleId="S1A_IW_GRDH_1SDV_20260827T001422_060712_076543_B891",
        acquisitionDate="2026-08-27T00:14:22Z",
        orbitType="Ascending Track 121",
        resolutionMeters=10.0,
        bbox=[85.75, 27.70, 86.15, 28.10],
        previewType="PROTOTYPE_IMAGERY",
        processingMode="Precomputed analysis",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Copernicus Open Access Hub (Precomputed demonstration asset)",
            sensor="Sentinel-1A C-SAR",
            isDemoValue=True
        )
    ),
    SatelliteScene(
        id="S2B-MSI-L2A-20260828",
        sensor="Sentinel-2 Optical Multi-Spectral",
        platform="Sentinel-2B",
        granuleId="S2B_MSIL2A_20260828T045649_N0511_R076_T45RWQ_20260828T081530",
        acquisitionDate="2026-08-28T04:56:49Z",
        cloudCoverPercentage=18.4,
        resolutionMeters=10.0,
        bbox=[85.75, 27.70, 86.15, 28.10],
        previewType="PROTOTYPE_IMAGERY",
        processingMode="Precomputed analysis",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Copernicus Sentinel-2 L2A (Precomputed demonstration asset)",
            sensor="Sentinel-2B MSI",
            isDemoValue=True
        )
    ),
    SatelliteScene(
        id="LC09-OLI2-20260825",
        sensor="Landsat-9 OLI-2 / TIRS-2",
        platform="Landsat-9",
        granuleId="LC09_L2SP_141041_20260825_20260825_02_T1",
        acquisitionDate="2026-08-25T04:48:12Z",
        cloudCoverPercentage=12.1,
        resolutionMeters=30.0,
        bbox=[85.60, 27.50, 86.30, 28.20],
        previewType="PROTOTYPE_IMAGERY",
        processingMode="Precomputed analysis",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="USGS EarthExplorer (Precomputed baseline asset)",
            sensor="Landsat-9 OLI-2",
            isDemoValue=True
        )
    )
]

PRECOMPUTED_ANALYSES = [
    SatelliteAnalysisDelta(
        id="ANALYSIS-S1-SAR-DELTA-01",
        title="SAR Coherence Loss & Surface Water Expansion Delta",
        sensorPair="Sentinel-1A (2026-08-15 vs 2026-08-27)",
        baselineDate="2026-08-15",
        crisisDate="2026-08-27",
        changeDetectionMethod="Log-Ratio Amplitude Difference + Interferometric Coherence Decrease",
        detectedChangeAreaSqKm=4.82,
        metricsDescription="Precomputed synthetic delta: Significant radar backscatter drop along 18.4 km gorge channel.",
        processingMode="Precomputed analysis",
        confidenceNote="CONFIDENCE: Not available (Omitted until empirical ground-truth validation is connected)",
        spatialFootprint=[
            (85.946, 27.958),
            (85.942, 27.951),
            (85.922, 27.905),
            (85.898, 27.789)
        ],
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Prototype Satellite Pipeline (Precomputed synthetic run)",
            algorithm="SAR Backscatter Thresholding Delta",
            isDemoValue=True
        )
    )
]


# 3. Damage Categories & Precomputed Damage Features
DAMAGE_CONFIGS = [
    DamageCategoryConfig(
        category=DamageCategory.NO_SIGNIFICANT_CHANGE,
        label="No Significant Change",
        color="#10b981",
        description="Observable optical and SAR signatures show no significant detected change in the available analysis.",
        evidenceCharacteristics=["Stable multi-spectral NDVI", "High SAR interferometric coherence (>0.8)"]
    ),
    DamageCategoryConfig(
        category=DamageCategory.POSSIBLE_DAMAGE,
        label="Possible Damage",
        color="#f59e0b",
        description="Minor spectral anomalies or subtle radar backscatter changes observed. Requires field verification.",
        evidenceCharacteristics=["Localized NDVI decrease", "Moderate coherence drop (0.5 - 0.7)"]
    ),
    DamageCategoryConfig(
        category=DamageCategory.MODERATE_DAMAGE,
        label="Moderate Damage",
        color="#f97316",
        description="Clear evidence of surface inundation, localized sediment deposition, or partial transport corridor obstruction.",
        evidenceCharacteristics=["Turbid water spectral signature", "Significant SAR backscatter attenuation"]
    ),
    DamageCategoryConfig(
        category=DamageCategory.SEVERE_DAMAGE,
        label="Severe Damage",
        color="#f43f5e",
        description="Extensive ground displacement, scouring, or heavy debris fan accumulation visible across infrastructure corridors.",
        evidenceCharacteristics=["Complete optical reflectance shift", "Severe SAR coherence loss (<0.2)"]
    ),
    DamageCategoryConfig(
        category=DamageCategory.DESTROYED_INACCESSIBLE,
        label="Destroyed / Inaccessible",
        color="#a855f7",
        description="Complete physical obliteration of observable surface features or severe geomorphic channel rerouting.",
        evidenceCharacteristics=["Total surface re-deposition", "Submerged topography in riverbed"]
    )
]

PRECOMPUTED_DAMAGE_FEATURES = [
    DamageFeature(
        id="DMG-FEAT-001",
        featureCode="FEAT-TATOPANI-GORGE",
        category=DamageCategory.SEVERE_DAMAGE,
        categoryLabel="Severe Damage",
        evidenceSource="Sentinel-2 Multi-Spectral Delta (Synthetic/Precomputed)",
        timestamp="2026-08-28T04:56:49Z",
        verificationStatus="Ground verification recommended",
        confidenceDisplay="CONFIDENCE: Not available",
        coordinates=(85.9461, 27.9575),
        locationName="Tatopani Border Canyon Transit Corridor",
        observedChangeSummary="Precomputed optical change indicates severe scouring and sediment deposition along gorge approach.",
        isPrecomputed=True,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Precomputed Step 5 Damage Evidence Model (Synthetic)",
            sensor="Sentinel-2B MSI",
            isDemoValue=True
        )
    ),
    DamageFeature(
        id="DMG-FEAT-002",
        featureCode="FEAT-LARCHA-FAN",
        category=DamageCategory.SEVERE_DAMAGE,
        categoryLabel="Severe Damage",
        evidenceSource="Sentinel-1 SAR Amplitude Delta (Synthetic/Precomputed)",
        timestamp="2026-08-27T00:14:22Z",
        verificationStatus="Ground verification recommended",
        confidenceDisplay="CONFIDENCE: Not available",
        coordinates=(85.9220, 27.9050),
        locationName="Larcha / Bhairabkunda Khola Confluence Fan",
        observedChangeSummary="Precomputed radar amplitude anomaly indicates extensive tributary debris fan accumulation.",
        isPrecomputed=True,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Precomputed Step 5 Damage Evidence Model (Synthetic)",
            sensor="Sentinel-1A C-SAR",
            isDemoValue=True
        )
    ),
    DamageFeature(
        id="DMG-FEAT-003",
        featureCode="FEAT-CHAKU-HYDRO",
        category=DamageCategory.MODERATE_DAMAGE,
        categoryLabel="Moderate Damage",
        evidenceSource="Multi-Sensor Optical & SAR Composite (Synthetic/Precomputed)",
        timestamp="2026-08-28T04:56:49Z",
        verificationStatus="Ground verification recommended",
        confidenceDisplay="CONFIDENCE: Not available",
        coordinates=(85.9130, 27.8820),
        locationName="Chaku Khola Hydropower Corridor",
        observedChangeSummary="Precomputed multi-sensor delta shows localized overbank sedimentation around power infrastructure.",
        isPrecomputed=True,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Precomputed Step 5 Damage Evidence Model (Synthetic)",
            sensor="Sentinel-2 + Landsat-9",
            isDemoValue=True
        )
    ),
    DamageFeature(
        id="DMG-FEAT-004",
        featureCode="FEAT-BARHABISE-BAZAAR",
        category=DamageCategory.NO_SIGNIFICANT_CHANGE,
        categoryLabel="No Significant Change",
        evidenceSource="Sentinel-2 Multi-Spectral Delta (Synthetic/Precomputed)",
        timestamp="2026-08-28T04:56:49Z",
        verificationStatus="Human verification recommended",
        confidenceDisplay="CONFIDENCE: Not available",
        coordinates=(85.8980, 27.7890),
        locationName="Barhabise Municipal Bazaar Basin",
        observedChangeSummary="Precomputed spectral delta indicates stable baseline with minor river stage elevation.",
        isPrecomputed=True,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Precomputed Step 5 Damage Evidence Model (Synthetic)",
            sensor="Sentinel-2B MSI",
            isDemoValue=True
        )
    ),
    DamageFeature(
        id="DMG-FEAT-005",
        featureCode="FEAT-UPPER-HEADWATERS",
        category=DamageCategory.DESTROYED_INACCESSIBLE,
        categoryLabel="Destroyed / Inaccessible",
        evidenceSource="Sentinel-1 InSAR Phase Decorrelation (Synthetic/Precomputed)",
        timestamp="2026-08-27T00:14:22Z",
        verificationStatus="High-altitude aerial reconnaissance recommended",
        confidenceDisplay="CONFIDENCE: Not available",
        coordinates=(85.9620, 28.0150),
        locationName="Upper Bhote Koshi Transboundary Headwaters",
        observedChangeSummary="Precomputed InSAR model reveals severe moraine scarp destabilization and supra-glacial drainage path.",
        isPrecomputed=True,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Precomputed Step 5 Damage Evidence Model (Synthetic)",
            sensor="Sentinel-1A InSAR",
            isDemoValue=True
        )
    )
]


# 4. Risk Engine Precomputed Zones
PRECOMPUTED_RISK_ZONES = [
    RiskZoneResult(
        id="Zone A",
        name="Tatopani Border Gorge Sector",
        coordinates=(85.9461, 27.9575),
        prototypeScoreLabel="Prototype risk score",
        overallRisk=SeverityLevel.CRITICAL,
        calculatedScore=91.4,
        dataCompletenessPercent=100.0,
        activeFactorsCount=6,
        factors={
            "slope": RiskFactorAssessment(
                key="slope",
                label="Slope Gradient",
                level=RiskFactorLevel.CRITICAL,
                normalizedValue=0.95,
                configuredWeight=0.20,
                effectiveWeight=0.20,
                weightedContribution=19.0,
                statusDisplay="CRITICAL (Slope > 45°)",
                description="Very steep canyon walls subject to rockfall and debris channelization."
            ),
            "elevation": RiskFactorAssessment(
                key="elevation",
                label="Elevation Head",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.88,
                configuredWeight=0.15,
                effectiveWeight=0.15,
                weightedContribution=13.2,
                statusDisplay="HIGH (1,770m ASL)",
                description="High hydraulic kinetic potential due to steep valley descent."
            ),
            "rainfall": RiskFactorAssessment(
                key="rainfall",
                label="Precipitation Anomaly",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.85,
                configuredWeight=0.20,
                effectiveWeight=0.20,
                weightedContribution=17.0,
                statusDisplay="HIGH (Modeled intense monsoon cell)",
                description="High soil saturation modeled across upper catchment."
            ),
            "geology": RiskFactorAssessment(
                key="geology",
                label="Geology & Bedrock Competence",
                level=RiskFactorLevel.CRITICAL,
                normalizedValue=0.92,
                configuredWeight=0.15,
                effectiveWeight=0.15,
                weightedContribution=13.8,
                statusDisplay="CRITICAL (Highly sheared schist)",
                description="Main Central Thrust tectonic shear zone with friable rock mass."
            ),
            "satelliteChange": RiskFactorAssessment(
                key="satelliteChange",
                label="Satellite Change Evidence",
                level=RiskFactorLevel.CRITICAL,
                normalizedValue=0.96,
                configuredWeight=0.25,
                effectiveWeight=0.25,
                weightedContribution=24.0,
                statusDisplay="CRITICAL (Precomputed SAR coherence loss)",
                description="Extensive surface change detected in precomputed radar model."
            ),
            "historicalRisk": RiskFactorAssessment(
                key="historicalRisk",
                label="Historical Hazard Frequency",
                level=RiskFactorLevel.MEDIUM,
                normalizedValue=0.44,
                configuredWeight=0.05,
                effectiveWeight=0.05,
                weightedContribution=4.4,
                statusDisplay="MEDIUM (1981, 2016 historical surges)",
                description="Documented corridor history of transboundary outburst surges."
            ),
        },
        operationalRecommendation="Recommended: Prioritize field verification and resource assessment.",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Prototype Risk Engine (Explainable 6-Factor Model)",
            algorithm="Transparent Multi-Criteria Geospatial Weighted Sum",
            isDemoValue=True
        )
    ),
    RiskZoneResult(
        id="Zone B",
        name="Larcha / Bhairabkunda Khola Confluence Fan",
        coordinates=(85.9220, 27.9050),
        prototypeScoreLabel="Prototype risk score",
        overallRisk=SeverityLevel.CRITICAL,
        calculatedScore=86.2,
        dataCompletenessPercent=100.0,
        activeFactorsCount=6,
        factors={
            "slope": RiskFactorAssessment(
                key="slope",
                label="Slope Gradient",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.82,
                configuredWeight=0.20,
                effectiveWeight=0.20,
                weightedContribution=16.4,
                statusDisplay="HIGH (Tributary gorge slope 38°)",
                description="Steep tributary channel prone to rapid sediment mobilization."
            ),
            "elevation": RiskFactorAssessment(
                key="elevation",
                label="Elevation Head",
                level=RiskFactorLevel.MEDIUM,
                normalizedValue=0.72,
                configuredWeight=0.15,
                effectiveWeight=0.15,
                weightedContribution=10.8,
                statusDisplay="MEDIUM (1,420m ASL)",
                description="Confluence fan bottleneck."
            ),
            "rainfall": RiskFactorAssessment(
                key="rainfall",
                label="Precipitation Anomaly",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.85,
                configuredWeight=0.20,
                effectiveWeight=0.20,
                weightedContribution=17.0,
                statusDisplay="HIGH (Monsoon rain cell)",
                description="High catchment saturation."
            ),
            "geology": RiskFactorAssessment(
                key="geology",
                label="Geology & Bedrock Competence",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.88,
                configuredWeight=0.15,
                effectiveWeight=0.15,
                weightedContribution=13.2,
                statusDisplay="HIGH (Alluvial-colluvial fan deposits)",
                description="Unconsolidated debris material."
            ),
            "satelliteChange": RiskFactorAssessment(
                key="satelliteChange",
                label="Satellite Change Evidence",
                level=RiskFactorLevel.CRITICAL,
                normalizedValue=0.94,
                configuredWeight=0.25,
                effectiveWeight=0.25,
                weightedContribution=23.5,
                statusDisplay="CRITICAL (Precomputed optical change)",
                description="Major surface debris expansion."
            ),
            "historicalRisk": RiskFactorAssessment(
                key="historicalRisk",
                label="Historical Hazard Frequency",
                level=RiskFactorLevel.HIGH,
                normalizedValue=0.85,
                configuredWeight=0.05,
                effectiveWeight=0.05,
                weightedContribution=5.3,
                statusDisplay="HIGH (1996 Larcha debris flow event)",
                description="Site of severe historical tributary debris catastrophe."
            ),
        },
        operationalRecommendation="Recommended: Assess accessibility and critical-infrastructure impact.",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Prototype Risk Engine (Explainable 6-Factor Model)",
            algorithm="Transparent Multi-Criteria Geospatial Weighted Sum",
            isDemoValue=True
        )
    )
]


# 5. Tactical Exposure & KPIs
EXPOSURE_LAYERS = [
    ExposureLayerInfo(
        id="layer-sentinel2-rgb",
        label="Sentinel-2 Optical (Natural Color)",
        category="IMAGERY",
        enabled=True,
        opacity=0.9,
        badge=DataTier.DEMO_VALUE,
        description="Precomputed prototype multi-spectral imagery overlay.",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Copernicus Sentinel-2B",
            isDemoValue=True
        )
    ),
    ExposureLayerInfo(
        id="layer-flood-extent",
        label="Flood Inundation Corridor",
        category="HAZARD",
        enabled=True,
        opacity=0.8,
        badge=DataTier.DEMO_VALUE,
        description="Precomputed synthetic flood extent mask.",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Prototype Synthetic Flood Model",
            isDemoValue=True
        )
    ),
    ExposureLayerInfo(
        id="layer-critical-infrastructure",
        label="Critical Infrastructure Lifelines",
        category="INFRASTRUCTURE",
        enabled=True,
        opacity=1.0,
        badge=DataTier.DEMO_VALUE,
        description="Key bridges, hydropower plants, customs facilities, and DHM gauge stations.",
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="OpenStreetMap & Government of Nepal Registry",
            isDemoValue=True
        )
    )
]

TACTICAL_KPIS = [
    KPICardData(
        id="kpi-population-exposure",
        label="Population Exposure",
        value="DEMO / ILLUSTRATIVE",
        unit="",
        statusLabel="Prototype Scenario Input",
        severity=SeverityLevel.HIGH,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Prototype Scenario Parameter (No live census link)",
            isDemoValue=True
        )
    ),
    KPICardData(
        id="kpi-satellite-coverage",
        label="Satellite Change Area",
        value="4.82",
        unit="km²",
        statusLabel="Precomputed Synthetic Delta",
        severity=SeverityLevel.CRITICAL,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Sentinel-1/2 Precomputed Change Model",
            isDemoValue=True
        )
    ),
    KPICardData(
        id="kpi-critical-infrastructure",
        label="Infrastructure Targets",
        value="5",
        unit="sites",
        statusLabel="Target Catalog References",
        severity=SeverityLevel.HIGH,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="OpenStreetMap / NDRRMA Baseline",
            isDemoValue=True
        )
    ),
    KPICardData(
        id="kpi-road-status",
        label="Road Accessibility",
        value="Route analysis unavailable",
        unit="",
        statusLabel="Live Telemetry Not Connected",
        severity=SeverityLevel.CRITICAL,
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="Road Routing Data Unavailable",
            isDemoValue=True
        )
    )
]


# 6. Response Priority Zones & Staged Units
PRECOMPUTED_RESPONSE_ZONES = [
    PriorityZone(
        id="Zone A",
        zoneCode="ZONE-A-TATOPANI",
        name="Tatopani Border Gorge Sector",
        sector="Northern Transboundary Valley Corridor",
        priorityTier=ResponsePriorityTier.PRIORITY_1,
        priorityRank=1,
        score=94,
        prototypeScoreLabel="Prototype response priority score",
        severity=SeverityLevel.CRITICAL,
        populationExposure="DEMO / ILLUSTRATIVE (High scenario density)",
        infrastructureImpact="DEMO / ILLUSTRATIVE (Target border lifeline reference)",
        accessibility="DEMO / ILLUSTRATIVE (Constrained canyon transit corridor)",
        secondaryHazardRisk="DEMO / ILLUSTRATIVE (Steep canyon slope instability model)",
        medicalUrgency="DEMO / ILLUSTRATIVE (Local health post scenario isolation)",
        whyFactors=[
            "High population exposure (Prototype scenario input)",
            "Severe detected damage (Precomputed model delta — synthetic input)",
            "Constrained road accessibility (Prototype scenario parameter)",
            "Critical border infrastructure target nearby"
        ],
        recommendedAction="Recommended: Prioritize field verification and resource assessment.",
        confidence=None,
        confidenceDisplay="CONFIDENCE: Not available",
        verificationStatus="Human verification required",
        routeStatus=RouteStatus(
            isAvailable=False,
            roadPassability="UNAVAILABLE",
            routeDescription="Route analysis unavailable.",
            primaryObstacle="Live road network routing data not currently connected; unverified corridor conditions.",
            alternativeAccessMethod="Human field reconnaissance or aerial assessment recommended."
        ),
        coordinates=(85.9461, 27.9575),
        polygon=[
            (85.9380, 27.9650),
            (85.9540, 27.9650),
            (85.9520, 27.9450),
            (85.9360, 27.9450),
            (85.9380, 27.9650)
        ],
        coordinateProvenance="OpenStreetMap Relation 184633 / NDRRMA Border Corridor Baseline",
        factors={
            "populationExposure": ResponseFactorAssessment(
                key="populationExposure",
                label="Population Exposure",
                level="HIGH",
                normalizedScore=0.92,
                description="Prototype scenario parameter: Elevated civilian and transit exposure modeled in gorge sector.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "damageSeverity": ResponseFactorAssessment(
                key="damageSeverity",
                label="Damage Severity",
                level="CRITICAL",
                normalizedScore=0.95,
                description="Precomputed synthetic model delta indicates major spectral/coherence change across transit artery.",
                statusDisplay="PRECOMPUTED ANALYSIS — SYNTHETIC INPUT",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "criticalInfrastructure": ResponseFactorAssessment(
                key="criticalInfrastructure",
                label="Infrastructure Impact",
                level="CRITICAL",
                normalizedScore=0.96,
                description="Target reference: International freight artery and border customs facilities.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "accessibility": ResponseFactorAssessment(
                key="accessibility",
                label="Accessibility",
                level="CRITICAL",
                normalizedScore=0.98,
                description="Prototype scenario parameter: Road network connectivity constrained in narrow gorge.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "secondaryHazard": ResponseFactorAssessment(
                key="secondaryHazard",
                label="Secondary Hazard",
                level="HIGH",
                normalizedScore=0.88,
                description="Prototype scenario parameter: Steep lateral schist canyon walls subject to secondary slope instability.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "medicalUrgency": ResponseFactorAssessment(
                key="medicalUrgency",
                label="Medical Urgency",
                level="CRITICAL",
                normalizedScore=0.94,
                description="Prototype scenario parameter: Local health post access modeled as constrained.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
        },
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Emergency Priority Engine (Prototype decision-support evaluation)",
            algorithm="Multi-Criteria Response Urgency Normalization",
            isDemoValue=True
        )
    ),
    PriorityZone(
        id="Zone B",
        zoneCode="ZONE-B-LARCHA",
        name="Larcha / Bhairabkunda Khola Confluence Fan",
        sector="Tributary Debris Fan Sector",
        priorityTier=ResponsePriorityTier.PRIORITY_1,
        priorityRank=2,
        score=88,
        prototypeScoreLabel="Prototype response priority score",
        severity=SeverityLevel.CRITICAL,
        populationExposure="DEMO / ILLUSTRATIVE (Moderate scenario density)",
        infrastructureImpact="DEMO / ILLUSTRATIVE (Highway confluence bridge span)",
        accessibility="DEMO / ILLUSTRATIVE (Tributary sediment deposition corridor)",
        secondaryHazardRisk="DEMO / ILLUSTRATIVE (Tributary damming vulnerability model)",
        medicalUrgency="DEMO / ILLUSTRATIVE (Moderate-high scenario triage requirement)",
        whyFactors=[
            "Active tributary debris deposition modeled across transport lifeline",
            "Secondary hazard vulnerability (Prototype scenario input)",
            "Severe detected damage (Precomputed model delta — synthetic input)",
            "Access bottleneck impacting transit to northern sector"
        ],
        recommendedAction="Recommended: Assess accessibility and critical-infrastructure impact.",
        confidence=None,
        confidenceDisplay="CONFIDENCE: Not available",
        verificationStatus="Human verification required",
        routeStatus=RouteStatus(
            isAvailable=False,
            roadPassability="UNAVAILABLE",
            routeDescription="Route analysis unavailable.",
            primaryObstacle="Live road network routing data not currently connected; unverified corridor conditions.",
            alternativeAccessMethod="Human field reconnaissance or aerial assessment recommended."
        ),
        coordinates=(85.9220, 27.9050),
        polygon=[
            (85.9140, 27.9150),
            (85.9300, 27.9150),
            (85.9280, 27.8950),
            (85.9120, 27.8950),
            (85.9140, 27.9150)
        ],
        coordinateProvenance="OpenStreetMap Baseline / ICIMOD Catchment Survey",
        factors={
            "populationExposure": ResponseFactorAssessment(
                key="populationExposure",
                label="Population Exposure",
                level="MEDIUM",
                normalizedScore=0.70,
                description="Prototype scenario parameter: Confluence settlement exposure modeled.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "damageSeverity": ResponseFactorAssessment(
                key="damageSeverity",
                label="Damage Severity",
                level="CRITICAL",
                normalizedScore=0.94,
                description="Precomputed synthetic radar delta model indicates extensive surface debris coverage.",
                statusDisplay="PRECOMPUTED ANALYSIS — SYNTHETIC INPUT",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "criticalInfrastructure": ResponseFactorAssessment(
                key="criticalInfrastructure",
                label="Infrastructure Impact",
                level="HIGH",
                normalizedScore=0.88,
                description="Target reference: Highway bridge span across Bhairabkunda tributary.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "accessibility": ResponseFactorAssessment(
                key="accessibility",
                label="Accessibility",
                level="CRITICAL",
                normalizedScore=0.96,
                description="Prototype scenario parameter: Modeled physical transport obstruction at confluence.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "secondaryHazard": ResponseFactorAssessment(
                key="secondaryHazard",
                label="Secondary Hazard",
                level="CRITICAL",
                normalizedScore=0.95,
                description="Prototype scenario parameter: Debris accumulation prone to tributary pooling.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "medicalUrgency": ResponseFactorAssessment(
                key="medicalUrgency",
                label="Medical Urgency",
                level="HIGH",
                normalizedScore=0.82,
                description="Prototype scenario parameter: Modeled first aid triage requirement for stranded parties.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
        },
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Emergency Priority Engine (Prototype decision-support evaluation)",
            algorithm="Multi-Criteria Response Urgency Normalization",
            isDemoValue=True
        )
    ),
    PriorityZone(
        id="Zone C",
        zoneCode="ZONE-C-CHAKU",
        name="Chaku Khola Hydropower Corridor",
        sector="Hydro Infrastructure & Settlement Sector",
        priorityTier=ResponsePriorityTier.PRIORITY_2,
        priorityRank=3,
        score=72,
        prototypeScoreLabel="Prototype response priority score",
        severity=SeverityLevel.SEVERE,
        populationExposure="DEMO / ILLUSTRATIVE (Moderate scenario density)",
        infrastructureImpact="DEMO / ILLUSTRATIVE (Hydropower generation asset target)",
        accessibility="DEMO / ILLUSTRATIVE (Restricted mountain road corridor model)",
        secondaryHazardRisk="DEMO / ILLUSTRATIVE (Slope destabilization model)",
        medicalUrgency="DEMO / ILLUSTRATIVE (Moderate scenario requirement)",
        whyFactors=[
            "Hydropower generation infrastructure asset target",
            "Moderate population exposure (Prototype scenario input)",
            "Restricted accessibility condition modeled in corridor",
            "Slope destabilization detected in precomputed radar model"
        ],
        recommendedAction="Recommended: Conduct secondary-hazard verification and infrastructure assessment.",
        confidence=None,
        confidenceDisplay="CONFIDENCE: Not available",
        verificationStatus="Prioritize for assessment",
        routeStatus=RouteStatus(
            isAvailable=False,
            roadPassability="UNAVAILABLE",
            routeDescription="Route analysis unavailable.",
            primaryObstacle="Live road network routing data not currently connected; unverified corridor conditions.",
            alternativeAccessMethod="Human field reconnaissance or aerial assessment recommended."
        ),
        coordinates=(85.9130, 27.8820),
        polygon=[
            (85.9050, 27.8920),
            (85.9220, 27.8920),
            (85.9200, 27.8720),
            (85.9030, 27.8720),
            (85.9050, 27.8920)
        ],
        coordinateProvenance="OpenStreetMap Baseline / NEA Transmission Grid Reference",
        factors={
            "populationExposure": ResponseFactorAssessment(
                key="populationExposure",
                label="Population Exposure",
                level="MEDIUM",
                normalizedScore=0.65,
                description="Prototype scenario parameter: Settlement and facility staff exposure modeled.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "damageSeverity": ResponseFactorAssessment(
                key="damageSeverity",
                label="Damage Severity",
                level="HIGH",
                normalizedScore=0.68,
                description="Precomputed synthetic InSAR model indicates localized phase decorrelation.",
                statusDisplay="PRECOMPUTED ANALYSIS — SYNTHETIC INPUT",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "criticalInfrastructure": ResponseFactorAssessment(
                key="criticalInfrastructure",
                label="Infrastructure Impact",
                level="HIGH",
                normalizedScore=0.85,
                description="Target reference: Hydropower facility supplying regional grid.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "accessibility": ResponseFactorAssessment(
                key="accessibility",
                label="Accessibility",
                level="MEDIUM",
                normalizedScore=0.60,
                description="Prototype scenario parameter: Mountain access feeder road constrained.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "secondaryHazard": ResponseFactorAssessment(
                key="secondaryHazard",
                label="Secondary Hazard",
                level="HIGH",
                normalizedScore=0.72,
                description="Prototype scenario parameter: Lateral valley slope instability modeled.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "medicalUrgency": ResponseFactorAssessment(
                key="medicalUrgency",
                label="Medical Urgency",
                level="MEDIUM",
                normalizedScore=0.58,
                description="Prototype scenario parameter: Moderate emergency medical requirement.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
        },
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Emergency Priority Engine (Prototype decision-support evaluation)",
            algorithm="Multi-Criteria Response Urgency Normalization",
            isDemoValue=True
        )
    ),
    PriorityZone(
        id="Zone D",
        zoneCode="ZONE-D-BARHABISE",
        name="Barhabise Municipality & Staging Base",
        sector="Downstream Urban & Logistics Hub Sector",
        priorityTier=ResponsePriorityTier.PRIORITY_3,
        priorityRank=4,
        score=42,
        prototypeScoreLabel="Prototype response priority score",
        severity=SeverityLevel.MODERATE,
        populationExposure="DEMO / ILLUSTRATIVE (High municipal scenario density)",
        infrastructureImpact="DEMO / ILLUSTRATIVE (Regional hospital & administrative hub)",
        accessibility="DEMO / ILLUSTRATIVE (Broad open valley floor corridor model)",
        secondaryHazardRisk="DEMO / ILLUSTRATIVE (Moderate overbank inundation model)",
        medicalUrgency="DEMO / ILLUSTRATIVE (Regional hospital receiving capacity)",
        whyFactors=[
            "Primary administrative and medical facility hub target",
            "High municipal population exposure (Prototype scenario input)",
            "Low detected damage severity in precomputed satellite models",
            "Logistics receiving capacity for upstream relief support"
        ],
        recommendedAction="Recommended: Maintain logistics staging verification and monitor receiving capacity.",
        confidence=None,
        confidenceDisplay="CONFIDENCE: Not available",
        verificationStatus="Prioritize for assessment",
        routeStatus=RouteStatus(
            isAvailable=False,
            roadPassability="UNAVAILABLE",
            routeDescription="Route analysis unavailable.",
            primaryObstacle="Live road network routing data not currently connected; unverified corridor conditions.",
            alternativeAccessMethod="Human field reconnaissance or local municipal coordination recommended."
        ),
        coordinates=(85.8980, 27.7890),
        polygon=[
            (85.8880, 27.8020),
            (85.9080, 27.8020),
            (85.9060, 27.7760),
            (85.8860, 27.7760),
            (85.8880, 27.8020)
        ],
        coordinateProvenance="DHM Station 610 Catalog / NDRRMA Municipality Registry",
        factors={
            "populationExposure": ResponseFactorAssessment(
                key="populationExposure",
                label="Population Exposure",
                level="HIGH",
                normalizedScore=0.55,
                description="Prototype scenario parameter: Municipal bazaar population modeled.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "damageSeverity": ResponseFactorAssessment(
                key="damageSeverity",
                label="Damage Severity",
                level="LOW",
                normalizedScore=0.20,
                description="Precomputed synthetic multi-spectral model indicates baseline stability.",
                statusDisplay="PRECOMPUTED ANALYSIS — SYNTHETIC INPUT",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "criticalInfrastructure": ResponseFactorAssessment(
                key="criticalInfrastructure",
                label="Infrastructure Impact",
                level="HIGH",
                normalizedScore=0.60,
                description="Target reference: Primary municipal hospital and administrative complex.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "accessibility": ResponseFactorAssessment(
                key="accessibility",
                label="Accessibility",
                level="LOW",
                normalizedScore=0.15,
                description="Prototype scenario parameter: Open valley basin floor.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "secondaryHazard": ResponseFactorAssessment(
                key="secondaryHazard",
                label="Secondary Hazard",
                level="MEDIUM",
                normalizedScore=0.45,
                description="Prototype scenario parameter: Moderate overbank inundation potential.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "medicalUrgency": ResponseFactorAssessment(
                key="medicalUrgency",
                label="Medical Urgency",
                level="LOW",
                normalizedScore=0.30,
                description="Prototype scenario parameter: Hospital receiving capacity operational.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
        },
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Emergency Priority Engine (Prototype decision-support evaluation)",
            algorithm="Multi-Criteria Response Urgency Normalization",
            isDemoValue=True
        )
    ),
    PriorityZone(
        id="Zone E",
        zoneCode="ZONE-E-HEADWATERS",
        name="Upper Bhote Koshi Transboundary Headwaters",
        sector="Remote High-Altitude Moraine Sector",
        priorityTier=ResponsePriorityTier.PRIORITY_2,
        priorityRank=5,
        score=68,
        prototypeScoreLabel="Prototype response priority score",
        severity=SeverityLevel.SEVERE,
        populationExposure="DEMO / ILLUSTRATIVE (Sparse alpine seasonal presence)",
        infrastructureImpact="DEMO / ILLUSTRATIVE (High-altitude watershed headwaters)",
        accessibility="DEMO / ILLUSTRATIVE (Remote roadless alpine terrain model)",
        secondaryHazardRisk="DEMO / ILLUSTRATIVE (High-altitude moraine breach model)",
        medicalUrgency="Not available (Remote telemetry offline; renormalized)",
        whyFactors=[
            "High potential energy headwaters source zone (Scenario risk model)",
            "Severe detected damage (Precomputed model delta — synthetic input)",
            "Roadless alpine terrain (Prototype scenario parameter)",
            "Medical urgency telemetry data gap (Weight renormalized)"
        ],
        recommendedAction="Recommended: Conduct secondary-hazard verification and aerial assessment.",
        confidence=None,
        confidenceDisplay="CONFIDENCE: Not available",
        verificationStatus="Prioritize for assessment",
        routeStatus=RouteStatus(
            isAvailable=False,
            roadPassability="UNAVAILABLE",
            routeDescription="Route analysis unavailable.",
            primaryObstacle="High-altitude alpine terrain without vehicular road infrastructure; live telemetry not connected.",
            alternativeAccessMethod="High-altitude aerial assessment or satellite tasking recommended."
        ),
        coordinates=(85.9620, 28.0150),
        polygon=[
            (85.9480, 28.0350),
            (85.9780, 28.0350),
            (85.9750, 27.9950),
            (85.9450, 27.9950),
            (85.9480, 28.0350)
        ],
        coordinateProvenance="ICIMOD Glacial Lake Inventory / Transboundary Hydrological Map",
        factors={
            "populationExposure": ResponseFactorAssessment(
                key="populationExposure",
                label="Population Exposure",
                level="LOW",
                normalizedScore=0.15,
                description="Prototype scenario parameter: Sparse seasonal presence in high alpine zone.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "damageSeverity": ResponseFactorAssessment(
                key="damageSeverity",
                label="Damage Severity",
                level="CRITICAL",
                normalizedScore=0.90,
                description="Precomputed synthetic model delta simulates supra-glacial pond expansion.",
                statusDisplay="PRECOMPUTED ANALYSIS — SYNTHETIC INPUT",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "criticalInfrastructure": ResponseFactorAssessment(
                key="criticalInfrastructure",
                label="Infrastructure Impact",
                level="MEDIUM",
                normalizedScore=0.50,
                description="Target reference: Headwaters watershed controlling downstream corridor viability.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "accessibility": ResponseFactorAssessment(
                key="accessibility",
                label="Accessibility",
                level="CRITICAL",
                normalizedScore=0.98,
                description="Prototype scenario parameter: Roadless high alpine terrain.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "secondaryHazard": ResponseFactorAssessment(
                key="secondaryHazard",
                label="Secondary Hazard",
                level="CRITICAL",
                normalizedScore=0.96,
                description="Prototype scenario parameter: Moraine dam breach susceptibility model.",
                statusDisplay="DEMO / ILLUSTRATIVE",
                provenanceTier="DEMO_VALUE",
                isAvailable=True
            ),
            "medicalUrgency": ResponseFactorAssessment(
                key="medicalUrgency",
                label="Medical Urgency",
                level="DATA_UNAVAILABLE",
                normalizedScore=None,
                description="Medical urgency telemetry offline; factor weight dynamically renormalized.",
                statusDisplay="Not available",
                provenanceTier="DEMO_VALUE",
                isAvailable=False,
                missingReason="Remote telemetry link offline; factor excluded and normalized over active metrics."
            ),
        },
        provenance=ProvenanceMeta(
            tier=DataTier.DEMO_VALUE,
            source="HIMALAYA-SHIELD Emergency Priority Engine (Prototype decision-support evaluation)",
            algorithm="Multi-Criteria Response Urgency Normalization",
            isDemoValue=True
        )
    )
]

DEMO_STAGED_UNITS = [
    StagedReliefUnit(
        id="UNIT-01",
        name="Nepal Army Disaster Management Directorate (Illustrative template)",
        agency="Nepal Army",
        role="Heavy Engineering & River Clearance",
        callsign="NA-ENG-101",
        baseLocation="Barhabise Staging Base (Illustrative template)",
        status="STAGED_READY",
        statusLabel="DEMO / ILLUSTRATIVE TEMPLATE",
        assignedZoneId="Zone B",
        contactFrequency="VHF Net 1 (Illustrative template)"
    ),
    StagedReliefUnit(
        id="UNIT-02",
        name="Armed Police Force (APF) Disaster Response Unit (Illustrative template)",
        agency="Armed Police Force Nepal",
        role="Swift Water Rescue & High-Line Evacuation",
        callsign="APF-RESCUE-4",
        baseLocation="Barhabise Staging Base (Illustrative template)",
        status="STAGED_READY",
        statusLabel="DEMO / ILLUSTRATIVE TEMPLATE",
        assignedZoneId="Zone A",
        contactFrequency="Tactical VHF (Illustrative template)"
    ),
    StagedReliefUnit(
        id="UNIT-03",
        name="Nepal Red Cross Society (NRCS) Emergency Team (Illustrative template)",
        agency="Nepal Red Cross Society",
        role="Emergency Shelter & Medical First Aid Relief",
        callsign="NRCS-RELIEF-A",
        baseLocation="Barhabise Hospital Complex (Illustrative template)",
        status="STAGED_READY",
        statusLabel="DEMO / ILLUSTRATIVE TEMPLATE",
        assignedZoneId="Zone D",
        contactFrequency="HF Net (Illustrative template)"
    )
]
