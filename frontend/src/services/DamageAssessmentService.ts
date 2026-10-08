/**
 * HIMALAYA-SHIELD: Damage Assessment Service Abstraction
 * 
 * Provides structured ingestion and spatial classification of detected visual/GIS changes
 * across 5 standardized image evidence tiers.
 * 
 * FACTUAL INTEGRITY & PROVENANCE NOTICE:
 * 1. These categories describe IMAGE & GIS change evidence from satellite and geospatial observations.
 *    They are explicitly qualified and must NOT be presented as certified on-site structural engineering assessments.
 * 2. Geographic baseline coordinates are grounded in authoritative data (OpenStreetMap Relation 184633,
 *    DHM Station Catalog, and NDRRMA BIPAD baseline).
 * 3. Assessment results and spectral deltas are "Precomputed analysis" / "DEMO / ILLUSTRATIVE" simulations.
 * 4. Numerical confidence percentages are omitted as they lack empirical ground-truth calibration in the prototype phase.
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
    source: 'Sentinel imagery (Precomputed analysis)',
    timestamp: '2026-08-28 (Precomputed baseline observation)',
    verificationStatus: 'Ground verification recommended',
    coordinates: [85.9461, 27.9575], // Miteri Bridge
    coordinateProvenance: 'OpenStreetMap Relation 184633 / NDRRMA Nepal Baseline',
    affectedDimension: 'Observable surface inundation & ~120m riverbank approach modification',
    recommendedResponse: 'Recommended: Prioritize on-site field verification before authorizing heavy transit.',
    processingStatus: 'Precomputed analysis',
    evidence: {
      description: 'Precomputed multi-spectral index delta (ΔMNDWI > +0.40) indicates extensive surface water expansion across southern approach ramp in post-event satellite pass.',
      spectralAnomaly: 'ΔMNDWI = +0.48 (Water expansion model), ΔNDVI = -0.42 (Canopy loss)',
      radarBackscatterDropDb: -5.2,
      waterIndexDeltaMndwi: 0.48,
      vegetationIndexDeltaNdvi: -0.42,
      preDisasterObservation: 'Observable intact roadway approach alignment and paved customs checkpoint in baseline imagery.',
      postDisasterObservation: 'Observable surface water channel diversion and sediment deposition across southern approach corridor.',
      opticalBandPreview: 'MNDWI_WATER',
      sensorDetails: 'Sentinel-2 MSI (Tile T45RWQ) + Sentinel-1A SAR Catalog Baseline',
    },
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'Precomputed change detection baseline (Tile T45RWQ / SAR GRD Model)',
      algorithm: 'Differential MNDWI & SAR Amplitude Ratio',
    },
  },
  {
    id: 'Feature 102',
    name: 'Larcha / Bhairabkunda Khola Confluence Span',
    infrastructureType: 'ROAD_SEGMENT',
    category: 'DESTROYED_INACCESSIBLE',
    categoryLabel: 'Destroyed / inaccessible',
    source: 'Sentinel imagery (Precomputed analysis)',
    timestamp: '2026-08-27 (Precomputed baseline observation)',
    verificationStatus: 'Ground verification recommended',
    coordinates: [85.9220, 27.9050], // Larcha Confluence
    coordinateProvenance: 'OpenStreetMap Baseline / ICIMOD Catchment Survey',
    affectedDimension: 'Loss of observable road continuity over ~350m corridor due to tributary debris deposition',
    recommendedResponse: 'Recommended: Assign ground survey crew for physical access verification; evaluate alternative aerial supply routes.',
    processingStatus: 'Precomputed analysis',
    evidence: {
      description: 'Imagery indicates loss of observable roadway continuity at tributary junction consistent with active braided debris deposition.',
      spectralAnomaly: 'SAR Δσ₀ = -6.8 dB (Specular water model), Silt Index = High',
      radarBackscatterDropDb: -6.8,
      waterIndexDeltaMndwi: 0.62,
      vegetationIndexDeltaNdvi: -0.58,
      preDisasterObservation: 'Continuous two-lane mountain highway visible along reinforced riverbank.',
      postDisasterObservation: 'Road alignment obscured by high-reflectance debris cone and redirected stream channels.',
      opticalBandPreview: 'SAR_VV',
      sensorDetails: 'Sentinel-1A SAR C-Band Radar Model (Orbit 48 Reference)',
    },
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'Precomputed radar backscatter change model',
      algorithm: 'SAR Amplitude Ratio & Morphological Sieve',
    },
  },
  {
    id: 'Feature 089',
    name: 'Tatopani Customs & Dry Port Riverbank Embankment',
    infrastructureType: 'SETTLEMENT_BUILDING',
    category: 'MODERATE_DAMAGE',
    categoryLabel: 'Moderate damage',
    source: 'Sentinel imagery (Precomputed analysis)',
    timestamp: '2026-08-28 (Precomputed baseline observation)',
    verificationStatus: 'Preliminary satellite triage',
    coordinates: [85.9425, 27.9515], // Tatopani Customs
    coordinateProvenance: 'Nepal Ministry of Industry / BIPAD Baseline',
    affectedDimension: 'Visible riverside siltation along ~85m perimeter embankment',
    recommendedResponse: 'Recommended: Conduct field & embankment inspection before commercial terminal reopening.',
    processingStatus: 'Precomputed analysis',
    evidence: {
      description: 'Detected surface siltation and perimeter erosion along the lower riverside revetment in available multi-spectral imagery.',
      spectralAnomaly: 'SWIR B12 reflectance pattern consistent with wet silt accumulation',
      waterIndexDeltaMndwi: 0.31,
      vegetationIndexDeltaNdvi: -0.22,
      preDisasterObservation: 'Paved customs freight yard and processing warehouse visible.',
      postDisasterObservation: 'Siltation boundary observable on lower embankment; main warehouse roofs remain visible.',
      opticalBandPreview: 'NATURAL_RGB',
      sensorDetails: 'Sentinel-2 MSI Multi-Spectral Catalog Baseline',
    },
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'Precomputed SWIR turbidity & edge scarp model',
      algorithm: 'SWIR Turbidity Index & Edge Extraction',
    },
  },
  {
    id: 'Feature 045',
    name: 'Chaku Khola Hydropower Feeder Road & Powerline Pylon',
    infrastructureType: 'HYDRO_TELECOM',
    category: 'POSSIBLE_DAMAGE',
    categoryLabel: 'Possible damage',
    source: 'Sentinel imagery (Precomputed analysis)',
    timestamp: '2026-08-27 (Precomputed baseline observation)',
    verificationStatus: 'Preliminary satellite triage',
    coordinates: [85.9130, 27.8820], // Chaku
    coordinateProvenance: 'OpenStreetMap Baseline',
    affectedDimension: 'Localized slope modification detected adjacent to transmission corridor',
    recommendedResponse: 'Recommended: Deploy drone aerial photography to verify transmission corridor slope stability.',
    processingStatus: 'Precomputed analysis',
    evidence: {
      description: 'Localized SAR coherence reduction detected on steep slope above access road, indicating potential surface displacement.',
      spectralAnomaly: 'InSAR Coherence drop model γ: 0.78 → 0.31',
      radarBackscatterDropDb: -2.4,
      preDisasterObservation: 'Stable transmission alignment with high phase coherence in baseline.',
      postDisasterObservation: 'Localized coherence degradation consistent with surface slope disruption.',
      opticalBandPreview: 'SAR_VV',
      sensorDetails: 'Sentinel-1 InSAR Coherence Model',
    },
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'Precomputed InSAR phase coherence model',
      algorithm: 'Interferometric Phase Coherence Tracking',
    },
  },
  {
    id: 'Feature 012',
    name: 'Barhabise Municipal Hospital & Refuge Staging Area',
    infrastructureType: 'HEALTHCARE_FACILITY',
    category: 'NO_SIGNIFICANT_CHANGE',
    categoryLabel: 'No significant detected change',
    source: 'Sentinel imagery (Precomputed analysis)',
    timestamp: '2026-08-28 (Precomputed baseline observation)',
    verificationStatus: 'Verified by rapid field survey',
    coordinates: [85.8980, 27.7890], // Barhabise
    coordinateProvenance: 'DHM Hydrological Station 610 / NDRRMA Hospital Registry',
    affectedDimension: 'Elevated healthcare complex exhibits nominal baseline stability',
    recommendedResponse: 'Recommended: Maintain facility as primary medical triage and logistics refuge hub.',
    processingStatus: 'Precomputed analysis',
    evidence: {
      description: 'Zero observable inundation or slope modification detected within 250m buffer. Facility is elevated above peak river stage.',
      spectralAnomaly: 'Nominal NDVI / MNDWI baseline stability (Δ < 0.04)',
      waterIndexDeltaMndwi: -0.02,
      vegetationIndexDeltaNdvi: +0.01,
      preDisasterObservation: 'Operational municipal healthcare clinic with unobstructed road and helipad access.',
      postDisasterObservation: 'Complex observable and accessible in post-event satellite pass.',
      opticalBandPreview: 'NATURAL_RGB',
      sensorDetails: 'Sentinel-2 L2A Multi-Spectral Observation Reference',
    },
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'NDRRMA Baseline Registry & Sentinel-2 Verification Reference',
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
      evaluationMethodology: 'Precomputed Multi-Sensor Optical (MNDWI/NDVI) & SAR C-Band Amplitude Delta',
      metricProvenance: 'Precomputed analysis',
      lastAnalysisSync: '2026-08-28 (Precomputed baseline)',
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
          source: f.source,
          timestamp: f.timestamp,
          verificationStatus: f.verificationStatus,
          affectedDimension: f.affectedDimension,
          recommendedResponse: f.recommendedResponse,
          infrastructureType: f.infrastructureType,
          description: f.evidence.description,
          coordinateProvenance: f.coordinateProvenance,
          processingStatus: f.processingStatus,
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
