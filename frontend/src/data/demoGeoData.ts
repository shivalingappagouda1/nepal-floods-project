/**
 * HIMALAYA-SHIELD: Geospatial Prototype Dataset
 * 
 * DISCLAIMER / FACTUAL INTEGRITY NOTICE:
 * All spatial geometries below are strictly DEMO / ILLUSTRATIVE datasets for UI & architectural validation.
 * Coordinates are used solely as a navigation reference around the Himalayan transboundary corridor.
 * They are NOT verified ground-truth disaster observations or boundary measurements.
 * 
 * In Steps 4 & 5, real verified datasets with traceable sources will be integrated.
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
  isDemo?: boolean;
  provenance: {
    source: string;
    timestamp: string;
    tier: 'VERIFIED' | 'AI_COMPUTED' | 'DEMO_VALUE';
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
        name: 'Tatopani Gorge Candidate Flood Corridor (DEMO)',
        type: 'FLOOD_INUNDATION',
        severity: 'CRITICAL',
        status: 'DEMO_SIMULATION',
        description: 'Illustrative surge corridor placeholder. Real satellite change detection connects in Step 5.',
        isDemo: true,
        provenance: {
          source: 'Prototype Synthetic Mask (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.75,
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
        name: 'Tatopani East Valley Candidate Scarp (DEMO)',
        type: 'LANDSLIDE_SCARP',
        severity: 'CRITICAL',
        status: 'DEMO_SLOPE_MODEL',
        description: 'Illustrative slope displacement placeholder. Real slope analysis connects in Step 5.',
        isDemo: true,
        provenance: {
          source: 'Prototype Slope Angle Model (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.70,
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
        name: 'Larcha Tributary Debris Fan (DEMO)',
        type: 'DEBRIS_FLOW',
        severity: 'HIGH',
        status: 'DEMO_DEBRIS_ZONE',
        description: 'Illustrative debris accumulation geometry placeholder.',
        isDemo: true,
        provenance: {
          source: 'Prototype Debris Fan Model (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
          confidence: 0.70,
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
        name: 'Sector A: Tatopani Gorge (DEMO / Illustrative)',
        type: 'DAMAGE_SECTOR',
        severity: 'CRITICAL',
        status: 'DEMO_DAMAGE_CLUSTER',
        description: 'Illustrative damage sector bounding box for layout verification.',
        isDemo: true,
        provenance: {
          source: 'Prototype Calibration Grid (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
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
        name: 'Sector B: Larcha Corridor (DEMO / Illustrative)',
        type: 'DAMAGE_SECTOR',
        severity: 'HIGH',
        status: 'DEMO_DAMAGE_CLUSTER',
        description: 'Illustrative damage sector bounding box for layout verification.',
        isDemo: true,
        provenance: {
          source: 'Prototype Calibration Grid (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
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

// 4. Roads & Lifeline Bridges (DEMO)
export const demoRoadsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'RD-001',
        name: 'Araniko Corridor Alignment (DEMO - Open Section)',
        type: 'ROAD_OPEN',
        severity: 'LOW',
        status: 'DEMO_BASELINE',
        description: 'Illustrative road linestring for navigation reference.',
        isDemo: true,
        provenance: {
          source: 'Prototype Road Alignment (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
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
        name: 'Araniko Corridor Alignment (DEMO - Impacted Section)',
        type: 'ROAD_BLOCKED',
        severity: 'CRITICAL',
        status: 'DEMO_DISRUPTION_MODEL',
        description: 'Illustrative blocked road segment for UI testing.',
        isDemo: true,
        provenance: {
          source: 'Prototype Road Alignment (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
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

// 5. Hospitals & Emergency Health Facilities (DEMO)
export const demoHospitalsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'HOSP-001',
        name: 'Barhabise Health Point (DEMO)',
        type: 'HOSPITAL',
        severity: 'LOW',
        status: 'DEMO_FACILITY_MARKER',
        description: 'Illustrative facility reference location for map testing.',
        isDemo: true,
        provenance: {
          source: 'Prototype Facility Registry (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
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
        name: 'Tatopani Health Point (DEMO)',
        type: 'HOSPITAL',
        severity: 'CRITICAL',
        status: 'DEMO_FACILITY_MARKER',
        description: 'Illustrative facility reference location for map testing.',
        isDemo: true,
        provenance: {
          source: 'Prototype Facility Registry (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
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
        name: 'Mimming Health Point (DEMO)',
        type: 'HOSPITAL',
        severity: 'HIGH',
        status: 'DEMO_FACILITY_MARKER',
        description: 'Illustrative facility reference location for map testing.',
        isDemo: true,
        provenance: {
          source: 'Prototype Facility Registry (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
        },
      },
      geometry: {
        type: 'Point',
        coordinates: [85.9150, 27.8820],
      },
    },
  ],
};

// 6. Buildings & Settlement Clusters (DEMO)
export const demoBuildingsGeoJson: FeatureCollection<Geometry, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'BLD-TATOPANI-CLUSTER',
        name: 'Tatopani Settlement Cluster (DEMO)',
        type: 'BUILDING_CLUSTER',
        severity: 'CRITICAL',
        status: 'DEMO_POLYGONS',
        description: 'Illustrative cluster polygon for structure layer rendering.',
        isDemo: true,
        provenance: {
          source: 'Prototype Footprint Cluster (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
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
        name: 'Barhabise Settlement Cluster (DEMO)',
        type: 'BUILDING_CLUSTER',
        severity: 'LOW',
        status: 'DEMO_POLYGONS',
        description: 'Illustrative cluster polygon for structure layer rendering.',
        isDemo: true,
        provenance: {
          source: 'Prototype Footprint Cluster (DEMO / ILLUSTRATIVE)',
          timestamp: '2026-08-27T00:00:00Z',
          tier: 'DEMO_VALUE',
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
        name: 'Corridor Population Density Cell (DEMO)',
        type: 'POPULATION_DENSITY',
        severity: 'HIGH',
        status: 'DEMO_GRID_CELL',
        description: 'Illustrative population density cell for demographic layer styling.',
        isDemo: true,
        provenance: {
          source: 'Prototype Density Grid (DEMO / ILLUSTRATIVE)',
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
