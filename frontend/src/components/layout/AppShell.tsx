import React, { useState, useEffect } from 'react';
import type { 
  NavigationTab, 
  IncidentInfo, 
  SystemStatus, 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent,
  LanguageMode,
  LiveEarthquakeEvent,
  LiveWeatherStation
} from '../../types';
import type { SearchableLocation } from '../../data/searchLocations';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DemoWorkflowBar } from './DemoWorkflowBar';
import { HowItWorksModal } from '../tactical/HowItWorksModal';
import { DashboardView } from '../../features/dashboard/DashboardView';
import { SatelliteView } from '../../features/satellite/SatelliteView';
import { DamageView } from '../../features/damage/DamageView';
import { RiskView } from '../../features/risk/RiskView';
import { ResponseView } from '../../features/response/ResponseView';
import { fetchLiveEarthquakes, fetchLiveWeather } from '../../services/api/liveApi';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMapFocused, setIsMapFocused] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SearchableLocation | null>(null);
  const [language, setLanguage] = useState<LanguageMode>('en');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Real-time live feeds state
  const [liveEarthquakes, setLiveEarthquakes] = useState<LiveEarthquakeEvent[]>([]);
  const [liveWeatherStations, setLiveWeatherStations] = useState<LiveWeatherStation[]>([]);

  // Fetch real-time feeds on mount & poll every 3 minutes
  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const eqData = await fetchLiveEarthquakes(2.0);
        if (eqData.events) {
          setLiveEarthquakes(eqData.events);
        }
      } catch (e) {
        console.warn('Failed to load live earthquakes:', e);
      }

      try {
        const wxData = await fetchLiveWeather();
        if (wxData.stations) {
          setLiveWeatherStations(wxData.stations);
        }
      } catch (e) {
        console.warn('Failed to load live weather:', e);
      }
    };

    loadFeeds();
    const interval = setInterval(loadFeeds, 180000);
    return () => clearInterval(interval);
  }, []);

  // Active Incident Information (Nepal-China Border 2026 Demonstration Case)
  const incident: IncidentInfo = {
    id: 'INC-2026-08-26-NP-CN',
    code: 'GLOF-FLASH-0826',
    title: 'Bhote Koshi / Tatopani Transboundary Debris & Flood Incident (DEMO CASE)',
    region: 'Map initial viewport — DEMO / navigation reference',
    country: 'Nepal–China Transboundary Corridor',
    disasterType: 'Glacial Lake Outburst Surge & Landslide Dam Breach Scenario',
    declaredDate: '2026-08-26 18:30 NPT',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    centerCoordinates: [27.9520, 85.9410],
    boundingCoordinates: 'Map initial viewport — DEMO / navigation reference',
    leadAgencies: ['NDRRMA', 'DHM Nepal', 'ICIMOD', 'Nepal Army', 'APF'],
  };

  // System Telemetry
  const systemStatus: SystemStatus = {
    serviceStatus: 'OPERATIONAL',
    lastTelemetrySync: '2026-10-09T09:30:00Z',
    activeCrs: 'EPSG:4326 (WGS 84) / EPSG:32645 (UTM 45N)',
    networkLatencyMs: 12,
    activePassOrbit: 'Sentinel-2B Rel Orbit 119 (Verified Pipeline)',
    eocReadiness: 'COMMAND TIER 1',
  };

  // KPI Metrics
  const [kpis] = useState<KPICardData[]>([
    {
      id: 'kpi-inundated-area',
      label: 'ESTIMATED INUNDATED CORRIDOR',
      value: '4.82',
      unit: 'km²',
      statusLabel: 'Precomputed change model',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Precomputed Sentinel-1/2 Differential Mask',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-exposed-pop',
      label: 'EXPOSED SETTLEMENT POPULATION',
      value: '3,850',
      unit: 'persons',
      statusLabel: 'Synthetic Demographic Overlay',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'HRSL / WorldPop Baseline',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-road-severance',
      label: 'ARANIKO HIGHWAY DISRUPTIONS',
      value: '14.2',
      unit: 'km blocked',
      statusLabel: 'OSM Vector Intersect (Precomputed)',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'OpenStreetMap Road Network join',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-critical-facilities',
      label: 'HEALTH POSTS IN HAZARD BUFFER',
      value: '4',
      unit: 'facilities',
      statusLabel: 'Geospatial Buffer Analysis',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'MoHP Nepal Facility Baseline',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
  ]);

  // Verified & Live Map Layers
  const [layers, setLayers] = useState<MapLayerConfig[]>([
    {
      id: 'provinces',
      label: '7 Provinces of Nepal',
      category: 'BOUNDARIES',
      enabled: true,
      opacity: 0.85,
      badge: 'VERIFIED_GEODATASET',
      description: 'Official Survey Department / geoBoundaries ADM1 verified boundaries.',
      availableInMvp: true,
    },
    {
      id: 'districts',
      label: '77 District Boundaries',
      category: 'BOUNDARIES',
      enabled: true,
      opacity: 0.7,
      badge: 'VERIFIED_GEODATASET',
      description: 'Official Nepal 77 districts ADM2 boundaries.',
      availableInMvp: true,
    },
    {
      id: 'earthquakes',
      label: 'Live Earthquakes (USGS)',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.9,
      badge: 'LIVE_OBSERVED',
      description: 'Real-time seismic feed from USGS Hazards Program within Nepal.',
      availableInMvp: true,
    },
    {
      id: 'weather',
      label: 'Live Weather & Rain Stations',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.9,
      badge: 'LIVE_OBSERVED',
      description: 'Live precipitation & meteorological readings across provincial stations.',
      availableInMvp: true,
    },
    {
      id: 'flood',
      label: 'Flood Inundation Extent',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.85,
      badge: 'DEMO_VALUE',
      description: 'Bhote Koshi transboundary flood extent model (2026 case study).',
      availableInMvp: true,
    },
    {
      id: 'landslide',
      label: 'Debris Flow & Scarp Zones',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.8,
      badge: 'DEMO_VALUE',
      description: 'High-slope landslide and debris surge polygons.',
      availableInMvp: true,
    },
    {
      id: 'damage',
      label: 'Damage Severity Sectors',
      category: 'HAZARD',
      enabled: false,
      opacity: 0.75,
      badge: 'DEMO_VALUE',
      description: 'Multi-criteria damage zoning polygons.',
      availableInMvp: true,
    },
    {
      id: 'buildings',
      label: 'Building Footprints',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'VERIFIED_GEODATASET',
      description: 'OpenStreetMap settlement structures baseline.',
      availableInMvp: true,
    },
    {
      id: 'roads',
      label: 'Roads & Lifelines',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'VERIFIED_GEODATASET',
      description: 'Araniko Highway corridor & mountain feeder roads.',
      availableInMvp: true,
    },
    {
      id: 'hospitals',
      label: 'Hospitals & Health Posts',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 1.0,
      badge: 'VERIFIED_GEODATASET',
      description: 'Verified emergency health post locations in Nepal.',
      availableInMvp: true,
    },
    {
      id: 'caseStudy',
      label: '26 Aug 2026 Case Study Waypoints',
      category: 'HAZARD',
      enabled: true,
      opacity: 1.0,
      badge: 'DEMO_VALUE',
      description: 'Verified disaster case study waypoints along Tatopani gorge.',
      availableInMvp: true,
    },
  ]);

  // Priority Actions
  const [priorityItems, setPriorityItems] = useState<PriorityActionItem[]>([
    {
      id: 'ACT-001',
      rank: 1,
      zone: 'Tatopani Sector',
      title: 'Prioritize for assessment: Tatopani Commercial Sector Evacuation Corridor',
      category: 'EVACUATION',
      severity: 'CRITICAL',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'APF Disaster Unit 4',
      lastUpdated: '2026-08-27T06:05:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (Case Study)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Multi-Criteria Risk Scoring v1.0',
      },
    },
    {
      id: 'ACT-002',
      rank: 2,
      zone: 'Larcha Sector',
      title: 'Recommended: Heavy Engineering Clearance at Severed Tributary Bridge',
      category: 'ROUTE_CLEARANCE',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'Nepal Army Heavy Eng 101',
      lastUpdated: '2026-08-27T06:00:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (Case Study)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Lifeline Severance Model',
      },
    },
    {
      id: 'ACT-003',
      rank: 3,
      zone: 'Barhabise Sector',
      title: 'Recommended: Pre-position Medical First-Aid Triage Staging Area',
      category: 'MEDICAL_AIRLIFT',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'Nepal Red Cross Emergency Team A',
      lastUpdated: '2026-08-27T05:50:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (Case Study)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Facility Buffer Distance Model',
      },
    },
  ]);

  // Composite Risk Metric for the Active Zone
  const riskMetric: RiskZoneMetric = {
    id: 'RISK-ZONE-TATOPANI',
    zoneName: 'Tatopani Corridor (Bhote Koshi)',
    coordinates: '27.9520°N, 85.9410°E',
    compositeScore: 92,
    severity: 'CRITICAL',
    floodInundationArea: '4.82 km²',
    debrisVolumeIndex: 'HIGH (Steep Gorge)',
    exposedStructures: '184 Evaluated Assets',
    severedLifelines: '14.2 km Highway Blocked',
    isolationRiskScore: 89,
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'MCDA Risk Formula (Case Study Model)',
      timestamp: '2026-08-27T00:00:00Z',
      algorithm: 'Weighted Factor Synthesis',
    },
  };

  // Activity Logs
  const [activityLogs] = useState<ActivityEvent[]>([
    {
      id: 'LOG-001',
      timestamp: '06:14:22',
      type: 'SATELLITE_PASS',
      title: 'Sentinel-1 Ingest',
      detail: 'Sentinel-1 SAR C-Band radar change detection processed. Inundated footprint updated.',
      source: 'Satellite Analysis Pipeline',
      tier: 'DEMO_VALUE',
    },
    {
      id: 'LOG-002',
      timestamp: '06:10:05',
      type: 'SYSTEM_EVENT',
      title: 'Damage Catalog Update',
      detail: 'Miteri Bridge (Feature 184) marked approach scour in damage catalog.',
      source: 'Damage Assessment Module',
      tier: 'DEMO_VALUE',
    },
  ]);

  const handleToggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  };

  const handleApproveAction = (actionId: string) => {
    setPriorityItems((prev) =>
      prev.map((item) =>
        item.id === actionId
          ? { ...item, status: 'APPROVED_FOR_DISPATCH', lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-command-bg text-command-text flex flex-col font-sans">
      {/* Top Header Strip */}
      <TopBar 
        incident={incident} 
        systemStatus={systemStatus}
        isMapFocused={isMapFocused}
        onToggleFocusMap={() => setIsMapFocused((prev) => !prev)}
        isExpertMode={isExpertMode}
        onToggleExpertMode={() => setIsExpertMode((prev) => !prev)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'np' : 'en'))}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode((d) => !d)}
      />

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Operational Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isMapFocused}
        />

        {/* Dynamic Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-3.5 bg-command-bg/95 transition-all">
          <div className="max-w-[1850px] mx-auto space-y-2.5">
            {/* Optional Demo Workflow Bar — only visible when Demo Mode is explicitly enabled */}
            {isDemoMode && (
              <DemoWorkflowBar
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardView
                incident={incident}
                kpis={kpis}
                layers={layers}
                priorityItems={priorityItems}
                riskMetric={riskMetric}
                activityLogs={activityLogs}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                onApproveAction={handleApproveAction}
                isMapFocused={isMapFocused}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onNavigateTab={setCurrentTab}
                isExpertMode={isExpertMode}
                language={language}
                liveEarthquakes={liveEarthquakes}
                liveWeatherStations={liveWeatherStations}
              />
            )}

            {currentTab === 'satellite' && (
              <SatelliteView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                isMapFocused={isMapFocused}
              />
            )}

            {currentTab === 'damage' && (
              <DamageView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                isMapFocused={isMapFocused}
              />
            )}

            {currentTab === 'risk' && (
              <RiskView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                isMapFocused={isMapFocused}
              />
            )}

            {currentTab === 'response' && (
              <ResponseView
                priorityItems={priorityItems}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                onApproveAction={handleApproveAction}
                isMapFocused={isMapFocused}
              />
            )}
          </div>
        </main>
      </div>

      {/* 5-Step How Does This Work Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsHowItWorksOpen(false);
        }}
      />

      {/* Compact Telemetry & Attribution Footer */}
      <footer className="h-6 bg-command-panel border-t border-command-border px-4 flex items-center justify-between text-[10px] font-mono text-command-dim z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>GEO-ENGINE: MAPLIBRE GL</span>
          </div>
          <span>|</span>
          <span>CRS: <strong className="text-command-text">EPSG:4326 (WGS 84)</strong></span>
          <span>|</span>
          <span className="hidden sm:inline">PROVENANCE: <strong className="text-sky-400">geoBoundaries / USGS / Open-Meteo</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">{liveEarthquakes.length} SEISMIC EVENTS • {liveWeatherStations.length} WX STATIONS</span>
          <span>|</span>
          <span className="text-command-muted">HIMALAYA-SHIELD EOC</span>
        </div>
      </footer>
    </div>
  );
};
