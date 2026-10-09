export type NavigationTab = 
  | 'dashboard' 
  | 'satellite' 
  | 'damage' 
  | 'risk' 
  | 'response';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'INFORMATIONAL' | 'NORMAL';

export type DataTier = 'VERIFIED' | 'AI_COMPUTED' | 'DEMO_VALUE' | 'AWAITING_PASS' | 'LIVE_OBSERVED' | 'VERIFIED_GEODATASET';

export type BasemapStyle = 'dark' | 'satellite' | 'streets';

export type LanguageMode = 'en' | 'np';

export interface ProvenanceMeta {
  tier: DataTier | string;
  source: string;
  timestamp?: string;
  algorithm?: string;
  sensor?: string;
  confidence?: number;
  isDemoValue?: boolean;
  is_live?: boolean;
  license?: string;
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
  category: 'IMAGERY' | 'HAZARD' | 'INFRASTRUCTURE' | 'DEMOGRAPHICS' | 'BOUNDARIES';
  enabled: boolean;
  opacity: number;
  badge: DataTier | string;
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
  confidence?: number;
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

export interface LiveEarthquakeEvent {
  id: string;
  title: string;
  magnitude: number;
  place: string;
  time: string;
  depth_km: number;
  coordinates: [number, number]; // [lng, lat]
  status?: string;
  url?: string;
  provenance: ProvenanceMeta;
}

export interface LiveWeatherStation {
  station_id: string;
  name: string;
  province: string;
  coordinates: [number, number]; // [lng, lat]
  is_active_aoi?: boolean;
  temperature_c: number;
  precipitation_mm: number;
  rain_mm: number;
  relative_humidity_percent: number;
  wind_speed_kmh: number;
  weather_code?: number;
  hazard_level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NORMAL';
  hazard_label: string;
  observation_time: string;
  provenance: ProvenanceMeta;
}

export interface FeedStatusItem {
  name: string;
  coverage: string;
  type: string;
  is_live: boolean;
  status: string;
  item_count?: number;
  latency_ms?: number;
  last_updated?: string;
  license?: string;
  notes?: string;
}
