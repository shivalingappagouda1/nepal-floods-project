export type NavigationTab = 
  | 'dashboard' 
  | 'satellite' 
  | 'damage' 
  | 'risk' 
  | 'response';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFORMATIONAL';

export type DataTier = 'VERIFIED' | 'AI_COMPUTED' | 'DEMO_VALUE' | 'AWAITING_PASS';

export interface ProvenanceMeta {
  tier: DataTier;
  source: string;
  timestamp?: string;
  algorithm?: string;
  sensor?: string;
  confidence?: number;
  isDemoValue?: boolean;
}

export interface IncidentInfo {
  id: string;
  code: string;
  title: string;
  region: string;
  country: string;
  disasterType: string;
  declaredDate: string;
  status: 'ACTIVE' | 'MONITORING' | 'CONTAINED' | 'RESOLVED';
  severity: SeverityLevel;
  centerCoordinates: [number, number]; // [lat, lng]
  boundingCoordinates: string;
  leadAgencies: string[];
}

export interface SystemStatus {
  serviceStatus: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  lastTelemetrySync: string;
  activeCrs: string;
  networkLatencyMs: number;
  activePassOrbit: string;
  eocReadiness: string;
}

export interface KPICardData {
  id: string;
  label: string;
  value: string;
  unit?: string;
  statusLabel?: string;
  trend?: string;
  severity?: SeverityLevel;
  provenance: ProvenanceMeta;
}

export interface MapLayerConfig {
  id: string;
  label: string;
  category: 'IMAGERY' | 'HAZARD' | 'INFRASTRUCTURE' | 'DEMOGRAPHICS';
  enabled: boolean;
  opacity: number;
  badge: DataTier;
  description: string;
  availableInMvp: boolean;
}

export interface PriorityActionItem {
  id: string;
  rank: number;
  zone: string;
  title: string;
  category: 'EVACUATION' | 'SEARCH_RESCUE' | 'ROUTE_CLEARANCE' | 'MEDICAL_AIRLIFT' | 'STRUCTURAL_SURVEY';
  severity: SeverityLevel;
  affectedPopulationEstimate: string;
  status: 'PENDING_HUMAN_REVIEW' | 'APPROVED_FOR_DISPATCH' | 'DEPLOYED' | 'RESOLVED';
  confidence: number;
  provenance: ProvenanceMeta;
  assignedUnit?: string;
  lastUpdated: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'AI_INFERENCE' | 'SATELLITE_PASS' | 'SENSOR_ALERT' | 'HUMAN_OVERRIDE' | 'SYSTEM_EVENT';
  title: string;
  detail: string;
  source: string;
  tier: DataTier;
}

export interface RiskZoneMetric {
  id: string;
  zoneName: string;
  coordinates: string;
  compositeScore: number; // 0 - 100
  severity: SeverityLevel;
  floodInundationArea: string;
  debrisVolumeIndex: string;
  exposedStructures: string;
  severedLifelines: string;
  isolationRiskScore: number;
  provenance: ProvenanceMeta;
}
