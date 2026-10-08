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
import { DashboardView } from '../../features/dashboard/DashboardView';
import { SatelliteView } from '../../features/satellite/SatelliteView';
import { DamageView } from '../../features/damage/DamageView';
import { RiskView } from '../../features/risk/RiskView';
import { ResponseView } from '../../features/response/ResponseView';

export const AppShell: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed] = useState(false);

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
    centerCoordinates: [27.9520, 85.9410], // Map initial viewport — DEMO / navigation reference
    boundingCoordinates: 'Map initial viewport — DEMO / navigation reference',
    leadAgencies: ['NDRRMA', 'DHM Nepal', 'ICIMOD', 'Nepal Army', 'APF'],
  };

  // System Telemetry
  const systemStatus: SystemStatus = {
    serviceStatus: 'OPERATIONAL',
    lastTelemetrySync: '2026-08-27T06:14:22Z',
    activeCrs: 'EPSG:32645 (UTM 45N)',
    networkLatencyMs: 14,
    activePassOrbit: 'Sentinel-2B Rel Orbit 119 (Awaiting Step 5 Ingestion)',
    eocReadiness: 'COMMAND TIER 1',
  };

  // KPI Metrics (With Strict Provenance & Explicit Statuses)
  const [kpis] = useState<KPICardData[]>([
    {
      id: 'kpi-inundated-area',
      label: 'ESTIMATED INUNDATED CORRIDOR',
      value: '—',
      unit: 'km²',
      statusLabel: 'Awaiting Step 5 satellite pass',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Awaiting Step 5 Satellite Ingest',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-exposed-pop',
      label: 'EXPOSED SETTLEMENT POPULATION',
      value: '—',
      unit: 'persons',
      statusLabel: 'Awaiting Step 4 dataset link',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Awaiting Step 4 Baseline Data',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-road-severance',
      label: 'ARANIKO HIGHWAY DISRUPTIONS',
      value: '—',
      unit: 'km blocked',
      statusLabel: 'Awaiting Step 4 vector join',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Awaiting Step 4 Baseline Data',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-critical-facilities',
      label: 'HEALTH POSTS IN HAZARD BUFFER',
      value: '—',
      unit: 'facilities',
      statusLabel: 'Awaiting Step 4 buffer query',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Awaiting Step 4 Baseline Data',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
  ]);

  // Map Layers (8 Required Layers with Explicit Tiers)
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

  // Priority Actions (DEMO)
  const [priorityItems, setPriorityItems] = useState<PriorityActionItem[]>([
    {
      id: 'ACT-001',
      rank: 1,
      zone: 'Tatopani Sector (DEMO)',
      title: 'Emergency Evacuation: Tatopani Gorge Commercial Precinct (DEMO)',
      category: 'EVACUATION',
      severity: 'CRITICAL',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.88,
      assignedUnit: 'APF Disaster Unit 4',
      lastUpdated: '2026-08-27T06:05:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Multi-Criteria Risk Scoring v1.0',
        confidence: 0.88,
      },
    },
    {
      id: 'ACT-002',
      rank: 2,
      zone: 'Larcha Sector (DEMO)',
      title: 'Heavy Engineering Clearance: Severed Tributary Bridge (DEMO)',
      category: 'ROUTE_CLEARANCE',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.84,
      assignedUnit: 'Nepal Army Heavy Eng 101',
      lastUpdated: '2026-08-27T06:00:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Lifeline Severance Model',
        confidence: 0.84,
      },
    },
    {
      id: 'ACT-003',
      rank: 3,
      zone: 'Barhabise Sector (DEMO)',
      title: 'Pre-position Medical First-Aid Triage Staging Area (DEMO)',
      category: 'MEDICAL_AIRLIFT',
      severity: 'HIGH',
      affectedPopulationEstimate: 'DEMO value',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.79,
      assignedUnit: 'Nepal Red Cross Emergency Team A',
      lastUpdated: '2026-08-27T05:50:00Z',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Priority Engine Prototype (DEMO / ILLUSTRATIVE)',
        timestamp: '2026-08-27T00:00:00Z',
        algorithm: 'Facility Buffer Distance Model',
        confidence: 0.79,
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
    floodInundationArea: 'Awaiting Step 5 pass',
    debrisVolumeIndex: 'Prototype slope estimate',
    exposedStructures: 'Awaiting Step 4 join',
    severedLifelines: 'Araniko Hwy prototype segment',
    isolationRiskScore: 95,
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'MCDA Prototype Matrix (DEMO / ILLUSTRATIVE)',
      timestamp: '2026-08-27T00:00:00Z',
      algorithm: 'AHP Multi-Criteria Risk Scoring',
      confidence: 0.86,
    },
  };

  // Activity Log (DEMO)
  const activityLogs: ActivityEvent[] = [
    {
      id: 'EVT-101',
      timestamp: '06:14:22 NPT',
      type: 'SYSTEM_EVENT',
      title: 'MapLibre GL Geospatial Canvas Initialized',
      detail: 'Nepal transboundary viewport loaded with 8 prototype demonstration layers.',
      source: 'HIMALAYA-SHIELD Map Engine',
      tier: 'DEMO_VALUE',
    },
    {
      id: 'EVT-102',
      timestamp: '06:10:05 NPT',
      type: 'AI_INFERENCE',
      title: 'Change Detection Pipeline Framework Ready',
      detail: 'Awaiting Step 5 Sentinel-2 pre/post disaster multi-spectral raster inputs.',
      source: 'HIMALAYA-SHIELD Change Engine',
      tier: 'DEMO_VALUE',
    },
    {
      id: 'EVT-103',
      timestamp: '06:05:00 NPT',
      type: 'SYSTEM_EVENT',
      title: 'Navigation Reference Points Configured',
      detail: 'Initial center coordinates set for Bhote Koshi Himalayan corridor.',
      source: 'HIMALAYA-SHIELD Core',
      tier: 'DEMO_VALUE',
    },
  ];

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
      {/* Top Telemetry & Incident Header */}
      <TopBar incident={incident} systemStatus={systemStatus} />

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Operational Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Main Content Workspace (Each view rendered exactly once) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-command-bg/95">
          <div className="max-w-7xl mx-auto">
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
              />
            )}

            {currentTab === 'satellite' && (
              <SatelliteView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
              />
            )}

            {currentTab === 'damage' && (
              <DamageView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
              />
            )}

            {currentTab === 'risk' && (
              <RiskView
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
              />
            )}

            {currentTab === 'response' && (
              <ResponseView
                priorityItems={priorityItems}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onOpacityChange={handleOpacityChange}
                onApproveAction={handleApproveAction}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Telemetry & Attribution Status Bar (Exactly ONE GEO-ENGINE status message) */}
      <footer className="h-7 bg-command-panel border-t border-command-border px-4 flex items-center justify-between text-[10px] font-mono text-command-dim z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>GEO-ENGINE: MAPLIBRE GL ACTIVE</span>
          </div>
          <span>|</span>
          <span>CRS: <strong className="text-command-text">WGS 84 / UTM Zone 45N (EPSG:32645)</strong></span>
          <span>|</span>
          <span>INITIAL VIEWPORT: <strong className="text-command-text">Bhote Koshi Corridor (DEMO Ref)</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <span>DATA PROVENANCE: <strong className="text-amber-400">STEP 3 PROTOTYPE LAYERS</strong></span>
          <span>|</span>
          <span className="text-command-muted">HIMALAYA-SHIELD DISASTER INTELLIGENCE PLATFORM</span>
        </div>
      </footer>
    </div>
  );
};
