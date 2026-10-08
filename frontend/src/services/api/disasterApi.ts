/**
 * HIMALAYA-SHIELD: Disaster Intelligence API Client Service
 * 
 * Provides type-safe access to all backend API groups:
 * - /api/events
 * - /api/satellite
 * - /api/damage
 * - /api/risk
 * - /api/exposure
 * - /api/response
 */

import { apiClient } from './client';
import type { PriorityZone, ResponsePriorityTier, StagedReliefUnit } from '../../types/response';
import type { RiskZone, RiskWeights } from '../../types/risk';
import type { DamageCategory, DamageSummaryStats } from '../../types/damage';

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
  isPrototypeMode: boolean;
}

export interface BackendEventSummary {
  id: string;
  code: string;
  name: string;
  eventDate: string;
  region: string;
  country: string;
  eventType: string;
  mechanismStatus: string;
  isPrototypeCaseStudy: boolean;
}

export interface BackendSatelliteScene {
  id: string;
  sensor: string;
  platform: string;
  granuleId: string;
  acquisitionDate: string;
  orbitType?: string;
  cloudCoverPercentage?: number;
  resolutionMeters: number;
  bbox: number[];
  previewType: string;
  processingMode: string;
  provenance: {
    tier: string;
    source: string;
    sensor?: string;
    isDemoValue: boolean;
  };
}

export interface BackendDamageFeature {
  id: string;
  featureCode: string;
  category: DamageCategory;
  categoryLabel: string;
  evidenceSource: string;
  timestamp: string;
  verificationStatus: string;
  confidenceDisplay: string;
  coordinates: [number, number];
  locationName: string;
  observedChangeSummary: string;
  isPrecomputed: boolean;
}

export interface DirectiveSubmissionPayload {
  zoneId: string;
  actionDirective: string;
  operatorNotes?: string;
}

export interface DirectiveSubmissionResult {
  submissionId: string;
  zoneId: string;
  status: string;
  timestamp: string;
  advisoryNotice: string;
}

export const disasterApi = {
  // Health
  checkHealth: async (): Promise<HealthStatus> => {
    return apiClient.get<HealthStatus>('/health');
  },

  // Events API (/api/events)
  getEvents: async (): Promise<BackendEventSummary[]> => {
    return apiClient.get<BackendEventSummary[]>('/events');
  },

  getEventById: async (eventId: string) => {
    return apiClient.get(`/events/${eventId}`);
  },

  getEventWaypoints: async (eventId: string) => {
    return apiClient.get(`/events/${eventId}/waypoints`);
  },

  // Satellite API (/api/satellite)
  getSatelliteScenes: async (sensor?: string): Promise<BackendSatelliteScene[]> => {
    return apiClient.get<BackendSatelliteScene[]>('/satellite/scenes', { sensor });
  },

  getSatelliteAnalyses: async () => {
    return apiClient.get('/satellite/analyses');
  },

  // Damage API (/api/damage)
  getDamageCategories: async () => {
    return apiClient.get('/damage/categories');
  },

  getDamageFeatures: async (category?: DamageCategory): Promise<BackendDamageFeature[]> => {
    return apiClient.get<BackendDamageFeature[]>('/damage/features', { category });
  },

  getDamageSummary: async (): Promise<DamageSummaryStats> => {
    return apiClient.get<DamageSummaryStats>('/damage/summary');
  },

  // Risk API (/api/risk)
  getRiskZones: async (): Promise<RiskZone[]> => {
    return apiClient.get<RiskZone[]>('/risk/zones');
  },

  getRiskWeights: async (): Promise<RiskWeights> => {
    return apiClient.get<RiskWeights>('/risk/weights');
  },

  calculateRisk: async (payload: { zoneId?: string; customWeights?: Partial<RiskWeights>; factorOverrides?: Record<string, number> }): Promise<RiskZone> => {
    return apiClient.post<RiskZone>('/risk/calculate', payload);
  },

  // Exposure API (/api/exposure)
  getExposureLayers: async () => {
    return apiClient.get('/exposure/layers');
  },

  getTacticalKpis: async () => {
    return apiClient.get('/exposure/kpis');
  },

  // Response API (/api/response)
  getResponseZones: async (tier?: ResponsePriorityTier): Promise<PriorityZone[]> => {
    return apiClient.get<PriorityZone[]>('/response/zones', { tier });
  },

  getResponseZoneById: async (zoneId: string): Promise<PriorityZone> => {
    return apiClient.get<PriorityZone>(`/response/zones/${encodeURIComponent(zoneId)}`);
  },

  getStagedUnits: async (): Promise<StagedReliefUnit[]> => {
    return apiClient.get<StagedReliefUnit[]>('/response/units');
  },

  submitDirective: async (payload: DirectiveSubmissionPayload): Promise<DirectiveSubmissionResult> => {
    return apiClient.post<DirectiveSubmissionResult>('/response/directives/submit', payload);
  },
};
