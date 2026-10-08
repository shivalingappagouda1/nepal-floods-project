import type { ProvenanceMeta } from './index';

export type DamageCategory = 
  | 'NO_SIGNIFICANT_CHANGE'
  | 'POSSIBLE_DAMAGE'
  | 'MODERATE_DAMAGE'
  | 'SEVERE_DAMAGE'
  | 'DESTROYED_INACCESSIBLE';

export type InfrastructureType = 
  | 'BRIDGE'
  | 'ROAD_SEGMENT'
  | 'SETTLEMENT_BUILDING'
  | 'HEALTHCARE_FACILITY'
  | 'HYDRO_TELECOM'
  | 'RIVER_BANK_SCARP';

export type VerificationStatus = 
  | 'Ground verification recommended'
  | 'Preliminary satellite triage'
  | 'Field inspection team assigned'
  | 'Verified by rapid field survey';

export interface DamageEvidence {
  description: string;
  spectralAnomaly: string;
  radarBackscatterDropDb?: number; // e.g. -5.2 dB
  waterIndexDeltaMndwi?: number;   // e.g. +0.48
  vegetationIndexDeltaNdvi?: number; // e.g. -0.34
  preDisasterObservation: string;
  postDisasterObservation: string;
  opticalBandPreview: string; // 'NATURAL_RGB' | 'MNDWI_WATER' | 'SAR_VV'
}

export interface DamageFeature {
  id: string; // e.g. 'DMG-184'
  name: string;
  infrastructureType: InfrastructureType;
  category: DamageCategory;
  categoryLabel: string;
  confidence: number; // e.g. 0.91 (91%)
  confidenceMethod: string;
  source: string; // e.g. 'Sentinel-2 MSI Tile T45RWQ / Sentinel-1A SAR'
  timestamp: string; // ISO 8601
  verificationStatus: VerificationStatus;
  coordinates: [number, number]; // [lng, lat]
  affectedDimension: string; // e.g. '180m bridge approach severed'
  recommendedResponse: string;
  evidence: DamageEvidence;
  provenance: ProvenanceMeta;
}

export interface DamageSummaryStats {
  totalFeaturesEvaluated: number;
  byCategory: Record<DamageCategory, number>;
  groundVerificationRecommendedCount: number;
  criticalArteryBlockedCount: number;
  evaluationMethodology: string;
  lastAnalysisSync: string;
}

export interface DamageCategoryConfig {
  id: DamageCategory;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  iconName: string;
  description: string;
}
