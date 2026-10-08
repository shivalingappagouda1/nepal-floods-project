import type { ProvenanceMeta } from './index';

export type RiskFactorKey = 
  | 'slope'
  | 'elevation'
  | 'rainfall'
  | 'geology'
  | 'satelliteChange'
  | 'historicalRisk';

export type RiskLevel = 
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'VERY HIGH'
  | 'EXTREME';

export type FactorScoreLevel = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'VERY_HIGH'
  | 'DATA_UNAVAILABLE';

export interface RiskFactorMeasurement {
  key: RiskFactorKey;
  label: string;
  valueDescription: string;
  rawValue?: number | string;
  unit?: string;
  normalizedScore?: number; // 0.0 to 1.0 (undefined if data missing)
  level: FactorScoreLevel;
  dataSource: string;
  sourceTargetNote?: string;
  provenanceTier: 'DEMO_VALUE' | 'AI_COMPUTED' | 'VERIFIED';
  processingStatus: 'Prototype input' | 'Precomputed analysis' | 'Source target / not currently connected';
  isAvailable: boolean;
  missingDataReason?: string;
  explainabilityNote: string;
}

export interface RiskWeights {
  slopeWeight: number;
  elevationWeight: number;
  rainfallWeight: number;
  geologyWeight: number;
  satelliteChangeWeight: number;
  historicalRiskWeight: number;
}

export interface WeightPreset {
  id: string;
  name: string;
  description: string;
  weights: RiskWeights;
}

export interface FactorContribution {
  key: RiskFactorKey;
  label: string;
  weight: number;
  effectiveWeight: number;
  normalizedScore: number;
  weightedContribution: number;
  percentageOfTotal: number;
  level: FactorScoreLevel;
  isAvailable: boolean;
}

export interface RiskZone {
  id: string; // e.g. 'ZONE-A'
  name: string;
  sector: string;
  coordinates: [number, number]; // [lng, lat]
  polygon: [number, number][]; // GeoJSON boundary [lng, lat][]
  factors: Record<RiskFactorKey, RiskFactorMeasurement>;
  rawScore: number; // 0.0 to 1.0
  scaledScore: number; // 0 to 100
  riskLevel: RiskLevel;
  prototypeScoreLabel: 'Prototype risk score';
  missingFactorsCount: number;
  dataCompletenessPercentage: number;
  formulaWalkthrough?: string;
  activeWeights: RiskWeights;
  contributions: FactorContribution[];
  primaryVulnerabilities: string[];
  recommendedDecisionAction: string;
  coordinateProvenance: string;
  provenance: ProvenanceMeta;
}

export interface RiskCalculationResult {
  score: number;
  scaledScore: number;
  riskLevel: RiskLevel;
  contributions: FactorContribution[];
  dataCompletenessPercentage: number;
  missingFactors: RiskFactorKey[];
  formulaWalkthrough: string;
}
