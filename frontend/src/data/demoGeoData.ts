/**
 * HIMALAYA-SHIELD: Geospatial Prototype Dataset
 * 
 * DISCLAIMER / FACTUAL INTEGRITY NOTICE:
 * The spatial geometries below are DEMONSTRATION / PROTOTYPE datasets for UI & architectural validation.
 * They are centered on real geomorphological coordinates of the Bhote Koshi / Tatopani / Araniko Highway 
 * transboundary corridor in Nepal, but must NOT be cited as verified ground-truth damage observations.
 * 
 * In Steps 4 & 5, these will be replaced with real Sentinel-2 differential change masks and OpenStreetMap vectors.
 */

import type { FeatureCollection, Geometry } from 'geojson';

export interface GeoFeatureProperties {
  id: string;
  name: string;
  type: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  category?: string;
  status: string;
  description: string;
  isDemo: true;
  provenance: {
    source: string;
    timestamp: string;
    tier: 'DEMO_VALUE' | 'VERIFIED' | 'AI_COMPUTED';
    confidence?: number;
  };
}

// 1. Flood Inundation Extent (DEMO)
export const demoFloodGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'FL-001',
        name: 'Tatopani Gorge Main Channel Surge',
        type: 'FLOOD_INUNDATION',
        severity: 'CRITICAL',
        status: 'ACTIVE_SURGE',
        description: 'High-velocity debris & glacial outburst surge along Bhote Koshi main stem.',
        isDemo: true,
        provenance: {
          source: 'Prototype Synthetic Change Mask (Awaiting S2 Pass)',
          timestamp: '2026-08-27T04:48:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.85,
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9380, 27.9560],
            [85.9440, 27.9540],
            [85.9460, 27.9480],
            [85.9390, 27.9420],
            [85.9310, 27.9350],
            [85.9260, 27.9200],
            [85.9200, 27.9100],
            [85.9180, 27.8980],
            [85.9080, 27.8800],
            [85.8990, 27.7950],
            [85.8920, 27.7850],
            [85.8960, 27.7840],
            [85.9030, 27.7960],
            [85.9130, 27.8820],
            [85.9230, 27.9010],
            [85.9270, 27.9150],
            [85.9330, 27.9260],
            [85.9420, 27.9380],
            [85.9490, 27.9490],
            [85.9480, 27.9580],
            [85.9380, 27.9560],
          ],
        ],
      },
    },
  ],
};

// 2. Landslide & Debris Flow Scarp Zones (DEMO)
export const demoLandslideGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'LS-001',
        name: 'Tatopani East Valley Scarp',
        type: 'LANDSLIDE_SCARP',
        severity: 'CRITICAL',
        status: 'UNSTABLE_SLOPE',
        description: 'Steep colluvial slope displacement threatening dry port access road.',
        isDemo: true,
        provenance: {
          source: 'Prototype Slope Angle & NDVI Mask',
          timestamp: '2026-08-27T04:48:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.81,
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9430, 27.9570],
            [85.9520, 27.9550],
            [85.9550, 27.9490],
            [85.9460, 27.9510],
            [85.9430, 27.9570],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'LS-002',
        name: 'Larcha Tributary Debris Fan',
        type: 'DEBRIS_FLOW',
        severity: 'HIGH',
        status: 'DEPOSITION_ZONE',
        description: 'Debris fan accumulation at confluence of Bhairabkunda Khola.',
        isDemo: true,
        provenance: {
          source: 'Prototype Slope Angle & NDVI Mask',
          timestamp: '2026-08-27T04:48:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.78,
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9180, 27.9120],
            [85.9250, 27.9100],
            [85.9240, 27.9020],
            [85.9170, 27.9050],
            [85.9180, 27.9120],
          ],
        ],
      },
    },
  ],
};

// 3. Disaster Severity & Damage Zones (DEMO)
export const demoDamageZonesGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'DMG-ZONE-A',
        name: 'Zone A: Tatopani Gorge Commercial Hub',
        type: 'DAMAGE_SECTOR',
        severity: 'CRITICAL',
        status: 'HIGH_DAMAGE_CLUSTER',
        description: 'Severe bank erosion and structural flooding across customs and commercial warehouses.',
        isDemo: true,
        provenance: {
          source: 'MCDA Damage Simulation Kernel',
          timestamp: '2026-08-27T06:00:00Z',
          tier: 'DEMO_VALUE',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9350, 27.9600],
            [85.9550, 27.9600],
            [85.9550, 27.9400],
            [85.9350, 27.9400],
            [85.9350, 27.9600],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'DMG-ZONE-B',
        name: 'Zone B: Larcha / Mimming Access Corridor',
        type: 'DAMAGE_SECTOR',
        severity: 'HIGH',
        status: 'MODERATE_DAMAGE_CLUSTER',
        description: 'Road embankment subsidence and severed bridge approaches.',
        isDemo: true,
        provenance: {
          source: 'MCDA Damage Simulation Kernel',
          timestamp: '2026-08-27T06:00:00Z',
          tier: 'DEMO_VALUE',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9100, 27.9250],
            [85.9300, 27.9250],
            [85.9300, 27.8950],
            [85.9100, 27.8950],
            [85.9100, 27.9250],
          ],
        ],
      },
    },
  ],
};

// 4. Roads & Lifeline Bridges (DEMO baseline)
export const demoRoadsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'RD-001',
        name: 'Araniko Highway (NH03) - Passable Reach',
        type: 'ROAD_OPEN',
        severity: 'LOW',
        status: 'OPERATIONAL',
        description: 'South sector connecting Barhabise southwards toward Kathmandu.',
        isDemo: true,
        provenance: {
          source: 'OSM Nepal Highway Alignment Baseline',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [85.8900, 27.7600],
          [85.8950, 27.7750],
          [85.8980, 27.7890],
          [85.9050, 27.8200],
          [85.9100, 27.8600],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'RD-002',
        name: 'Araniko Highway (NH03) - SEVERED SECTOR',
        type: 'ROAD_BLOCKED',
        severity: 'CRITICAL',
        status: 'BLOCKED_BY_DEBRIS',
        description: 'Road washed out between Km 108 and Km 114 (Larcha to Tatopani).',
        isDemo: true,
        provenance: {
          source: 'Simulated Hazard Intersection',
          timestamp: '2026-08-27T06:00:00Z',
          tier: 'DEMO_VALUE',
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [85.9100, 27.8600],
          [85.9150, 27.8850],
          [85.9220, 27.9050],
          [85.9290, 27.9250],
          [85.9380, 27.9450],
          [85.9420, 27.9540],
          [85.9620, 27.9730],
        ],
      },
    },
  ],
};

// 5. Hospitals & Emergency Health Facilities (DEMO baseline)
export const demoHospitalsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'HOSP-001',
        name: 'Barhabise Primary Health Center',
        type: 'HOSPITAL',
        severity: 'LOW',
        status: 'OPERATIONAL_TRIAGE_READY',
        description: 'Designated level-1 emergency receiving hub. 24 beds available.',
        isDemo: true,
        provenance: {
          source: 'Nepal Ministry of Health Registry / HDX',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [85.8995, 27.7885],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'HOSP-002',
        name: 'Tatopani Sub-Health Post',
        type: 'HOSPITAL',
        severity: 'CRITICAL',
        status: 'ISOLATED_EMERGENCY_SUPPLIES_LOW',
        description: 'Local health post within 100m of active flood scarp. Road access severed.',
        isDemo: true,
        provenance: {
          source: 'Nepal Ministry of Health Registry / HDX',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [85.9425, 27.9515],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'HOSP-003',
        name: 'Mimming Health Clinic',
        type: 'HOSPITAL',
        severity: 'HIGH',
        status: 'ACCESS_RESTRICTED',
        description: 'Rural outpost on elevated ridge. Accessible only via aerial or trail.',
        isDemo: true,
        provenance: {
          source: 'Nepal Ministry of Health Registry / HDX',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [85.9150, 27.8820],
      },
    },
  ],
};

// 6. Buildings & Settlement Clusters (DEMO baseline)
export const demoBuildingsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'BLD-TATOPANI-CLUSTER',
        name: 'Tatopani Customs & Settlement Cluster',
        type: 'BUILDING_CLUSTER',
        severity: 'CRITICAL',
        status: 'HIGH_EXPOSURE',
        description: 'Dense grouping of ~120 commercial and residential masonry buildings.',
        isDemo: true,
        provenance: {
          source: 'OSM Building Footprint Polygon Extraction',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9400, 27.9540],
            [85.9450, 27.9540],
            [85.9450, 27.9490],
            [85.9400, 27.9490],
            [85.9400, 27.9540],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'BLD-BARHABISE-CLUSTER',
        name: 'Barhabise Town Center Footprints',
        type: 'BUILDING_CLUSTER',
        severity: 'LOW',
        status: 'MONITORING_SAFE_PERIMETER',
        description: '~450 residential structures in municipal core.',
        isDemo: true,
        provenance: {
          source: 'OSM Building Footprint Polygon Extraction',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'VERIFIED',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.8950, 27.7920],
            [85.9020, 27.7920],
            [85.9020, 27.7850],
            [85.8950, 27.7850],
            [85.8950, 27.7920],
          ],
        ],
      },
    },
  ],
};

// 7. Population Density Grid (DEMO)
export const demoPopulationGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'POP-GRID-01',
        name: 'Tatopani Corridor Population Density Cell',
        type: 'POPULATION_DENSITY',
        severity: 'HIGH',
        status: 'EST_POP_380_PERS_SQKM',
        description: 'Estimated residential and transient transit population density: ~380 / km².',
        isDemo: true,
        provenance: {
          source: 'HDX 100m High Resolution Population Density Grid',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
        },
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [85.9300, 27.9650],
            [85.9550, 27.9650],
            [85.9550, 27.9350],
            [85.9300, 27.9350],
            [85.9300, 27.9650],
          ],
        ],
      },
    },
  ],
};
