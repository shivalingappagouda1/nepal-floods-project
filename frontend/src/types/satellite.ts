import type { ProvenanceMeta } from './index';

export type SatelliteSensorType = 
  | 'SENTINEL_2_OPTICAL' 
  | 'SENTINEL_1_SAR' 
  | 'LANDSAT_9' 
  | 'GEOTIFF_PREVIEW';

export type BandCombination = 
  | 'NATURAL_RGB'      // B4-B3-B2 (True Color)
  | 'FALSE_COLOR_IR'  // B8-B4-B3 (Vegetation & Scarp)
  | 'MNDWI_WATER'     // (B3-B11)/(B3+B11) (Water Index)
  | 'NDVI_VEG'        // (B8-B4)/(B8+B4) (Vegetation Index)
  | 'SAR_VV_VH'       // VV & VH Polarized Backscatter (dB)
  | 'SAR_COHERENCE';   // Interferometric Coherence

export type AnalysisMethod = 
  | 'DIFF_MNDWI' 
  | 'SAR_BACKSCATTER_RATIO' 
  | 'DIFF_NDVI' 
  | 'HYBRID_CHANGE_DETECTION';

export type ComparisonMode = 
  | 'SIDE_BY_SIDE' 
  | 'SWIPE_SPLIT' 
  | 'OPACITY_BLEND' 
  | 'CHANGE_OVERLAY';

export interface SatelliteScene {
  id: string;
  name: string;
  sensor: SatelliteSensorType;
  platform: string; // e.g., 'Sentinel-2B', 'Sentinel-1A', 'Landsat-9'
  acquisitionDate: string; // ISO 8601 or catalog date
  resolutionMeters: number;
  cloudCoverPercent?: number;
  polarization?: string; // 'VV+VH' for SAR
  orbitDirection?: 'ASCENDING' | 'DESCENDING';
  orbitNumber?: number;
  tileId: string; // e.g. 'T45RWQ'
  previewUrl: string;
  bandPresets: BandCombination[];
  selectedBand: BandCombination;
  imageryType: 'Prototype imagery' | 'Real raster GeoTIFF';
  sourceProvider: string;
  provenance: ProvenanceMeta;
}

export interface ScenePair {
  id: string;
  name: string;
  aoiRegion: string;
  preScene: SatelliteScene;
  postScene: SatelliteScene;
  defaultMethod: AnalysisMethod;
  description: string;
}

export interface AreaMetrics {
  floodExtentKm2: number;
  floodExtentHectares: number;
  scarpDebrisExtentKm2: number;
  scarpDebrisExtentHectares: number;
  riverCorridorLengthKm: number;
  affectedStructuresEst: number;
  anomalyScore: number; // 0-100
  metricProvenance: 'Precomputed analysis' | 'DEMO / ILLUSTRATIVE';
}

export interface ChangeDetectionResult {
  id: string;
  scenePairId: string;
  method: AnalysisMethod;
  processingMode: 'Precomputed analysis' | 'DEMO / ILLUSTRATIVE' | 'AI inference';
  timestamp: string;
  threshold: number;
  confidence?: number; // Omitted if no defensible empirical ground-truth basis
  metrics: AreaMetrics;
  detectedPolygonsCount: number;
  sensorProvenance: ProvenanceMeta;
  summary: string;
  caveats: string[];
}
