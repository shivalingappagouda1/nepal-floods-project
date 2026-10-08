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

  // Active Incident Information (Nepal-China Border 2026 Disaster)
  const incident: IncidentInfo = {
    id: 'INC-2026-08-26-NP-CN',
    code: 'GLOF-FLASH-0826',
    title: 'Bhote Koshi / Tatopani Transboundary Debris & Flood Disaster',
    region: 'Sindhupalchok / Tibet Border Corridor',
    country: 'Nepal–China Transboundary Zone',
    disasterType: 'Glacial Lake Outburst Surge & Landslide Dam Breach',
    declaredDate: '2026-08-26 18:30 NPT',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    centerCoordinates: [27.9520, 85.9410],
    boundingCoordinates: '27.75°N–28.15°N, 85.80°E–86.05°E',
    leadAgencies: ['NDRRMA', 'DHM Nepal', 'ICIMOD', 'Nepal Army', 'APF'],
  };

  // System Telemetry
  const systemStatus: SystemStatus = {
    serviceStatus: 'OPERATIONAL',
    lastTelemetrySync: '2026-08-27T06:14:22Z',
    activeCrs: 'EPSG:32645 (UTM 45N)',
    networkLatencyMs: 14,
    activePassOrbit: 'Sentinel-2B Rel Orbit 119',
    eocReadiness: 'COMMAND TIER 1',
  };

  // KPI Metrics (With Strict Provenance & Explicit Statuses)
  const [kpis] = useState<KPICardData[]>([
    {
      id: 'kpi-inundated-area',
      label: 'ESTIMATED INUNDATED CORRIDOR',
      value: '—',
      unit: 'km²',
      statusLabel: 'Awaiting raster pipeline',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Sentinel-2 L2A differential MNDWI',
        timestamp: '2026-08-27T04:48:00Z',
        algorithm: 'ΔMNDWI Threshold (θ=0.35)',
      },
    },
    {
      id: 'kpi-exposed-pop',
      label: 'EXPOSED SETTLEMENT POPULATION',
      value: '—',
      unit: 'persons',
      statusLabel: 'Awaiting spatial join',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'HDX Nepal Population Density Grid 2026',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-road-severance',
      label: 'ARANIKO HIGHWAY DISRUPTIONS',
      value: '—',
      unit: 'km blocked',
      statusLabel: 'Awaiting vector intersection',
      trend: 'stable',
      severity: 'CRITICAL',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'OSM Nepal Primary Highway Vector',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
    {
      id: 'kpi-critical-facilities',
      label: 'HEALTH POSTS IN HAZARD BUFFER',
      value: '—',
      unit: 'facilities',
      statusLabel: 'Awaiting 500m buffer query',
      trend: 'stable',
      severity: 'HIGH',
      provenance: {
        tier: 'AWAITING_PASS',
        source: 'Nepal Ministry of Health / HDX Baseline',
        timestamp: '2026-08-27T00:00:00Z',
      },
    },
  ]);

  // Map Layers (8 Required Layers with Explicit Tiers)
  const [layers, setLayers] = useState<MapLayerConfig[]>([
    {
      id: 'satellite',
      label: 'Sentinel-2 RGB / False Color',
      category: 'IMAGERY',
      enabled: true,
      opacity: 1.0,
      badge: 'VERIFIED',
      description: 'Copernicus Sentinel-2 MSI 10m true & false color optical imagery.',
      availableInMvp: true,
    },
    {
      id: 'flood',
      label: 'Flood Inundation Extent',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.85,
      badge: 'AI_COMPUTED',
      description: 'Differential MNDWI flood surface water mask polygonized from raster.',
      availableInMvp: true,
    },
    {
      id: 'landslide',
      label: 'Debris Flow & Scarp Zones',
      category: 'HAZARD',
      enabled: true,
      opacity: 0.8,
      badge: 'AI_COMPUTED',
      description: 'Differential NDVI scarp detection and steep-slope debris trajectories.',
      availableInMvp: true,
    },
    {
      id: 'damage',
      label: 'Damage Severity Heatmap',
      category: 'HAZARD',
      enabled: false,
      opacity: 0.75,
      badge: 'AI_COMPUTED',
      description: 'Kernel density and multi-criteria disaster severity raster surface.',
      availableInMvp: true,
    },
    {
      id: 'buildings',
      label: 'Building Footprints (OSM)',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'VERIFIED',
      description: 'OpenStreetMap verified residential, commercial, and administrative structures.',
      availableInMvp: true,
    },
    {
      id: 'roads',
      label: 'Roads & Lifeline Bridges',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 0.9,
      badge: 'VERIFIED',
      description: 'Araniko Highway (National Highway 03) and connecting arterial roads.',
      availableInMvp: true,
    },
    {
      id: 'hospitals',
      label: 'Hospitals & Health Posts',
      category: 'INFRASTRUCTURE',
      enabled: true,
      opacity: 1.0,
      badge: 'VERIFIED',
      description: 'Hospitals, primary health centers, and emergency first-aid stations.',
      availableInMvp: true,
    },
    {
      id: 'population',
      label: 'Population Density Grid',
      category: 'DEMOGRAPHICS',
      enabled: false,
      opacity: 0.6,
      badge: 'DEMO_VALUE',
      description: 'Humanitarian Data Exchange (HDX) 100m population density baseline.',
      availableInMvp: true,
    },
  ]);

  // Priority Actions
  const [priorityItems, setPriorityItems] = useState<PriorityActionItem[]>([
    {
      id: 'ACT-001',
      rank: 1,
      zone: 'Tatopani Border Checkpoint (Zone A)',
      title: 'Emergency Evacuation: Tatopani Gorge Commercial Precinct',
      category: 'EVACUATION',
      severity: 'CRITICAL',
      affectedPopulationEstimate: 'Demo estimate pending pass',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.88,
      assignedUnit: 'APF Disaster Unit 4',
      lastUpdated: '2026-08-27T06:05:00Z',
      provenance: {
        tier: 'AI_COMPUTED',
        source: 'HIMALAYA-SHIELD Priority Engine',
        timestamp: '2026-08-27T06:00:00Z',
        algorithm: 'Multi-Criteria Risk Scoring v1.0',
        confidence: 0.88,
      },
    },
    {
      id: 'ACT-002',
      rank: 2,
      zone: 'Larcha / Bhairabkunda Bridge (Zone B)',
      title: 'Heavy Engineering Clearance: Severed Tributary Bridge',
      category: 'ROUTE_CLEARANCE',
      severity: 'HIGH',
      affectedPopulationEstimate: 'Demo estimate pending pass',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.84,
      assignedUnit: 'Nepal Army Heavy Eng 101',
      lastUpdated: '2026-08-27T06:00:00Z',
      provenance: {
        tier: 'AI_COMPUTED',
        source: 'HIMALAYA-SHIELD Priority Engine',
        timestamp: '2026-08-27T06:00:00Z',
        algorithm: 'OSM Lifeline Severance Detection',
        confidence: 0.84,
      },
    },
    {
      id: 'ACT-003',
      rank: 3,
      zone: 'Barhabise Health Post Buffer (Zone C)',
      title: 'Pre-position Medical First-Aid Triage Staging Area',
      category: 'MEDICAL_AIRLIFT',
      severity: 'HIGH',
      affectedPopulationEstimate: 'Demo estimate pending pass',
      status: 'PENDING_HUMAN_REVIEW',
      confidence: 0.79,
      assignedUnit: 'Nepal Red Cross Emergency Team A',
      lastUpdated: '2026-08-27T05:50:00Z',
      provenance: {
        tier: 'AI_COMPUTED',
        source: 'HIMALAYA-SHIELD Priority Engine',
        timestamp: '2026-08-27T05:50:00Z',
        algorithm: 'Health Facility Buffer Distance Analysis',
        confidence: 0.79,
      },
    },
  ]);

  // Composite Risk Metric for the Active Zone
  const riskMetric: RiskZoneMetric = {
    id: 'RISK-ZONE-TATOPANI',
    zoneName: 'Tatopani / Kodari Transboundary Sector',
    coordinates: '27.9520° N, 85.9410° E',
    compositeScore: 92,
    severity: 'CRITICAL',
    floodInundationArea: 'Awaiting raster mask',
    debrisVolumeIndex: 'High slope instability',
    exposedStructures: 'Awaiting spatial join',
    severedLifelines: 'Araniko Hwy Km 112',
    isolationRiskScore: 95,
    provenance: {
      tier: 'AI_COMPUTED',
      source: 'HIMALAYA-SHIELD MCDA Engine',
      timestamp: '2026-08-27T06:00:00Z',
      algorithm: 'AHP Multi-Criteria Risk Scoring',
      confidence: 0.86,
    },
  };

  // Activity Log
  const activityLogs: ActivityEvent[] = [
    {
      id: 'EVT-101',
      timestamp: '06:14:22 NPT',
      type: 'SATELLITE_PASS',
      title: 'Copernicus Sentinel-2B Tile T45RWQ Ingested',
      detail: 'Multi-spectral bands B2, B3, B4, B8, B11, B12 normalized to BOA reflectance.',
      source: 'ESA Copernicus Open Access Hub',
      tier: 'VERIFIED',
    },
    {
      id: 'EVT-102',
      timestamp: '06:10:05 NPT',
      type: 'AI_INFERENCE',
      title: 'Differential MNDWI Change Detection Run Complete',
      detail: 'Identified candidate flood inundation polygons along Bhote Koshi main channel.',
      source: 'HIMALAYA-SHIELD Change Engine (v1.0)',
      tier: 'AI_COMPUTED',
    },
    {
      id: 'EVT-103',
      timestamp: '06:05:00 NPT',
      type: 'SENSOR_ALERT',
      title: 'DHM Nepal River Level Alert (Station: Barhabise)',
      detail: 'Water level crossed Danger Threshold (+4.8m above baseline).',
      source: 'Gov of Nepal DHM Hydrology Network',
      tier: 'VERIFIED',
    },
  ];

  // Handler for Layer Toggles
  const handleToggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  // Handler for Layer Opacity
  const handleOpacityChange = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  };

  // Handler for Human-in-the-Loop Action Approval
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

        {/* Dynamic Main Content Workspace */}
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

            {currentTab === 'satellite' && <SatelliteView />}

            {currentTab === 'damage' && <DamageView />}

            {currentTab === 'risk' && <RiskView />}

            {currentTab === 'response' && (
              <ResponseView
                priorityItems={priorityItems}
                onApproveAction={handleApproveAction}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Telemetry & Attribution Status Bar */}
      <footer className="h-7 bg-command-panel border-t border-command-border px-4 flex items-center justify-between text-[10px] font-mono text-command-dim z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>GEO-ENGINE: READY</span>
          </div>
          <span>|</span>
          <span>CRS: <strong className="text-command-text">WGS 84 / UTM Zone 45N (EPSG:32645)</strong></span>
          <span>|</span>
          <span>AOI: <strong className="text-command-text">Bhote Koshi Valley (27.95°N, 85.94°E)</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <span>DATA PROVENANCE PROTOCOL: <strong className="text-command-accent-glow">STRICT ISO-19115</strong></span>
          <span>|</span>
          <span className="text-command-muted">HIMALAYA-SHIELD DISASTER INTELLIGENCE SYSTEM</span>
        </div>
      </footer>
    </div>
  );
};
