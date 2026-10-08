/**
 * HIMALAYA-SHIELD: Satellite Analysis Service Abstraction
 * 
 * Provides modular interfaces and baseline implementations for satellite scene ingestion,
 * multi-temporal optical/SAR comparisons, differential MNDWI/SAR change detection,
 * and affected geographic area calculations.
 * 
 * FACTUAL INTEGRITY & PROVENANCE NOTICE:
 * 1. Current visualization assets are vector-based "Prototype imagery" reflecting real 
 *    Sentinel-1/2 and Landsat sensor specifications, awaiting raw GeoTIFF raster download in Step 5.
 * 2. All analytical metrics are explicitly designated as "Precomputed analysis" or "DEMO / ILLUSTRATIVE".
 * 3. Arbitrary/invented confidence percentages are omitted.
 */

import type { 
  SatelliteScene, 
  ScenePair, 
  ChangeDetectionResult, 
  AreaMetrics, 
  AnalysisMethod 
} from '../types/satellite';

export interface ISatelliteAnalysisService {
  getScenePairs(): Promise<ScenePair[]>;
  loadScene(sceneId: string): Promise<SatelliteScene>;
  compareScenes(beforeId: string, afterId: string, method: AnalysisMethod): Promise<ChangeDetectionResult>;
  detectChange(
    scenePair: ScenePair, 
    threshold: number, 
    method: AnalysisMethod
  ): Promise<ChangeDetectionResult>;
  calculateAffectedArea(
    scenePairId: string, 
    method: AnalysisMethod, 
    threshold: number
  ): Promise<AreaMetrics>;
}

// Baseline Catalog: Real-world sensor specifications for Bhote Koshi / Poiqu corridor
export const MOCK_SCENE_PAIRS: ScenePair[] = [
  {
    id: 'PAIR-S1-SAR-BHOTEKOSHI',
    name: 'Sentinel-1 C-Band SAR Radar (All-Weather Cloud-Penetrating)',
    aoiRegion: 'Bhote Koshi / Poiqu Transboundary River Gorge (Sindhupalchok)',
    defaultMethod: 'SAR_BACKSCATTER_RATIO',
    description: 'Active microwave C-band SAR (5.405 GHz). Penetrates monsoon cloud deck to detect specular water reflection and surface scouring.',
    preScene: {
      id: 'SCENE-S1A-PRE',
      name: 'Sentinel-1A IW GRDH Baseline (Pre-Disaster Reference)',
      sensor: 'SENTINEL_1_SAR',
      platform: 'Sentinel-1A (ESA)',
      acquisitionDate: '2026-08-20 (Catalog Orbit Reference)',
      resolutionMeters: 10,
      polarization: 'VV + VH Dual-Pol',
      orbitDirection: 'ASCENDING',
      orbitNumber: 121,
      tileId: 'IW_GRDH_1SDV_20260820_REF',
      previewUrl: 'sar-pre-preview',
      bandPresets: ['SAR_VV_VH', 'SAR_COHERENCE'],
      selectedBand: 'SAR_VV_VH',
      imageryType: 'Prototype imagery',
      sourceProvider: 'ESA Copernicus Open Access Hub (Radar Catalog Specification)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'ESA Copernicus Sentinel-1A SAR Catalog Baseline (Prototype vector preview)',
        sensor: 'C-Band Synthetic Aperture Radar (SAR)',
      },
    },
    postScene: {
      id: 'SCENE-S1A-POST',
      name: 'Sentinel-1A IW GRDH Emergency Pass (Post-Disaster)',
      sensor: 'SENTINEL_1_SAR',
      platform: 'Sentinel-1A (ESA)',
      acquisitionDate: '2026-08-27 (Catalog Orbit Reference)',
      resolutionMeters: 10,
      polarization: 'VV + VH Dual-Pol',
      orbitDirection: 'DESCENDING',
      orbitNumber: 48,
      tileId: 'IW_GRDH_1SDV_20260827_REF',
      previewUrl: 'sar-post-preview',
      bandPresets: ['SAR_VV_VH', 'SAR_COHERENCE'],
      selectedBand: 'SAR_VV_VH',
      imageryType: 'Prototype imagery',
      sourceProvider: 'ESA Copernicus Open Access Hub (Radar Catalog Specification)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'ESA Copernicus Sentinel-1A SAR Catalog Baseline (Prototype vector preview)',
        sensor: 'C-Band Synthetic Aperture Radar (SAR)',
      },
    },
  },
  {
    id: 'PAIR-S2-OPTICAL-BHOTEKOSHI',
    name: 'Sentinel-2 MSI Multi-Spectral (High-Res Optical & Indices)',
    aoiRegion: 'Tatopani – Barhabise Valley Corridor (Sindhupalchok)',
    defaultMethod: 'DIFF_MNDWI',
    description: '13-band optical Multi-Spectral Instrument (MSI). Ideal for MNDWI water delineation and NDVI vegetation loss when skies are clear.',
    preScene: {
      id: 'SCENE-S2B-PRE',
      name: 'Sentinel-2B MSI L2A (Pre-Event Baseline)',
      sensor: 'SENTINEL_2_OPTICAL',
      platform: 'Sentinel-2B (ESA)',
      acquisitionDate: '2026-08-15 (Catalog Reference)',
      resolutionMeters: 10,
      cloudCoverPercent: 4.2,
      tileId: 'T45RWQ_20260815_REF',
      previewUrl: 'opt-pre-preview',
      bandPresets: ['NATURAL_RGB', 'FALSE_COLOR_IR', 'MNDWI_WATER', 'NDVI_VEG'],
      selectedBand: 'NATURAL_RGB',
      imageryType: 'Prototype imagery',
      sourceProvider: 'Copernicus Data Space Ecosystem (Tile T45RWQ Catalog)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Copernicus Data Space Ecosystem Tile T45RWQ (Prototype vector preview)',
        sensor: 'Sentinel-2 MSI (Optical)',
      },
    },
    postScene: {
      id: 'SCENE-S2A-POST',
      name: 'Sentinel-2A MSI L2A (Post-Event Observation)',
      sensor: 'SENTINEL_2_OPTICAL',
      platform: 'Sentinel-2A (ESA)',
      acquisitionDate: '2026-08-28 (Catalog Reference)',
      resolutionMeters: 10,
      cloudCoverPercent: 19.8,
      tileId: 'T45RWQ_20260828_REF',
      previewUrl: 'opt-post-preview',
      bandPresets: ['NATURAL_RGB', 'FALSE_COLOR_IR', 'MNDWI_WATER', 'NDVI_VEG'],
      selectedBand: 'MNDWI_WATER',
      imageryType: 'Prototype imagery',
      sourceProvider: 'Copernicus Data Space Ecosystem (Tile T45RWQ Catalog)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'Copernicus Data Space Ecosystem Tile T45RWQ (Prototype vector preview)',
        sensor: 'Sentinel-2 MSI (Optical)',
      },
    },
  },
  {
    id: 'PAIR-LANDSAT9-KOSHI',
    name: 'Landsat-9 OLI-2 / TIRS-2 (Thermal & 30m Broad Catchment)',
    aoiRegion: 'Upper Poiqu / Nyalam – Lower Bhote Koshi Basin',
    defaultMethod: 'DIFF_MNDWI',
    description: 'USGS/NASA 30m multispectral + 100m thermal infrared. Provides regional basin-wide hydrological anomaly context.',
    preScene: {
      id: 'SCENE-LC09-PRE',
      name: 'Landsat-9 OLI-2 Collection 2 Level-2 (Pre-Event)',
      sensor: 'LANDSAT_9',
      platform: 'Landsat-9 (USGS/NASA)',
      acquisitionDate: '2026-08-10 (Catalog Reference)',
      resolutionMeters: 30,
      cloudCoverPercent: 8.5,
      tileId: 'LC09_L2SP_141040_20260810_REF',
      previewUrl: 'landsat-pre-preview',
      bandPresets: ['NATURAL_RGB', 'FALSE_COLOR_IR', 'MNDWI_WATER'],
      selectedBand: 'NATURAL_RGB',
      imageryType: 'Prototype imagery',
      sourceProvider: 'USGS EarthExplorer (WRS-2 Path 141, Row 040 Catalog)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'USGS EarthExplorer Landsat-9 Baseline (Prototype vector preview)',
        sensor: 'Landsat-9 OLI-2 / TIRS-2',
      },
    },
    postScene: {
      id: 'SCENE-LC09-POST',
      name: 'Landsat-9 OLI-2 Collection 2 Level-2 (Post-Event)',
      sensor: 'LANDSAT_9',
      platform: 'Landsat-9 (USGS/NASA)',
      acquisitionDate: '2026-08-26 (Catalog Reference)',
      resolutionMeters: 30,
      cloudCoverPercent: 24.1,
      tileId: 'LC09_L2SP_141040_20260826_REF',
      previewUrl: 'landsat-post-preview',
      bandPresets: ['NATURAL_RGB', 'FALSE_COLOR_IR', 'MNDWI_WATER'],
      selectedBand: 'MNDWI_WATER',
      imageryType: 'Prototype imagery',
      sourceProvider: 'USGS EarthExplorer (WRS-2 Path 141, Row 040 Catalog)',
      provenance: {
        tier: 'DEMO_VALUE',
        source: 'USGS EarthExplorer Landsat-9 Baseline (Prototype vector preview)',
        sensor: 'Landsat-9 OLI-2 / TIRS-2',
      },
    },
  },
];

export class SatelliteAnalysisService implements ISatelliteAnalysisService {
  private scenePairs: ScenePair[] = MOCK_SCENE_PAIRS;

  async getScenePairs(): Promise<ScenePair[]> {
    return this.scenePairs;
  }

  async loadScene(sceneId: string): Promise<SatelliteScene> {
    for (const pair of this.scenePairs) {
      if (pair.preScene.id === sceneId) return pair.preScene;
      if (pair.postScene.id === sceneId) return pair.postScene;
    }
    throw new Error(`Satellite scene with ID "${sceneId}" not found in catalog.`);
  }

  async compareScenes(
    beforeId: string, 
    afterId: string, 
    method: AnalysisMethod
  ): Promise<ChangeDetectionResult> {
    const pair = this.scenePairs.find(
      (p) => p.preScene.id === beforeId && p.postScene.id === afterId
    ) || this.scenePairs[0];

    return this.detectChange(pair, 0.35, method);
  }

  async calculateAffectedArea(
    _scenePairId: string, 
    method: AnalysisMethod, 
    threshold: number
  ): Promise<AreaMetrics> {
    // Dynamic sensitivity scaling based on mathematical index threshold
    const sensitivityFactor = Math.max(0.4, Math.min(1.8, 1.0 + (0.35 - threshold) * 1.5));
    
    let baseFloodKm2 = 3.65;
    let baseScarpKm2 = 1.84;
    let baseStructures = 18;

    if (method === 'SAR_BACKSCATTER_RATIO') {
      baseFloodKm2 = 4.12;
      baseScarpKm2 = 1.45;
      baseStructures = 22;
    } else if (method === 'DIFF_NDVI') {
      baseFloodKm2 = 2.90;
      baseScarpKm2 = 2.40;
      baseStructures = 15;
    }

    const floodKm2 = +(baseFloodKm2 * sensitivityFactor).toFixed(2);
    const scarpKm2 = +(baseScarpKm2 * sensitivityFactor).toFixed(2);

    return {
      floodExtentKm2: floodKm2,
      floodExtentHectares: +(floodKm2 * 100).toFixed(1),
      scarpDebrisExtentKm2: scarpKm2,
      scarpDebrisExtentHectares: +(scarpKm2 * 100).toFixed(1),
      riverCorridorLengthKm: 24.6,
      affectedStructuresEst: Math.round(baseStructures * sensitivityFactor),
      anomalyScore: Math.min(96, Math.max(45, Math.round(78 * sensitivityFactor))),
      metricProvenance: 'Precomputed analysis',
    };
  }

  async detectChange(
    scenePair: ScenePair, 
    threshold: number, 
    method: AnalysisMethod
  ): Promise<ChangeDetectionResult> {
    const metrics = await this.calculateAffectedArea(scenePair.id, method, threshold);

    let summary = `Precomputed analysis indicates ~${metrics.floodExtentKm2} km² of candidate surge inundation and ~${metrics.scarpDebrisExtentKm2} km² of riparian scarp modification along the ${scenePair.aoiRegion}.`;
    if (method === 'SAR_BACKSCATTER_RATIO') {
      summary = `C-Band SAR backscatter drop model (Δσ₀ < -${(threshold * 10).toFixed(1)} dB) isolates standing flood waters through cloud cover along ${metrics.riverCorridorLengthKm} km of the riverbed.`;
    }

    const caveats = [
      scenePair.preScene.sensor === 'SENTINEL_2_OPTICAL'
        ? 'Optical Multispectral Limitation: Optical sensors (Sentinel-2, Landsat) cannot penetrate monsoon cloud cover; cloudy pixels require SAR radar cross-validation.'
        : 'SAR Radar Physics: Specular microwave scattering detects smooth standing water, but steep gorge layover/shadow effects require geometric masking.',
      'Decision-Support Notice: Satellite imagery detects surface changes and water extent only; it does NOT prove subsurface stability or structural building safety.',
      'Provenance Notice: Results are precomputed from baseline disaster catalog parameters. Live raster ingestion will connect in Step 5.',
    ];

    return {
      id: `DETECTION-${scenePair.id}-${Date.now()}`,
      scenePairId: scenePair.id,
      method,
      processingMode: 'Precomputed analysis',
      timestamp: new Date().toISOString(),
      threshold,
      // Confidence is deliberately omitted because numerical certainty lacks empirical calibration in prototype phase
      metrics,
      detectedPolygonsCount: Math.round(metrics.floodExtentKm2 * 6.5),
      sensorProvenance: scenePair.postScene.provenance,
      summary,
      caveats,
    };
  }
}

// Global Singleton Instance
export const satelliteAnalysisService = new SatelliteAnalysisService();
