import type { StyleSpecification } from 'maplibre-gl';

/**
 * Nepal National Center Coordinates and Initial Viewport
 */
export const NEPAL_NATION_CENTER: [number, number] = [84.1240, 28.3949]; // [lng, lat]
export const NEPAL_NATION_ZOOM = 6.4;
export const NEPAL_NATION_PITCH = 0;
export const NEPAL_NATION_BEARING = 0;

/**
 * Disaster AOI Corridor Coordinates (Bhote Koshi / Tatopani)
 */
export const NEPAL_CENTER: [number, number] = [85.9380, 27.9150]; // [lng, lat]
export const NEPAL_INITIAL_ZOOM = 12;
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
 * Clean Tactical Geographic Basemap Style Definition for MapLibre GL JS
 */
export const DARK_TACTICAL_STYLE: StyleSpecification = {
  version: 8,
  name: 'Himalaya Tactical Geographic',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};
