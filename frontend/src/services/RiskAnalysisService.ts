/**
 * HIMALAYA-SHIELD: Explainable Geospatial Risk Analysis Engine
 * 
 * FACTUAL INTEGRITY & METHODOLOGICAL NOTICE:
 * 1. The scoring system uses a Multi-Criteria Weighted Model across 6 geospatial factors:
 *    - Slope Gradient (° steepness & gravitational instability)
 *    - Valley Confinement Elevation (m gorge funneling & elevation head)
 *    - Accumulated Rainfall (mm/24h scenario precipitation trigger)
 *    - Bedrock Geology (rock shear resistance & faulting)
 *    - Prototype / Precomputed Satellite Change (synthetic optical MNDWI & SAR backscatter/coherence delta)
 *    - Historical Disaster Recurrence (documented historical GLOF & debris-flow catalog reference)
 * 
 * 2. PROVENANCE DISCLOSURE:
 *    - Topography, Rainfall, and Geology values are PROTOTYPE INPUTS normalized against scenario parameters.
 *    - Satellite change metrics are PRECOMPUTED MODEL DELTAS from synthetic multi-sensor scenarios (NOT live Sentinel raster processing).
 *    - Environmental source names (SRTM, DHM, DMG) represent target data architectures and are NOT live connected.
 *    - Chosen weights and presets are CONFIGURABLE DECISION-SUPPORT PARAMETERS and NOT scientifically universal constants.
 *    - The composite score is strictly labeled as "Prototype risk score".
 *    - Missing factor data is handled transparently: weights are renormalized across available factors,
 *      and "Input data completeness" is surfaced (missing data NEVER silently becomes zero).
 */

import type { 
  RiskFactorKey, 
  RiskLevel, 
  FactorScoreLevel, 
  RiskWeights, 
  WeightPreset, 
  FactorContribution, 
  RiskZone, 
  RiskCalculationResult 
} from '../types/risk';
import type { FeatureCollection, Polygon } from 'geojson';

export const DEFAULT_RISK_WEIGHTS: RiskWeights = {
  slopeWeight: 0.20,
  elevationWeight: 0.10,
  rainfallWeight: 0.20,
  geologyWeight: 0.15,
  satelliteChangeWeight: 0.20,
  historicalRiskWeight: 0.15,
};

export const WEIGHT_PRESETS: WeightPreset[] = [
  {
    id: 'BALANCED_PROTOTYPE',
    name: 'Balanced Prototype (Standard)',
    description: 'Prototype scenario: Equal multi-criteria weights across topography, hydrometeorology, geology, and precomputed satellite deltas.',
    weights: {
      slopeWeight: 0.20,
      elevationWeight: 0.10,
      rainfallWeight: 0.20,
      geologyWeight: 0.15,
      satelliteChangeWeight: 0.20,
      historicalRiskWeight: 0.15,
    },
  },
  {
    id: 'MONSOON_SURGE',
    name: 'Monsoon Hydrometeorological Focus',
    description: 'Prototype scenario: Prioritizes intense precipitation rates and satellite-detected surface water/channel shifts.',
    weights: {
      slopeWeight: 0.15,
      elevationWeight: 0.10,
      rainfallWeight: 0.35,
      geologyWeight: 0.10,
      satelliteChangeWeight: 0.20,
      historicalRiskWeight: 0.10,
    },
  },
  {
    id: 'GEOTECHNICAL_SLOPE',
    name: 'Geotechnical & Slope Instability Focus',
    description: 'Prototype scenario: Prioritizes steep valley wall angles (>35°) and fragile, fractured Higher Himalayan schist formations.',
    weights: {
      slopeWeight: 0.35,
      elevationWeight: 0.10,
      rainfallWeight: 0.15,
      geologyWeight: 0.25,
      satelliteChangeWeight: 0.10,
      historicalRiskWeight: 0.05,
    },
  },
  {
    id: 'HISTORICAL_PRECEDENT',
    name: 'Historical Precedent & GLOF Memory',
    description: 'Prototype scenario: Elevates weight for sectors with documented historic GLOF breaches (1981 Zhangzangbo, 2016 Bhote Koshi).',
    weights: {
      slopeWeight: 0.15,
      elevationWeight: 0.10,
      rainfallWeight: 0.15,
      geologyWeight: 0.10,
      satelliteChangeWeight: 0.15,
      historicalRiskWeight: 0.35,
    },
  },
];

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 90) return 'EXTREME';
  if (score >= 75) return 'VERY HIGH';
  if (score >= 55) return 'HIGH';
  if (score >= 35) return 'MODERATE';
  return 'LOW';
}

export function getFactorLevel(score?: number): FactorScoreLevel {
  if (score === undefined || score === null) return 'DATA_UNAVAILABLE';
  if (score >= 0.80) return 'VERY_HIGH';
  if (score >= 0.60) return 'HIGH';
  if (score >= 0.35) return 'MEDIUM';
  return 'LOW';
}

/**
 * Transparent risk calculation function with explicit missing-data weight renormalization.
 */
export function calculateZoneRisk(
  factors: RiskZone['factors'],
  weights: RiskWeights
): RiskCalculationResult {
  const weightMap: Record<RiskFactorKey, number> = {
    slope: weights.slopeWeight,
    elevation: weights.elevationWeight,
    rainfall: weights.rainfallWeight,
    geology: weights.geologyWeight,
    satelliteChange: weights.satelliteChangeWeight,
    historicalRisk: weights.historicalRiskWeight,
  };

  const factorKeys: RiskFactorKey[] = [
    'slope',
    'elevation',
    'rainfall',
    'geology',
    'satelliteChange',
    'historicalRisk',
  ];

  let availableWeightSum = 0;
  let weightedScoreSum = 0;
  let availableCount = 0;
  const missingFactors: RiskFactorKey[] = [];

  factorKeys.forEach((key) => {
    const factor = factors[key];
    const w = weightMap[key];
    if (factor && factor.isAvailable && factor.normalizedScore !== undefined) {
      availableWeightSum += w;
      weightedScoreSum += w * factor.normalizedScore;
      availableCount++;
    } else {
      missingFactors.push(key);
    }
  });

  // If no factors are available, avoid NaN and flag complete data failure
  if (availableWeightSum === 0) {
    return {
      score: 0,
      scaledScore: 0,
      riskLevel: 'LOW',
      contributions: [],
      dataCompletenessPercentage: 0,
      missingFactors,
      formulaWalkthrough: 'Prototype risk score: No factor data available for computation.',
    };
  }

  // Renormalize effective score across available factors
  const normalizedRawScore = weightedScoreSum / availableWeightSum;
  const scaledScore = Math.round(normalizedRawScore * 100);
  const riskLevel = getRiskLevelFromScore(scaledScore);

  // Compute detailed factor contributions for explainability UI
  const contributions: FactorContribution[] = factorKeys.map((key) => {
    const factor = factors[key];
    const nominalWeight = weightMap[key];
    const isAvail = !!(factor && factor.isAvailable && factor.normalizedScore !== undefined);
    const effectiveWeight = isAvail ? nominalWeight / availableWeightSum : 0;
    const normScore = isAvail ? (factor.normalizedScore as number) : 0;
    const weightedContribution = effectiveWeight * normScore;
    const percentageOfTotal = normalizedRawScore > 0 ? (weightedContribution / normalizedRawScore) * 100 : 0;

    return {
      key,
      label: factor?.label || key,
      weight: nominalWeight,
      effectiveWeight,
      normalizedScore: normScore,
      weightedContribution,
      percentageOfTotal: Math.round(percentageOfTotal),
      level: isAvail ? getFactorLevel(normScore) : 'DATA_UNAVAILABLE',
      isAvailable: isAvail,
    };
  });

  const dataCompletenessPercentage = Math.round((availableCount / factorKeys.length) * 100);

  const formulaWalkthrough = `Prototype risk score = (${contributions
    .filter((c) => c.isAvailable)
    .map((c) => `${c.label} (${(c.normalizedScore * 100).toFixed(0)}% × ${(c.effectiveWeight * 100).toFixed(0)}% weight)`)
    .join(' + ')}) = ${(normalizedRawScore * 100).toFixed(1)} / 100 [${riskLevel}] (Input data completeness: ${dataCompletenessPercentage}%)`;

  return {
    score: normalizedRawScore,
    scaledScore,
    riskLevel,
    contributions,
    dataCompletenessPercentage,
    missingFactors,
    formulaWalkthrough,
  };
}

// Initial 5 Zone Catalog across Bhote Koshi / Sindhupalchok corridor
export const RAW_RISK_ZONES_DATA: Omit<RiskZone, 'rawScore' | 'scaledScore' | 'riskLevel' | 'prototypeScoreLabel' | 'missingFactorsCount' | 'dataCompletenessPercentage' | 'activeWeights' | 'contributions'>[] = [
  {
    id: 'ZONE-A',
    name: 'Tatopani Border Gorge Sector',
    sector: 'Northern Transboundary Valley Corridor',
    coordinates: [85.9461, 27.9575],
    polygon: [
      [85.9380, 27.9650],
      [85.9540, 27.9650],
      [85.9520, 27.9450],
      [85.9360, 27.9450],
      [85.9380, 27.9650],
    ],
    factors: {
      slope: {
        key: 'slope',
        label: 'Slope Gradient',
        valueDescription: 'Prototype input: 42° canyon walls',
        rawValue: 42,
        unit: '°',
        normalizedScore: 0.94,
        level: 'VERY_HIGH',
        dataSource: 'SRTM 30m / ALOS World 3D (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Slope angles exceeding 38° create high gravitational shear stress for debris and rock avalanches.',
      },
      elevation: {
        key: 'elevation',
        label: 'Valley Confinement Elevation',
        valueDescription: 'Prototype input: 1,640m narrow gorge floor',
        rawValue: 1640,
        unit: 'm',
        normalizedScore: 0.88,
        level: 'VERY_HIGH',
        dataSource: 'DHM Nepal Topographic Survey (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Severe gorge constriction funnels flood surge heights up to 12m above normal dry-season stage.',
      },
      rainfall: {
        key: 'rainfall',
        label: 'Accumulated Rainfall',
        valueDescription: 'Prototype input: 148 mm / 24h scenario rainfall',
        rawValue: 148,
        unit: 'mm/24h',
        normalizedScore: 0.85,
        level: 'VERY_HIGH',
        dataSource: 'DHM Hydrometeorological Network (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Rainfall factor normalized against configured scenario thresholds (Prototype configuration — not a universal scientific threshold).',
      },
      geology: {
        key: 'geology',
        label: 'Bedrock Geology & Fracturing',
        valueDescription: 'Prototype input: Higher Himalayan crystalline schist with active Main Central Thrust fault shears',
        rawValue: 'Jointed Schist / Gneiss',
        normalizedScore: 0.82,
        level: 'VERY_HIGH',
        dataSource: 'DMG Nepal Geological Map (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Tectonic joint planes dip parallel to valley slope, promoting translational sliding.',
      },
      satelliteChange: {
        key: 'satelliteChange',
        label: 'Satellite Detected Change',
        valueDescription: 'PRECOMPUTED MODEL DELTA — SYNTHETIC INPUT (+0.48 ΔMNDWI, -5.2 dB SAR)',
        rawValue: '+0.48 ΔMNDWI',
        normalizedScore: 0.92,
        level: 'VERY_HIGH',
        dataSource: 'Synthetic Sentinel-2 / Sentinel-1 Delta Model (Precomputed analysis / Not live connected)',
        sourceTargetNote: 'Precomputed synthetic model delta',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Precomputed analysis',
        isAvailable: true,
        explainabilityNote: 'Precomputed multi-sensor satellite delta model indicates substantial riverway widening and approach scarp scouring.',
      },
      historicalRisk: {
        key: 'historicalRisk',
        label: 'Historical Disaster Recurrence',
        valueDescription: 'Documented historical catalog: 1981 Zhangzangbo GLOF + 2016 Bhote Koshi surge references',
        rawValue: '3 major GLOF/debris events in 45 yrs',
        normalizedScore: 0.90,
        level: 'VERY_HIGH',
        dataSource: 'ICIMOD GLOF Inventory & NDRRMA BIPAD Historical Archive (Catalog baseline)',
        sourceTargetNote: 'Published historical event catalog',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Corridor has documented vulnerability to transboundary moraine-dam breach surges originating in Tibet.',
      },
    },
    primaryVulnerabilities: [
      'High gorge constriction amplifies surge velocity',
      'Arniko Highway southern approach scoured by river avulsion',
      'Heavily jointed bedrock prone to secondary rockfall',
    ],
    recommendedDecisionAction: 'Maintain mandatory transit restriction; prioritize aerial drone LiDAR reconnaissance for scarp stability.',
    coordinateProvenance: 'OpenStreetMap Relation 184633 / NDRRMA Border Corridor Baseline',
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'HIMALAYA-SHIELD Explainable Risk Engine (Prototype evaluation run)',
      algorithm: 'MCDA Multi-Factor Weighted Normalization (Prototype Score)',
    },
  },
  {
    id: 'ZONE-B',
    name: 'Larcha / Bhairabkunda Khola Confluence',
    sector: 'Tributary Debris Fan Sector',
    coordinates: [85.9220, 27.9050],
    polygon: [
      [85.9140, 27.9150],
      [85.9300, 27.9150],
      [85.9280, 27.8950],
      [85.9120, 27.8950],
      [85.9140, 27.9150],
    ],
    factors: {
      slope: {
        key: 'slope',
        label: 'Slope Gradient',
        valueDescription: 'Prototype input: 36° tributary catchment angle',
        rawValue: 36,
        unit: '°',
        normalizedScore: 0.78,
        level: 'HIGH',
        dataSource: 'SRTM 30m DEM (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Steep Bhairabkunda tributary channel generates hyper-concentrated sediment flows during peak rainfall.',
      },
      elevation: {
        key: 'elevation',
        label: 'Valley Confinement Elevation',
        valueDescription: 'Prototype input: 1,420m tributary junction basin',
        rawValue: 1420,
        unit: 'm',
        normalizedScore: 0.72,
        level: 'HIGH',
        dataSource: 'DHM Nepal Topographic Survey (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Confluence bottleneck creates backwater pooling and debris dams.',
      },
      rainfall: {
        key: 'rainfall',
        label: 'Accumulated Rainfall',
        valueDescription: 'Prototype input: 122 mm / 24h localized scenario precipitation',
        rawValue: 122,
        unit: 'mm/24h',
        normalizedScore: 0.75,
        level: 'HIGH',
        dataSource: 'DHM Nepal Hydrometeorological Network (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Rainfall factor normalized against configured scenario thresholds (Prototype configuration — not a universal scientific threshold).',
      },
      geology: {
        key: 'geology',
        label: 'Bedrock Geology & Fracturing',
        valueDescription: 'Prototype input: Unconsolidated quaternary debris fan with loose morainic boulders',
        rawValue: 'Quaternary Colluvium / Alluvium',
        normalizedScore: 0.86,
        level: 'VERY_HIGH',
        dataSource: 'DMG Nepal Geological Map (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Loose colluvial material provides abundant loose debris supply during surges.',
      },
      satelliteChange: {
        key: 'satelliteChange',
        label: 'Satellite Detected Change',
        valueDescription: 'PRECOMPUTED MODEL DELTA — SYNTHETIC INPUT (Debris cone pattern, -6.8 dB SAR drop)',
        rawValue: '-6.8 dB SAR drop',
        normalizedScore: 0.88,
        level: 'VERY_HIGH',
        dataSource: 'Synthetic Sentinel-1A SAR Delta Model (Precomputed analysis / Not live connected)',
        sourceTargetNote: 'Precomputed synthetic model delta',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Precomputed analysis',
        isAvailable: true,
        explainabilityNote: 'Precomputed radar backscatter model confirms loss of roadway continuity under active alluvial debris cone.',
      },
      historicalRisk: {
        key: 'historicalRisk',
        label: 'Historical Disaster Recurrence',
        valueDescription: 'Documented historical catalog: 1996 Larcha debris flow disaster + 2016 flood impacts',
        rawValue: 'Severe tributary flood history',
        normalizedScore: 0.95,
        level: 'VERY_HIGH',
        dataSource: 'NDRRMA Nepal Historical Disaster Catalog (Published record)',
        sourceTargetNote: 'Published historical event catalog',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Larcha fan has the highest documented tributary debris-flow mortality record along the corridor.',
      },
    },
    primaryVulnerabilities: [
      'Debris cone overtopping Arniko Highway',
      'Tributary damming potential creating upstream flood risk',
      'Severed vehicular connection between Tatopani and Barhabise',
    ],
    recommendedDecisionAction: 'Establish temporary pedestrian foot suspension link; mobilize earthmoving excavators for channel clearing.',
    coordinateProvenance: 'OpenStreetMap Baseline / ICIMOD Catchment Survey',
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'HIMALAYA-SHIELD Explainable Risk Engine (Prototype evaluation run)',
      algorithm: 'MCDA Multi-Factor Weighted Normalization (Prototype Score)',
    },
  },
  {
    id: 'ZONE-C',
    name: 'Chaku Khola Hydropower Corridor',
    sector: 'Hydro Infrastructure & Settlement Sector',
    coordinates: [85.9130, 27.8820],
    polygon: [
      [85.9050, 27.8920],
      [85.9220, 27.8920],
      [85.9200, 27.8720],
      [85.9030, 27.8720],
      [85.9050, 27.8920],
    ],
    factors: {
      slope: {
        key: 'slope',
        label: 'Slope Gradient',
        valueDescription: 'Prototype input: 31° lateral valley slopes',
        rawValue: 31,
        unit: '°',
        normalizedScore: 0.65,
        level: 'HIGH',
        dataSource: 'SRTM 30m DEM (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Moderately steep slopes subject to shallow translational planar failure during prolonged saturation.',
      },
      elevation: {
        key: 'elevation',
        label: 'Valley Confinement Elevation',
        valueDescription: 'Prototype input: 1,280m river terrace',
        rawValue: 1280,
        unit: 'm',
        normalizedScore: 0.58,
        level: 'HIGH',
        dataSource: 'DHM Nepal Topographic Survey (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Hydro powerhouse facilities located on low alluvial benches exposed to surge peaks.',
      },
      rainfall: {
        key: 'rainfall',
        label: 'Accumulated Rainfall',
        valueDescription: 'Prototype input: 94 mm / 24h scenario precipitation',
        rawValue: 94,
        unit: 'mm/24h',
        normalizedScore: 0.60,
        level: 'HIGH',
        dataSource: 'DHM Nepal Hydrometeorological Network (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Rainfall factor normalized against configured scenario thresholds (Prototype configuration — not a universal scientific threshold).',
      },
      geology: {
        key: 'geology',
        label: 'Bedrock Geology & Fracturing',
        valueDescription: 'Prototype input: Metamorphic phyllite & quartzite with moderate jointing',
        rawValue: 'Phyllite / Quartzite Series',
        normalizedScore: 0.55,
        level: 'HIGH',
        dataSource: 'DMG Nepal Geological Map (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Interbedded weak phyllite layers act as slip horizons when lubricated by groundwater.',
      },
      satelliteChange: {
        key: 'satelliteChange',
        label: 'Satellite Detected Change',
        valueDescription: 'PRECOMPUTED MODEL DELTA — SYNTHETIC INPUT (InSAR phase coherence drop γ: 0.78 → 0.31)',
        rawValue: 'InSAR Coherence drop',
        normalizedScore: 0.52,
        level: 'MEDIUM',
        dataSource: 'Synthetic Sentinel-1 InSAR Coherence Model (Precomputed analysis / Not live connected)',
        sourceTargetNote: 'Precomputed synthetic model delta',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Precomputed analysis',
        isAvailable: true,
        explainabilityNote: 'Precomputed interferometric phase decorrelation model indicates potential surface slope displacement.',
      },
      historicalRisk: {
        key: 'historicalRisk',
        label: 'Historical Disaster Recurrence',
        valueDescription: 'Documented historical catalog: 2015 Gorkha earthquake secondary destabilization records',
        rawValue: '2015 co-seismic landslide zone',
        normalizedScore: 0.68,
        level: 'HIGH',
        dataSource: 'NDRRMA BIPAD Landslide Inventory (Catalog baseline)',
        sourceTargetNote: 'Published historical event catalog',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: '2015 earthquake caused documented residual rock fissures in upper catchment.',
      },
    },
    primaryVulnerabilities: [
      'Power transmission line footing stability',
      'Intake headworks siltation and turbine damage risk',
      'Feeder road obstruction for repair crews',
    ],
    recommendedDecisionAction: 'Trigger automatic intake gate closure; deploy geotechnical ground radar for slope monitoring.',
    coordinateProvenance: 'OpenStreetMap Baseline / NEA Transmission Grid Reference',
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'HIMALAYA-SHIELD Explainable Risk Engine (Prototype evaluation run)',
      algorithm: 'MCDA Multi-Factor Weighted Normalization (Prototype Score)',
    },
  },
  {
    id: 'ZONE-D',
    name: 'Barhabise Floodplain & Administrative Basin',
    sector: 'Downstream Urban & Logistics Hub Sector',
    coordinates: [85.8980, 27.7890],
    polygon: [
      [85.8880, 27.8020],
      [85.9080, 27.8020],
      [85.9060, 27.7760],
      [85.8860, 27.7760],
      [85.8880, 27.8020],
    ],
    factors: {
      slope: {
        key: 'slope',
        label: 'Slope Gradient',
        valueDescription: 'Prototype input: 12° wide alluvial valley terrace',
        rawValue: 12,
        unit: '°',
        normalizedScore: 0.22,
        level: 'LOW',
        dataSource: 'SRTM 30m DEM (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Gentle valley floor topography minimizes landslide and rockfall susceptibility.',
      },
      elevation: {
        key: 'elevation',
        label: 'Valley Confinement Elevation',
        valueDescription: 'Prototype input: 860m open valley basin',
        rawValue: 860,
        unit: 'm',
        normalizedScore: 0.35,
        level: 'MEDIUM',
        dataSource: 'DHM Nepal Topographic Survey (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Open basin allows floodwaters to attenuate, though riverside markets remain vulnerable to overbank inundation.',
      },
      rainfall: {
        key: 'rainfall',
        label: 'Accumulated Rainfall',
        valueDescription: 'Prototype input: 68 mm / 24h steady scenario rainfall',
        rawValue: 68,
        unit: 'mm/24h',
        normalizedScore: 0.40,
        level: 'MEDIUM',
        dataSource: 'DHM Station 610 (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Rainfall factor normalized against configured scenario thresholds (Prototype configuration — not a universal scientific threshold).',
      },
      geology: {
        key: 'geology',
        label: 'Bedrock Geology & Fracturing',
        valueDescription: 'Prototype input: Stable river terrace gravels with consolidated foundation bedrock',
        rawValue: 'Consolidated Alluvial Gravels',
        normalizedScore: 0.25,
        level: 'LOW',
        dataSource: 'DMG Nepal Geological Map (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'High foundation shear stability compared to upstream gorge sectors.',
      },
      satelliteChange: {
        key: 'satelliteChange',
        label: 'Satellite Detected Change',
        valueDescription: 'PRECOMPUTED MODEL DELTA — SYNTHETIC INPUT (Baseline stability ΔMNDWI < 0.04)',
        rawValue: 'ΔMNDWI = -0.02',
        normalizedScore: 0.15,
        level: 'LOW',
        dataSource: 'Synthetic Sentinel-2 L2A Delta Model (Precomputed analysis / Not live connected)',
        sourceTargetNote: 'Precomputed synthetic model delta',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Precomputed analysis',
        isAvailable: true,
        explainabilityNote: 'Precomputed multi-spectral delta model indicates baseline stability in post-event scenario pass.',
      },
      historicalRisk: {
        key: 'historicalRisk',
        label: 'Historical Disaster Recurrence',
        valueDescription: 'Documented historical catalog: 2020 Barhabise flash flood & 2014 Jure backwater references',
        rawValue: 'Periodic riverside inundation',
        normalizedScore: 0.48,
        level: 'MEDIUM',
        dataSource: 'NDRRMA BIPAD Portal History (Catalog baseline)',
        sourceTargetNote: 'Published historical event catalog',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Low-lying riverside settlement vulnerable to flash floods, but primary administrative complex is elevated.',
      },
    },
    primaryVulnerabilities: [
      'Low-lying bazaar riverside market stalls',
      'Secondary tributary flash floods (Yawa Khola)',
      'High civilian density requiring staged evacuation routing',
    ],
    recommendedDecisionAction: 'Maintain Barhabise Hospital and municipal grounds as primary triage and staging base; monitor river gauge telemetry.',
    coordinateProvenance: 'DHM Hydrological Station 610 Catalog / NDRRMA Municipality Registry',
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'HIMALAYA-SHIELD Explainable Risk Engine (Prototype evaluation run)',
      algorithm: 'MCDA Multi-Factor Weighted Normalization (Prototype Score)',
    },
  },
  {
    id: 'ZONE-E',
    name: 'Upper Bhote Koshi Transboundary Headwaters',
    sector: 'High Altitude Glacial & Moraine Sector',
    coordinates: [85.9620, 28.0150],
    polygon: [
      [85.9480, 28.0350],
      [85.9780, 28.0350],
      [85.9750, 27.9950],
      [85.9450, 27.9950],
      [85.9480, 28.0350],
    ],
    factors: {
      slope: {
        key: 'slope',
        label: 'Slope Gradient',
        valueDescription: 'Prototype input: 38° steep glacial cirque walls',
        rawValue: 38,
        unit: '°',
        normalizedScore: 0.88,
        level: 'VERY_HIGH',
        dataSource: 'ALOS World 3D DEM (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Steep lateral moraines prone to ice-rock avalanche triggers into proglacial lakes.',
      },
      elevation: {
        key: 'elevation',
        label: 'Valley Confinement Elevation',
        valueDescription: 'Prototype input: 3,450m high-altitude gorge',
        rawValue: 3450,
        unit: 'm',
        normalizedScore: 0.90,
        level: 'VERY_HIGH',
        dataSource: 'Topographic DEM (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Extreme potential energy head: rapid flow acceleration down steep 1,800m gradient to Nepal border.',
      },
      rainfall: {
        key: 'rainfall',
        label: 'Accumulated Rainfall',
        valueDescription: 'Data gap: Remote high-altitude telemetry offline',
        normalizedScore: undefined,
        level: 'DATA_UNAVAILABLE',
        dataSource: 'Transboundary Telemetry Link (Source target / Not currently connected)',
        sourceTargetNote: 'Source target / not currently connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Source target / not currently connected',
        isAvailable: false,
        missingDataReason: 'High-altitude meteorological station connection offline; weights dynamically renormalized across active factors.',
        explainabilityNote: 'Data missing from remote gauge. Model renormalizes remaining 5 factors without assuming zero rainfall.',
      },
      geology: {
        key: 'geology',
        label: 'Bedrock Geology & Fracturing',
        valueDescription: 'Prototype input: Unconsolidated moraine dams, permafrost degradation zone, loose ice-cored till',
        rawValue: 'Morainic Till / Permafrost Degradation',
        normalizedScore: 0.92,
        level: 'VERY_HIGH',
        dataSource: 'ICIMOD Cryosphere Survey (Target reference / Not live connected)',
        sourceTargetNote: 'Target reference / Not live connected',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Unconsolidated moraine dams have high internal hydrostatic seepage and breach susceptibility.',
      },
      satelliteChange: {
        key: 'satelliteChange',
        label: 'Satellite Detected Change',
        valueDescription: 'PRECOMPUTED MODEL DELTA — SYNTHETIC INPUT (Simulated expansion of proglacial ponding)',
        rawValue: 'Proglacial Pond Expansion',
        normalizedScore: 0.84,
        level: 'VERY_HIGH',
        dataSource: 'Synthetic Sentinel-2 Multi-Spectral Delta Model (Precomputed analysis / Not live connected)',
        sourceTargetNote: 'Precomputed synthetic model delta',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Precomputed analysis',
        isAvailable: true,
        explainabilityNote: 'Precomputed multi-spectral model delta simulates enlargement of supra-glacial ponds (Illustrative scenario — not live satellite imagery processing).',
      },
      historicalRisk: {
        key: 'historicalRisk',
        label: 'Historical Disaster Recurrence',
        valueDescription: 'Documented historical catalog: Origin trajectory of 1981 Zhangzangbo breach & 1935 transboundary surge events',
        rawValue: 'Historic GLOF Source Catchment',
        normalizedScore: 0.96,
        level: 'VERY_HIGH',
        dataSource: 'ICIMOD / CAS Tibetan Plateau GLOF Archive (Published catalog baseline)',
        sourceTargetNote: 'Published historical event catalog',
        provenanceTier: 'DEMO_VALUE',
        processingStatus: 'Prototype input',
        isAvailable: true,
        explainabilityNote: 'Documented source zone for catastrophic historical transboundary outburst floods.',
      },
    },
    primaryVulnerabilities: [
      'Unconsolidated moraine breach triggering sudden GLOF surge wave',
      'Telemetry data blackout creating early warning latency',
      'Massive potential energy release towards downstream settlements',
    ],
    recommendedDecisionAction: 'Request high-resolution synthetic aperture radar (SAR) tasking from international charter; alert downstream EOC units.',
    coordinateProvenance: 'ICIMOD Glacial Lake Inventory / Transboundary Hydrological Map',
    provenance: {
      tier: 'DEMO_VALUE',
      source: 'HIMALAYA-SHIELD Explainable Risk Engine (Prototype evaluation run)',
      algorithm: 'MCDA Multi-Factor Weighted Normalization (With Missing-Data Renormalization)',
    },
  },
];

export class RiskAnalysisService {
  private activeWeights: RiskWeights = { ...DEFAULT_RISK_WEIGHTS };
  private customZonesData = RAW_RISK_ZONES_DATA;

  getWeights(): RiskWeights {
    return { ...this.activeWeights };
  }

  setWeights(newWeights: Partial<RiskWeights>): RiskWeights {
    this.activeWeights = {
      ...this.activeWeights,
      ...newWeights,
    };
    return this.getWeights();
  }

  resetWeights(presetId?: string): RiskWeights {
    if (presetId) {
      const foundPreset = WEIGHT_PRESETS.find((p) => p.id === presetId);
      if (foundPreset) {
        this.activeWeights = { ...foundPreset.weights };
        return this.getWeights();
      }
    }
    this.activeWeights = { ...DEFAULT_RISK_WEIGHTS };
    return this.getWeights();
  }

  getRiskZones(weights?: RiskWeights): RiskZone[] {
    const w = weights || this.activeWeights;
    return this.customZonesData.map((rawZone) => {
      const calcResult = calculateZoneRisk(rawZone.factors, w);
      return {
        ...rawZone,
        rawScore: calcResult.score,
        scaledScore: calcResult.scaledScore,
        riskLevel: calcResult.riskLevel,
        prototypeScoreLabel: 'Prototype risk score',
        missingFactorsCount: calcResult.missingFactors.length,
        dataCompletenessPercentage: calcResult.dataCompletenessPercentage,
        formulaWalkthrough: calcResult.formulaWalkthrough,
        activeWeights: { ...w },
        contributions: calcResult.contributions,
      };
    });
  }

  getRiskZoneById(id: string, weights?: RiskWeights): RiskZone | null {
    const zones = this.getRiskZones(weights);
    return zones.find((z) => z.id.toLowerCase() === id.toLowerCase()) || null;
  }

  getRiskGeoJson(weights?: RiskWeights): FeatureCollection<Polygon> {
    const zones = this.getRiskZones(weights);
    return {
      type: 'FeatureCollection',
      features: zones.map((zone) => ({
        type: 'Feature',
        properties: {
          id: zone.id,
          name: zone.name,
          sector: zone.sector,
          scaledScore: zone.scaledScore,
          riskLevel: zone.riskLevel,
          prototypeScoreLabel: zone.prototypeScoreLabel,
          missingFactorsCount: zone.missingFactorsCount,
          dataCompletenessPercentage: zone.dataCompletenessPercentage,
          primaryVulnerability: zone.primaryVulnerabilities[0],
          recommendedAction: zone.recommendedDecisionAction,
          coordinateProvenance: zone.coordinateProvenance,
          provenance: zone.provenance,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [zone.polygon],
        },
      })),
    };
  }
}

export const riskAnalysisService = new RiskAnalysisService();
