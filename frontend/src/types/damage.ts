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
  radarBackscatterDropDb?: number; // Precomputed model delta (dB)
  waterIndexDeltaMndwi?: number;   // Precomputed index delta
  vegetationIndexDeltaNdvi?: number; // Precomputed index delta
  preDisasterObservation: string;
  postDisasterObservation: string;
  opticalBandPreview: string; // 'NATURAL_RGB' | 'MNDWI_WATER' | 'SAR_VV'
  sensorDetails: string;
}

export interface DamageFeature {
  id: string; // e.g. 'Feature 184'
  name: string;
  infrastructureType: InfrastructureType;
  category: DamageCategory;
  categoryLabel: string;
  confidence?: number; // Omitted if not calibrated against empirical ground truth
  confidenceMethod?: string;
  source: string; // e.g. 'Sentinel imagery (Precomputed analysis)'
  timestamp: string; // Catalog observation timestamp
  verificationStatus: VerificationStatus;
  coordinates: [number, number]; // [lng, lat]
  coordinateProvenance: string; // e.g. 'OpenStreetMap Relation 184633 / NDRRMA Baseline'
  affectedDimension: string; // e.g. '120m riverbank approach change'
  recommendedResponse: string;
  processingStatus: 'Precomputed analysis' | 'DEMO / ILLUSTRATIVE';
  evidence: DamageEvidence;
  provenance: ProvenanceMeta;
}

export interface DamageSummaryStats {
  totalFeaturesEvaluated: number;
  byCategory: Record<DamageCategory, number>;
  groundVerificationRecommendedCount: number;
  criticalArteryBlockedCount: number;
  evaluationMethodology: string;
  metricProvenance: 'Precomputed analysis' | 'DEMO / ILLUSTRATIVE';
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
