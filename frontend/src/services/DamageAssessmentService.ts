/**
 * HIMALAYA-SHIELD: Damage Assessment Service Abstraction
 * 
 * Provides structured ingestion and spatial classification of detected visual/GIS changes
 * across 5 standardized image evidence tiers.
 * 
 * CRITICAL FACTUAL INTEGRITY DISCLAIMER:
 * These categories describe IMAGE / GIS change evidence from satellite and geospatial observations.
 * They must NOT be interpreted or presented as certified on-site structural engineering assessments.
 */

import type { 
  DamageFeature, 
  DamageCategory, 
  DamageSummaryStats 
} from '../types/damage';
import type { FeatureCollection, Geometry } from 'geojson';

export interface IDamageAssessmentService {
  getDamageFeatures(categoryFilter?: DamageCategory): Promise<DamageFeature[]>;
  getDamageFeatureById(id: string): Promise<DamageFeature | null>;
  getDamageSummary(): Promise<DamageSummaryStats>;
  getDamageGeoJson(): Promise<FeatureCollection<Geometry>>;
}

export const MOCK_DAMAGE_FEATURES: DamageFeature[] = [
  {
    id: 'Feature 184',
    name: 'Miteri Border Bridge Approach & Road Bed',
    infrastructureType: 'BRIDGE',
    category: 'SEVERE_DAMAGE',
    categoryLabel: 'Severe detected change',
    confidence: 0.91,
    confidenceMethod: 'Differential MNDWI (+0.48 water surge) & SAR Δσ₀ (-5.2 dB specular water drop)',
    source: 'Sentinel imagery (Sentinel-2 MSI Tile T45RWQ / Sentinel-1A SAR)',
    timestamp: '2026-08-28T05:14:01Z',
    verificationStatus: 'Ground verification recommended',
    coordinates: [85.9461, 27.9575], // Miteri Bridge
    affectedDimension: '120m riverbank abutment scouring & road deck approach loss',
    recommendedResponse: 'Dispatch rapid bridge inspection team; enforce strict vehicle cordons along northern border access.',
    evidence: {
      description: 'Severe multi-spectral reflectance shift and surface water inundation across southern abutment fill. Optical NDVI loss ΔNDVI = -0.42 confirms vegetation stripping.',
      spectralAnomaly: 'ΔMNDWI = +0.48 (High Water Inundation), ΔNDVI = -0.42 (Surface Stripping)',
      radarBackscatterDropDb: -5.2,
      waterIndexDeltaMndwi: 0.48,
      vegetationIndexDeltaNdvi: -0.42,
      preDisasterObservation: 'Intact asphalt approach ramp and paved customs border checkpoint plaza.',
      postDisasterObservation: 'Submerged southern abutment fill, standing water channel realignment, and debris accumulation.',
      opticalBandPreview: 'MNDWI_WATER',
    },
    provenance: {
      tier: 'AI_COMPUTED',
      source: 'Sentinel-2 MSI (Tile T45RWQ) + Sentinel-1A SAR Dual-Sensor Change Pipeline',
      timestamp: '2026-08-28T05:14:01Z',
      algorithm: 'Differential MNDWI & SAR Coherence Delta',
      confidence: 0.91,
    },
  },
  {
    id: 'Feature 102',
    name: 'Larcha / Bhairabkunda Khola Confluence Span',
    infrastructureType: 'ROAD_SEGMENT',
    category: 'DESTROYED_INACCESSIBLE',
    categoryLabel: 'Destroyed / inaccessible',
    confidence: 0.94,
    confidenceMethod: 'Sentinel-1 C-Band SAR amplitude loss and optical sediment plume tracking',
    source: 'Sentinel imagery (Sentinel-1A SAR Orbit 48 / Sentinel-2B)',
    timestamp: '2026-08-27T00:35:22Z',
    verificationStatus: 'Ground verification recommended',
    coordinates: [85.9220, 27.9050], // Larcha Confluence
    affectedDimension: '350m continuous highway segment severed by debris deposition',
    recommendedResponse: 'Assign heavy earthmoving equipment for clearance triage; designate alternative aerial supply corridor.',
    evidence: {
      description: 'Total loss of roadway continuity due to high-energy tributary debris flow deposition across Araniko Highway. River channel displaced 45m westward.',
      spectralAnomaly: 'Δσ₀ = -6.8 dB (Total specular flood surface), Silt Index = High',
      radarBackscatterDropDb: -6.8,
      waterIndexDeltaMndwi: 0.62,
      vegetationIndexDeltaNdvi: -0.58,
      preDisasterObservation: 'Standard two-lane mountain highway corridor along reinforced river retaining wall.',
      postDisasterObservation: 'Complete severance by boulder-laden debris cone and active braided river flow.',
      opticalBandPreview: 'SAR_VV',
    },
    provenance: {
      tier: 'AI_COMPUTED',
      source: 'Sentinel-1A SAR C-Band Radar Backscatter Pipeline',
      timestamp: '2026-08-27T00:35:22Z',
      algorithm: 'Radar Amplitude Ratio & Morphological Sieve',
      confidence: 0.94,
    },
  },
  {
    id: 'Feature 089',
    name: 'Tatopani Customs & Dry Port Riverbank Embankment',
    infrastructureType: 'SETTLEMENT_BUILDING',
    category: 'MODERATE_DAMAGE',
    categoryLabel: 'Moderate damage',
    confidence: 0.84,
    confidenceMethod: 'Sentinel-2 SWIR band reflection & sediment accumulation index',
    source: 'Sentinel imagery (Sentinel-2 MSI Tile T45RWQ)',
    timestamp: '2026-08-28T05:14:01Z',
    verificationStatus: 'Preliminary satellite triage',
    coordinates: [85.9425, 27.9515], // Tatopani Customs
    affectedDimension: '85m commercial perimeter wall compromised with 1.2m sediment siltation',
    recommendedResponse: 'Prioritize structural foundation inspection before allowing commercial cargo reentry.',
    evidence: {
      description: 'Siltation and perimeter erosion along the lower riverside retaining revetment. Main warehouse structures remain intact above flood line.',
      spectralAnomaly: 'SWIR B12 reflectance increase consistent with wet silt deposition',
      waterIndexDeltaMndwi: 0.31,
      vegetationIndexDeltaNdvi: -0.22,
      preDisasterObservation: 'Paved customs container yard and active dry port freight processing warehouse.',
      postDisasterObservation: 'Siltation line visible on lower warehouse walls; outer perimeter fence washed out.',
      opticalBandPreview: 'NATURAL_RGB',
    },
    provenance: {
      tier: 'AI_COMPUTED',
      source: 'Copernicus Sentinel-2 MSI Multi-Spectral Pipeline',
      timestamp: '2026-08-28T05:14:01Z',
      algorithm: 'SWIR Turbidity Index & Edge Scarp Extraction',
      confidence: 0.84,
    },
  },
  {
    id: 'Feature 045',
    name: 'Chaku Khola Hydropower Feeder Road & Powerline Pylon',
    infrastructureType: 'HYDRO_TELECOM',
    category: 'POSSIBLE_DAMAGE',
    categoryLabel: 'Possible damage',
    confidence: 0.72,
    confidenceMethod: 'SAR coherence decrease in steep canyon zone',
    source: 'Sentinel imagery (Sentinel-1 SAR Coherence)',
    timestamp: '2026-08-27T00:35:22Z',
    verificationStatus: 'Preliminary satellite triage',
    coordinates: [85.9130, 27.8820], // Chaku
    affectedDimension: 'Single transmission pylon footing on steep saturated slope',
    recommendedResponse: 'Conduct drone aerial survey to confirm transmission tower foundation stability.',
    evidence: {
      description: 'Interferometric SAR coherence reduction detected on slope above powerhouse access road. Possible shallow debris movement.',
      spectralAnomaly: 'InSAR Coherence drop γ: 0.78 → 0.31',
      radarBackscatterDropDb: -2.4,
      preDisasterObservation: 'Stable transmission corridor with high microwave phase coherence.',
      postDisasterObservation: 'Localized coherence degradation indicating slope destabilization or vegetation loss.',
      opticalBandPreview: 'SAR_VV',
    },
    provenance: {
      tier: 'AI_COMPUTED',
      source: 'Sentinel-1 InSAR Coherence Processing Pipeline',
      timestamp: '2026-08-27T00:35:22Z',
      algorithm: 'Interferometric Phase Coherence Tracking',
      confidence: 0.72,
    },
  },
  {
    id: 'Feature 012',
    name: 'Barhabise Municipal Hospital & Emergency Refuge Zone',
    infrastructureType: 'HEALTHCARE_FACILITY',
    category: 'NO_SIGNIFICANT_CHANGE',
    categoryLabel: 'No significant detected change',
    confidence: 0.96,
    confidenceMethod: 'Multi-spectral optical stability and multi-temporal SAR consistency',
    source: 'Sentinel imagery (Sentinel-2 L2A & Sentinel-1 SAR)',
    timestamp: '2026-08-28T05:14:01Z',
    verificationStatus: 'Verified by rapid field survey',
    coordinates: [85.8980, 27.7890], // Barhabise
    affectedDimension: 'Elevated hospital compound remains fully operational',
    recommendedResponse: 'Maintain as primary medical triage and logistics staging hub for northern Sindhupalchok.',
    evidence: {
      description: 'Zero flood inundation or slope modification detected within 250m safety buffer. Facility is situated 45m above peak river stage.',
      spectralAnomaly: 'Nominal NDVI / MNDWI baseline stability (Δ < 0.04)',
      waterIndexDeltaMndwi: -0.02,
      vegetationIndexDeltaNdvi: +0.01,
      preDisasterObservation: 'Operational municipal healthcare clinic with paved helipad and ambulance access.',
      postDisasterObservation: 'Compound intact, fully accessible, zero flood or debris impact.',
      opticalBandPreview: 'NATURAL_RGB',
    },
    provenance: {
      tier: 'VERIFIED',
      source: 'NDRRMA Field Situation Report & Sentinel-2 Verification Pass',
      timestamp: '2026-08-28T06:00:00Z',
      confidence: 0.96,
    },
  },
];

export class DamageAssessmentService implements IDamageAssessmentService {
  private features: DamageFeature[] = MOCK_DAMAGE_FEATURES;

  async getDamageFeatures(categoryFilter?: DamageCategory): Promise<DamageFeature[]> {
    if (!categoryFilter) return this.features;
    return this.features.filter((f) => f.category === categoryFilter);
  }

  async getDamageFeatureById(id: string): Promise<DamageFeature | null> {
    const found = this.features.find((f) => f.id.toLowerCase() === id.toLowerCase());
    return found || null;
  }

  async getDamageSummary(): Promise<DamageSummaryStats> {
    const byCategory: Record<DamageCategory, number> = {
      NO_SIGNIFICANT_CHANGE: 0,
      POSSIBLE_DAMAGE: 0,
      MODERATE_DAMAGE: 0,
      SEVERE_DAMAGE: 0,
      DESTROYED_INACCESSIBLE: 0,
    };

    let groundVerifCount = 0;
    let criticalBlocked = 0;

    this.features.forEach((f) => {
      byCategory[f.category] = (byCategory[f.category] || 0) + 1;
      if (f.verificationStatus === 'Ground verification recommended') {
        groundVerifCount++;
      }
      if (f.category === 'DESTROYED_INACCESSIBLE' || f.category === 'SEVERE_DAMAGE') {
        criticalBlocked++;
      }
    });

    return {
      totalFeaturesEvaluated: this.features.length,
      byCategory,
      groundVerificationRecommendedCount: groundVerifCount,
      criticalArteryBlockedCount: criticalBlocked,
      evaluationMethodology: 'Multi-Sensor Satellite Optical (MNDWI/NDVI) & SAR C-Band Amplitude Delta',
      lastAnalysisSync: '2026-08-28T05:14:01Z',
    };
  }

  async getDamageGeoJson(): Promise<FeatureCollection<Geometry>> {
    return {
      type: 'FeatureCollection',
      features: this.features.map((f) => ({
        type: 'Feature',
        properties: {
          id: f.id,
          name: f.name,
          category: f.category,
          categoryLabel: f.categoryLabel,
          confidence: f.confidence,
          confidencePercent: `${Math.round(f.confidence * 100)}%`,
          source: f.source,
          timestamp: f.timestamp,
          verificationStatus: f.verificationStatus,
          affectedDimension: f.affectedDimension,
          recommendedResponse: f.recommendedResponse,
          infrastructureType: f.infrastructureType,
          description: f.evidence.description,
          provenance: f.provenance,
        },
        geometry: {
          type: 'Point',
          coordinates: f.coordinates,
        },
      })),
    };
  }
}

export const damageAssessmentService = new DamageAssessmentService();
