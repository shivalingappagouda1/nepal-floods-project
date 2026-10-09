import type { StyleSpecification } from 'maplibre-gl';

/**
 * Nepal National Center Coordinates and Initial Viewport
 */
export const NEPAL_NATION_CENTER: [number, number] = [84.1240, 28.3949]; // [lng, lat]
export const NEPAL_NATION_ZOOM = 6.6;
export const NEPAL_NATION_PITCH = 0;
export const NEPAL_NATION_BEARING = 0;

/**
 * Disaster AOI Corridor Coordinates (Bhote Koshi / Tatopani)
 */
export const NEPAL_CENTER: [number, number] = [85.9380, 27.9150]; // [lng, lat]
export const NEPAL_INITIAL_ZOOM = 12.2;
export const NEPAL_PITCH = 35;
export const NEPAL_BEARING = -15;

export const NEPAL_COUNTRY_BOUNDS: [[number, number], [number, number]] = [
  [80.0586, 26.3475], // Southwest [lng, lat]
  [88.2015, 30.4470], // Northeast [lng, lat]
];

export const TRANSBOUNDARY_AOI_BOUNDS: [[number, number], [number, number]] = [
  [85.8500, 27.7600],
  [86.0200, 27.9850],
];

/**
 * Configurable Environment Overrides (keeps keys/URLs out of source control)
 */
const ENV_DARK_STYLE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAP_STYLE_DARK
  ? import.meta.env.VITE_MAP_STYLE_DARK
  : null;

const ENV_STREETS_STYLE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAP_STYLE_STREETS
  ? import.meta.env.VITE_MAP_STYLE_STREETS
  : null;

/**
 * OpenFreeMap Dark Tactical Vector Style URL
 * OpenFreeMap is an open-source, CC-BY / ODbL licensed, MapLibre-native vector tile provider
 * hosted via Cloudflare CDN with no API key requirement and no watermarking.
 */
export const DARK_TACTICAL_STYLE_URL = ENV_DARK_STYLE || 'https://tiles.openfreemap.org/styles/dark';

/**
 * OpenFreeMap Standard / Liberty Vector Style URL
 */
export const STREETS_STYLE_URL = ENV_STREETS_STYLE || 'https://tiles.openfreemap.org/styles/liberty';

/**
 * Offline / Local Fallback Raster Dark Style
 * Used if external vector style endpoints are unreachable.
 * Uses standard OpenStreetMap raster tiles with dark tactical CSS filter styling (no CARTO / no watermarks).
 */
export const DARK_TACTICAL_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  name: 'Himalaya Dark Tactical (Fallback)',
  sources: {
    'osm-dark-fallback': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-dark-fallback-layer',
      type: 'raster',
      source: 'osm-dark-fallback',
      minzoom: 0,
      maxzoom: 19,
      paint: {
        'raster-brightness-max': 0.65,
        'raster-contrast': 0.3,
        'raster-saturation': -0.75,
      },
    },
  ],
};

/**
 * High-Resolution Satellite Basemap Style Definition
 * Combines Esri World Imagery (high-res satellite) with Esri World Boundaries and Places
 * reference labels. Replaces previous CARTO dark_only_labels to eliminate API-key watermarks.
 */
export const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  name: 'Himalaya Satellite Imagery',
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    },
    'esri-reference-labels': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Boundaries/Labels &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'satellite-base-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: 'satellite-labels-layer',
      type: 'raster',
      source: 'esri-reference-labels',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

/**
 * Standard Light / Streets Basemap Fallback Style
 */
export const STREETS_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  name: 'Himalaya Standard Streets',
  sources: {
    'osm-streets': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-streets-layer',
      type: 'raster',
      source: 'osm-streets',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/**
 * Documented Legal Attributions for Himalaya-Shield Map Views
 */
export const BASEMAP_ATTRIBUTION_HTML = {
  dark: '&copy; <a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  satellite: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and GIS User Community',
  streets: '&copy; <a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  boundaries: 'Administrative Boundaries: geoBoundaries Nepal (Survey Department)',
};
