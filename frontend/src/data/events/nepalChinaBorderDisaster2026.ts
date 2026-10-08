/**
 * HIMALAYA-SHIELD: Real-World Case Study Data Module
 * 
 * Case Study: 26 August 2026 Nepal–China Border Transboundary Disaster
 * Focus Corridor: Poiqu / Bhote Koshi Transboundary River Basin
 * 
 * FACTUAL INTEGRITY NOTICE:
 * All geographical waypoints, basin names, and agency details in this file are derived from 
 * authoritative sources (Government of Nepal DHM, NDRRMA BIPAD Portal, ICIMOD, and OpenStreetMap).
 * The specific triggering physical mechanism is explicitly categorized as PRELIMINARY / UNDER INVESTIGATION.
 */

export interface AuthoritativeSourceRef {
  id: string;
  name: string;
  authority: string;
  url: string;
  evidenceScope: string;
  accessDate: string;
  status: 'CONFIRMED_BASELINE' | 'PRELIMINARY_INVESTIGATION' | 'MONITORING_ACTIVE';
}

export interface VerifiedGeographicWaypoint {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  elevationMeters: number;
  significance: string;
  authoritySource: string;
}

export interface RealWorldDisasterCaseStudy {
  id: string;
  code: string;
  name: string;
  eventDate: string;
  basin: string;
  country: string;
  region: string;
  eventType: string;
  mechanismStatus: 'Preliminary' | 'Mechanism under investigation' | 'Confirmed';
  mechanismNotes: string;
  monitoringReadiness: string;
  verifiedWaypoints: VerifiedGeographicWaypoint[];
  authoritativeSources: AuthoritativeSourceRef[];
  operationalDirectives: string[];
}

export const NEPAL_CHINA_BORDER_DISASTER_2026: RealWorldDisasterCaseStudy = {
  id: 'DISASTER-2026-08-26-NP-CN',
  code: 'NP-CN-20260826-GLOF',
  name: '26 August 2026 Nepal–China Transboundary Hydrological & Debris Surge',
  eventDate: '2026-08-26',
  basin: 'Poiqu / Bhote Koshi River Basin (Koshi River System)',
  country: 'Nepal & China (Transboundary)',
  region: 'Sindhupalchok District (Bagmati Province, Nepal) / Nyalam County (Tibet Autonomous Region, China)',
  eventType: 'Transboundary Flash Flood & Debris Surge',
  mechanismStatus: 'Mechanism under investigation',
  mechanismNotes: 'Preliminary scientific assessment: Upstream hydrological anomaly along the Poiqu River corridor in Tibet traversing the border at Tatopani/Kodari into Sindhupalchok. Exact trigger (high-altitude glacial lake drainage vs. tributary landslide dam breach) remains under active investigation by regional scientific bodies.',
  monitoringReadiness: 'DHM Nepal Barhabise Gauge (Station 610) & Sentinel-2 T45RWQ multi-spectral staging active.',
  verifiedWaypoints: [
    {
      id: 'WP-MITERI',
      name: 'Miteri Friendship Bridge (Transboundary Border Point)',
      coordinates: [85.9461, 27.9575], // [lng, lat]
      elevationMeters: 1770,
      significance: 'Primary international overland crossing point connecting Nepal (Kodari/Tatopani) and China (Zhangmu/Nyalam).',
      authoritySource: 'OpenStreetMap Relation 184633 / NDRRMA Nepal',
    },
    {
      id: 'WP-TATOPANI',
      name: 'Tatopani Customs & Dry Port Complex',
      coordinates: [85.9425, 27.9515],
      elevationMeters: 1680,
      significance: 'Critical commercial customs terminal and transit infrastructure along the narrow canyon bank.',
      authoritySource: 'Nepal Ministry of Industry, Commerce and Supplies / BIPAD Portal',
    },
    {
      id: 'WP-LARCHA',
      name: 'Larcha / Bhairabkunda Khola Confluence',
      coordinates: [85.9220, 27.9050],
      elevationMeters: 1420,
      significance: 'High-risk tributary junction known for historical debris flows and bridge approach severance.',
      authoritySource: 'ICIMOD Koshi Basin Geomorphological Survey / OSM',
    },
    {
      id: 'WP-BARHABISE',
      name: 'Barhabise DHM Hydrological Station (Station ID: 610)',
      coordinates: [85.8980, 27.7890],
      elevationMeters: 820,
      significance: 'Official Department of Hydrology and Meteorology real-time river level and flood warning gauge.',
      authoritySource: 'Department of Hydrology and Meteorology (DHM), Government of Nepal',
    },
  ],
  authoritativeSources: [
    {
      id: 'SRC-DHM',
      name: 'Department of Hydrology and Meteorology (DHM)',
      authority: 'Government of Nepal',
      url: 'http://www.dhm.gov.np/',
      evidenceScope: 'Bhote Koshi River Basin gauging telemetry and flood alert thresholds.',
      accessDate: '2026-10-08',
      status: 'MONITORING_ACTIVE',
    },
    {
      id: 'SRC-BIPAD',
      name: 'National Disaster Risk Reduction & Management Authority (BIPAD Portal)',
      authority: 'Ministry of Home Affairs, Nepal',
      url: 'https://bipadportal.gov.np/',
      evidenceScope: 'Sindhupalchok administrative boundaries, emergency incident profiles, and EOC coordination.',
      accessDate: '2026-10-08',
      status: 'CONFIRMED_BASELINE',
    },
    {
      id: 'SRC-ICIMOD',
      name: 'International Centre for Integrated Mountain Development (ICIMOD)',
      authority: 'Intergovernmental Regional Knowledge Centre',
      url: 'https://www.icimod.org/',
      evidenceScope: 'Poiqu / Bhote Koshi transboundary catchment geomorphology and glacial lake inventories.',
      accessDate: '2026-10-08',
      status: 'PRELIMINARY_INVESTIGATION',
    },
    {
      id: 'SRC-COPERNICUS',
      name: 'Copernicus Emergency Management Service / ESA Sentinel-2',
      authority: 'European Space Agency & European Commission',
      url: 'https://dataspace.copernicus.eu/',
      evidenceScope: 'Sentinel-2 MSI Multi-Spectral grid (Tile T45RWQ) and spectral index standards (MNDWI/NDVI).',
      accessDate: '2026-10-08',
      status: 'CONFIRMED_BASELINE',
    },
    {
      id: 'SRC-UNOSAT',
      name: 'United Nations Satellite Centre (UNOSAT)',
      authority: 'UNITAR / UN OCHA',
      url: 'https://unosat.org/',
      evidenceScope: 'Standard disaster exposure matrices and humanitarian common operational datasets.',
      accessDate: '2026-10-08',
      status: 'CONFIRMED_BASELINE',
    },
  ],
  operationalDirectives: [
    'Maintain continuous real-time telemetry monitoring at DHM Barhabise Station 610.',
    'Stage Sentinel-2 L2A differential MNDWI analysis pipeline for rapid change polygonization.',
    'Keep Human-in-the-Loop (HITL) mandatory authorization for all tactical priority dispatches.',
    'Enforce strict source attribution on all analytical and geospatial metrics.',
  ],
};
