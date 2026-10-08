import React, { useState } from 'react';
import type { 
  NavigationTab, 
  IncidentInfo, 
  SystemStatus, 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent 
} from '../../types';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DemoWorkflowBar } from './DemoWorkflowBar';
import { DashboardView } from '../../features/dashboard/DashboardView';
import { SatelliteView } from '../../features/satellite/SatelliteView';
import { DamageView } from '../../features/damage/DamageView';
import { RiskView } from '../../features/risk/RiskView';
import { ResponseView } from '../../features/response/ResponseView';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMapFocused, setIsMapFocused] = useState(false);

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
    lastTelemetrySync: '2026-08-27T06:14:22Z',
    activeCrs: 'EPSG:32645 (UTM 45N)',
    networkLatencyMs: 14,
    activePassOrbit: 'Sentinel-2B Rel Orbit 119 (Prototype Ingestion)',
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
        source: 'HRSL / WorldPop Prototype Baseline',
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

  // Map Layers
  const [layers, setLayers] = useState<MapLayerConfig[]>([
    {
      id: 'satellite',
      label: 'Satellite Basemap (DEMO)',
      category: 'IMAGERY',
      enabled: true,
      opacity: 0.85,
      badge: 'DEMO_VALUE',
      description: 'Visual prototype satellite basemap layer. Real Sentinel-2 analysis connected in Step 5.',
      availableInMvp: true,
    },
    {
      id: 'flood',
      label: 'Flood Inundation Extent (DEMO)',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.85,
      badge: 'DEMO_VALUE',
      description: 'Prototype flood boundary mask. Real change detection connected in Step 5.',
      availableInMvp: true,
    },
    {
      id: 'landslide',
      label: 'Debris Flow & Scarp Zones (DEMO)',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.8,
      badge: 'DEMO_VALUE',
      description: 'Prototype steep-slope debris polygons. Real slope analysis connected in Step 5.',
      availableInMvp: true,
    },
    {
      id: 'damage',
      label: 'Damage Severity Sectors (DEMO)',
      category: 'HAZARD',
      enabled: false,
      opacity: 0.75,
      badge: 'DEMO_VALUE',
      description: 'Prototype damage zoning polygons. Real MCDA risk connected in Step 6.',
      availableInMvp: true,
    },
    {
      id: 'buildings',
      label: 'Building Footprints (DEMO)',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'DEMO_VALUE',
      description: 'Prototype settlement cluster polygons. Real OSM baseline connected in Step 4.',
      availableInMvp: true,
    },
    {
      id: 'roads',
      label: 'Roads & Lifelines (DEMO)',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'DEMO_VALUE',
      description: 'Prototype highway corridor linestring. Real OSM vector connected in Step 4.',
      availableInMvp: true,
    },
    {
      id: 'hospitals',
      label: 'Health Points (DEMO)',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 1.0,
      badge: 'DEMO_VALUE',
      description: 'Prototype emergency facility markers. Real health dataset connected in Step 4.',
      availableInMvp: true,
    },
    {
      id: 'population',
      label: 'Population Density (DEMO)',
      category: 'DEMOGRAPHICS',
      enabled: false,
      opacity: 0.6,
      badge: 'DEMO_VALUE',
      description: 'Prototype density cell grid. Real demographic dataset connected in Step 4.',
      availableInMvp: true,
    },
  ]);

  // Priority Actions (DEMO - strictly human-in-the-loop decision support)
  const [priorityItems, setPriorityItems] = useState<PriorityActionItem[]>([
    {
      id: 'ACT-001',
      rank: 1,
      zone: 'Tatopani Sector (DEMO)',
      title: 'Prioritize for assessment: Tatopani Commercial Sector Evacuation Corridor',
      category: 'EVACUATION',
      severity: 'CRITICAL',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'APF Disaster Unit 4',
      lastUpdated: '2026-08-27T06:05:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Multi-Criteria Risk Scoring v1.0',
      },
    },
    {
      id: 'ACT-002',
      rank: 2,
      zone: 'Larcha Sector (DEMO)',
      title: 'Recommended: Heavy Engineering Clearance at Severed Tributary Bridge',
      category: 'ROUTE_CLEARANCE',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'Nepal Army Heavy Eng 101',
      lastUpdated: '2026-08-27T06:00:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Lifeline Severance Model',
      },
    },
    {
      id: 'ACT-003',
      rank: 3,
      zone: 'Barhabise Sector (DEMO)',
      title: 'Recommended: Pre-position Medical First-Aid Triage Staging Area',
      category: 'MEDICAL_AIRLIFT',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      assignedUnit: 'Nepal Red Cross Emergency Team A',
      lastUpdated: '2026-08-27T05:50:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Facility Buffer Distance Model',
      },
    },
  ]);

  // Composite Risk Metric for the Active Zone (DEMO)
  const riskMetric: RiskZoneMetric = {
    id: 'RISK-ZONE-TATOPANI',
    zoneName: 'Tatopani Corridor (DEMO Reference)',
    coordinates: 'Map initial viewport — DEMO / navigation reference',
    compositeScore: 92,
    severity: 'CRITICAL',
    floodInundationArea: '4.82 km²',
    debrisVolumeIndex: 'HIGH (Steep Gorge)',
    exposedStructures: '184 Evaluated Assets',
    severedLifelines: '14.2 km Highway Blocked',
    isolationRiskScore: 89,
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'MCDA Risk Formula (DEMO / ILLUSTRATIVE)',
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
      detail: 'Sentinel-1 SAR C-Band radar change detection processed. Inundated footprint updated (Precomputed).',
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
    {
      id: 'LOG-003',
      timestamp: '06:05:00',
      type: 'HUMAN_OVERRIDE',
      title: 'Queue Directive Submission',
      detail: 'Tatopani Gorge Commercial Precinct directive submitted to human review queue.',
      source: 'Emergency Response Service',
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

  const handleToggleFocusMap = () => {
    setIsMapFocused((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-command-bg text-command-text flex flex-col font-sans">
      {/* Top Header Strip */}
      <TopBar 
        incident={incident} 
        systemStatus={systemStatus}
        isMapFocused={isMapFocused}
        onToggleFocusMap={handleToggleFocusMap}
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
        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 bg-command-bg/95 transition-all">
          <div className="max-w-[1720px] mx-auto">
            {/* 3-Minute Live Workflow Strip */}
            <DemoWorkflowBar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
            />

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

      {/* Compact Telemetry & Attribution Footer */}
      <footer className="h-6 bg-command-panel border-t border-command-border px-4 flex items-center justify-between text-[10px] font-mono text-command-dim z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>GEO-ENGINE: MAPLIBRE GL</span>
          </div>
          <span>|</span>
          <span>CRS: <strong className="text-command-text">EPSG:32645 (UTM 45N)</strong></span>
          <span>|</span>
          <span className="hidden sm:inline">AOI: <strong className="text-command-text">BHOTE KOSHI CORRIDOR</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline">PROVENANCE: <strong className="text-amber-400">PRECOMPUTED ANALYSIS</strong></span>
          <span>|</span>
          <span className="text-command-muted">HIMALAYA-SHIELD EOC</span>
        </div>
      </footer>
    </div>
  );
};
