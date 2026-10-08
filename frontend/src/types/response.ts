import type { ProvenanceMeta } from './index';

export type ResponsePriorityTier = 
  | 'PRIORITY_1'
  | 'PRIORITY_2'
  | 'PRIORITY_3';

export type ResponseSeverity = 
  | 'CRITICAL'
  | 'SEVERE'
  | 'MODERATE'
  | 'LOW';

export type ResponseFactorKey = 
  | 'populationExposure'
  | 'damageSeverity'
  | 'criticalInfrastructure'
  | 'accessibility'
  | 'secondaryHazard'
  | 'medicalUrgency';

export type FactorLevel = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'DATA_UNAVAILABLE';

export interface ResponseFactorAssessment {
  key: ResponseFactorKey;
  label: string;
  level: FactorLevel;
  normalizedScore?: number; // 0.0 to 1.0 (undefined if data missing)
  description: string;
  isAvailable: boolean;
  missingReason?: string;
}

export interface RouteStatus {
  isAvailable: boolean;
  roadPassability: 'SEVERED' | 'IMPASSABLE_DEBRIS' | 'RESTRICTED_SINGLE_LANE' | 'OPEN_ALL_VEHICLES' | 'UNAVAILABLE';
  routeDescription: string;
  primaryObstacle?: string;
  estimatedTransitTime?: string;
  corridorDistanceKm?: number;
  alternativeAccessMethod: string; // e.g. 'Air reconnaissance / High-line ropeway / Foot patrol'
}

export interface PriorityZone {
  id: string; // e.g. 'Zone A'
  zoneCode: string; // e.g. 'ZONE-A-TATOPANI'
  name: string;
  sector: string;
  priorityTier: ResponsePriorityTier;
  priorityRank: number; // 1, 2, 3, etc.
  score: number; // 0 to 100
  prototypeScoreLabel: 'Prototype response priority score';
  severity: ResponseSeverity;
  populationExposure: string;
  populationEstimate?: number;
  infrastructureImpact: string;
  accessibility: string;
  secondaryHazardRisk: string;
  medicalUrgency: string;
  whyFactors: string[]; // ['high population exposure', 'severe detected damage', ...]
  recommendedAction: string;
  confidence?: number; // Omitted (displays 'CONFIDENCE: Not available')
  verificationStatus: 'Human verification required' | 'Prioritize for assessment' | 'Field team assigned';
  routeStatus: RouteStatus;
  coordinates: [number, number]; // [lng, lat]
  polygon: [number, number][]; // GeoJSON boundary [lng, lat][]
  coordinateProvenance: string;
  factors: Record<ResponseFactorKey, ResponseFactorAssessment>;
  provenance: ProvenanceMeta;
}

export interface StagedReliefUnit {
  id: string;
  name: string;
  agency: string;
  role: string;
  callsign: string;
  baseLocation: string;
  status: 'STAGED_READY' | 'DEPLOYED' | 'EN_ROUTE' | 'STANDBY';
  statusLabel: string;
  assignedZoneId?: string;
  contactFrequency: string;
}
