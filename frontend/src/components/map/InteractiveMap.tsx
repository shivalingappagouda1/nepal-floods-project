import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Map as MapLibreMap, 
  NavigationControl, 
  ScaleControl
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerConfig } from '../../types';
import { 
  DARK_TACTICAL_STYLE, 
  NEPAL_NATION_CENTER,
  NEPAL_NATION_ZOOM,
  NEPAL_NATION_PITCH,
  NEPAL_NATION_BEARING,
  NEPAL_CENTER, 
  NEPAL_INITIAL_ZOOM, 
  NEPAL_PITCH, 
  NEPAL_BEARING
} from './mapConfig';
import { 
  demoFloodGeoJson, 
  demoLandslideGeoJson, 
  demoDamageZonesGeoJson, 
  demoRoadsGeoJson, 
  demoHospitalsGeoJson, 
  demoBuildingsGeoJson, 
  type GeoFeatureProperties 
} from '../../data/demoGeoData';
import { verifiedCaseStudyWaypointsGeoJson } from '../../data/events';
import { 
  nepalProvincesGeoJson, 
  nepalNationalBoundaryGeoJson, 
  type ProvinceProperties 
} from '../../data/nepalProvincesGeoJson';
import type { SearchableLocation } from '../../data/searchLocations';
import { MapPopup } from './MapPopup';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { 
  Compass, 
  Layers
} from 'lucide-react';
import { HumanMapLegend } from '../tactical/HumanMapLegend';

interface InteractiveMapProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange?: (id: string, opacity: number) => void;
  activeAoiName?: string;
  coordinates?: [number, number];
  heightClass?: string;
  showLayerDrawerDefault?: boolean;
  focusedWaypoint?: [number, number] | null;
  selectedLocation?: SearchableLocation | null;
  onSelectProvince?: (prov: ProvinceProperties) => void;
  initialViewMode?: 'NATION' | 'CORRIDOR';
}

function createCirclePolygon(center: [number, number], radiusKm: number, points = 48): [number, number][] {
  const coords: [number, number][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((center[1] * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]);
  return coords;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange: _onOpacityChange,
  activeAoiName: _activeAoiName = "Bhote Koshi Transboundary Corridor",
  coordinates: _coordinates = [84.1240, 28.3949],
  heightClass = "h-full min-h-[560px]",
  showLayerDrawerDefault = false,
  focusedWaypoint,
  selectedLocation,
  onSelectProvince,
  initialViewMode = 'NATION',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showLayerDrawer, setShowLayerDrawer] = useState(showLayerDrawerDefault);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Selected feature for popup
  const [selectedFeature, setSelectedFeature] = useState<{
    properties: GeoFeatureProperties;
    coordinates: [number, number];
  } | null>(null);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const initialCenter = initialViewMode === 'NATION' ? NEPAL_NATION_CENTER : NEPAL_CENTER;
      const initialZoom = initialViewMode === 'NATION' ? NEPAL_NATION_ZOOM : NEPAL_INITIAL_ZOOM;
      const initialPitch = initialViewMode === 'NATION' ? NEPAL_NATION_PITCH : NEPAL_PITCH;
      const initialBearing = initialViewMode === 'NATION' ? NEPAL_NATION_BEARING : NEPAL_BEARING;

      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: DARK_TACTICAL_STYLE,
        center: initialCenter,
        zoom: initialZoom,
        pitch: initialPitch,
        bearing: initialBearing,
        maxBounds: [
          [78.5, 24.5],
          [90.0, 32.5],
        ],
        attributionControl: false,
      });

      map.addControl(
        new NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'top-right'
      );

      map.addControl(
        new ScaleControl({
          maxWidth: 150,
          unit: 'metric',
        }),
        'bottom-left'
      );

      map.on('load', () => {
        // --- 1. NEPAL NATIONAL BOUNDARY SOURCE & LAYER ---
        map.addSource('nepal-national-source', {
          type: 'geojson',
          data: nepalNationalBoundaryGeoJson,
        });

        map.addLayer({
          id: 'nepal-national-outline',
          type: 'line',
          source: 'nepal-national-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2.5,
            'line-opacity': 0.9,
          },
        });

        // --- 2. NEPAL 7 PROVINCES SOURCE & LAYERS ---
        map.addSource('nepal-provinces-source', {
          type: 'geojson',
          data: nepalProvincesGeoJson,
        });

        map.addLayer({
          id: 'provinces-fill',
          type: 'fill',
          source: 'nepal-provinces-source',
          paint: {
            'fill-color': [
              'match',
              ['get', 'id'],
              'PROV-3', 'rgba(225, 29, 72, 0.18)', // Bagmati (Disaster Zone)
              'PROV-1', 'rgba(245, 158, 11, 0.08)', // Koshi
              'PROV-4', 'rgba(245, 158, 11, 0.08)', // Gandaki
              'rgba(56, 189, 248, 0.04)',
            ],
            'fill-opacity': 0.8,
          },
        });

        map.addLayer({
          id: 'provinces-line',
          type: 'line',
          source: 'nepal-provinces-source',
          paint: {
            'line-color': '#0284c7',
            'line-width': 1.5,
            'line-dasharray': [3, 1.5],
            'line-opacity': 0.85,
          },
        });

        // Province hover interaction
        map.on('mousemove', 'provinces-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const provName = e.features[0].properties?.name;
            setHoveredProvince(provName);
            map.getCanvas().style.cursor = 'pointer';
          }
        });

        map.on('mouseleave', 'provinces-fill', () => {
          setHoveredProvince(null);
          map.getCanvas().style.cursor = '';
        });

        map.on('click', 'provinces-fill', (e) => {
          if (e.features && e.features.length > 0) {
            const props = e.features[0].properties as any;
            onSelectProvince?.(props);
          }
        });

        // --- 3. SATELLITE RASTER SOURCE ---
        map.addSource('satellite-tiles', {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
        });

        map.addLayer({
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite-tiles',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'raster-opacity': 0.85,
          },
        });

        // --- 4. FLOOD INUNDATION SOURCE & LAYER ---
        map.addSource('flood-source', {
          type: 'geojson',
          data: demoFloodGeoJson,
        });

        map.addLayer({
          id: 'flood-layer',
          type: 'fill',
          source: 'flood-source',
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.75,
            'fill-outline-color': '#38bdf8',
          },
        });

        map.addLayer({
          id: 'flood-outline-layer',
          type: 'line',
          source: 'flood-source',
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2.5,
          },
        });

        // --- 5. LANDSLIDE & DEBRIS FLOW SOURCE & LAYER ---
        map.addSource('landslide-source', {
          type: 'geojson',
          data: demoLandslideGeoJson,
        });

        map.addLayer({
          id: 'landslide-layer',
          type: 'fill',
          source: 'landslide-source',
          paint: {
            'fill-color': '#f97316',
            'fill-opacity': 0.7,
            'fill-outline-color': '#fdba74',
          },
        });

        // --- 6. DAMAGE ZONES SOURCE & LAYER ---
        map.addSource('damage-source', {
          type: 'geojson',
          data: demoDamageZonesGeoJson,
        });

        map.addLayer({
          id: 'damage-layer',
          type: 'fill',
          source: 'damage-source',
          layout: { visibility: 'none' },
          paint: {
            'fill-color': '#dc2626',
            'fill-opacity': 0.4,
          },
        });

        // --- 7. INFRASTRUCTURE: ROADS, BUILDINGS, HOSPITALS ---
        map.addSource('buildings-source', { type: 'geojson', data: demoBuildingsGeoJson });
        map.addLayer({
          id: 'buildings-layer',
          type: 'fill',
          source: 'buildings-source',
          paint: { 'fill-color': '#fbbf24', 'fill-opacity': 0.85 },
        });

        map.addSource('roads-source', { type: 'geojson', data: demoRoadsGeoJson });
        map.addLayer({
          id: 'roads-layer',
          type: 'line',
          source: 'roads-source',
          paint: { 'line-color': '#38bdf8', 'line-width': 3 },
        });

        map.addSource('hospitals-source', { type: 'geojson', data: demoHospitalsGeoJson });
        map.addLayer({
          id: 'hospitals-layer',
          type: 'circle',
          source: 'hospitals-source',
          paint: {
            'circle-radius': 6,
            'circle-color': '#10b981',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        // --- 8. VERIFIED CASE STUDY WAYPOINTS ---
        map.addSource('case-study-source', {
          type: 'geojson',
          data: verifiedCaseStudyWaypointsGeoJson,
        });

        map.addLayer({
          id: 'case-study-layer',
          type: 'circle',
          source: 'case-study-source',
          paint: {
            'circle-radius': 7,
            'circle-color': '#e11d48',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        // --- 9. ACTIVE DISASTER PULSE BEACON OVER SINDHUPALCHOK ---
        map.addSource('active-disaster-beacon-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { title: 'ACTIVE SURGE CORRIDOR' },
                geometry: {
                  type: 'Point',
                  coordinates: [85.9410, 27.9520],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: 'disaster-pulse-ring',
          type: 'circle',
          source: 'active-disaster-beacon-source',
          paint: {
            'circle-radius': 14,
            'circle-color': '#f43f5e',
            'circle-opacity': 0.4,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#f43f5e',
          },
        });

        // --- 10. DYNAMIC SELECTED LOCATION HIGHLIGHT SOURCE & LAYER ---
        map.addSource('selected-location-highlight-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: 'selected-location-fill',
          type: 'fill',
          source: 'selected-location-highlight-source',
          paint: {
            'fill-color': '#a855f7',
            'fill-opacity': 0.35,
            'fill-outline-color': '#c084fc',
          },
        });

        map.addLayer({
          id: 'selected-location-line',
          type: 'line',
          source: 'selected-location-highlight-source',
          paint: {
            'line-color': '#c084fc',
            'line-width': 3,
            'line-dasharray': [2, 1],
          },
        });

        // Click on waypoints
        map.on('click', 'case-study-layer', (e) => {
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          const props = feature.properties as any;
          setSelectedFeature({
            properties: props,
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
        });

        setIsMapLoaded(true);
      });

      mapRef.current = map;
    } catch (err: any) {
      setMapError(err.message || 'WebGL acceleration failed to start.');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initialViewMode, onSelectProvince]);

  // Responsive map resize on container dimension change
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Update selected location highlight polygon & flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const source = map.getSource('selected-location-highlight-source') as any;
    if (!source) return;

    if (selectedLocation) {
      const radius = selectedLocation.searchRadiusKm || 2.5;
      const circleCoords = createCirclePolygon(selectedLocation.coordinates, radius);

      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: selectedLocation.name,
              label: 'SEARCH AREA — NAVIGATION REFERENCE',
            },
            geometry: {
              type: 'Polygon',
              coordinates: [circleCoords],
            },
          },
        ],
      });

      map.flyTo({
        center: selectedLocation.coordinates,
        zoom: selectedLocation.zoom || 13,
        pitch: 30,
        duration: 1500,
        essential: true,
      });
    } else {
      source.setData({
        type: 'FeatureCollection',
        features: [],
      });
    }
  }, [selectedLocation, isMapLoaded]);

  // Handle focusedWaypoint prop changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !focusedWaypoint) return;
    mapRef.current.flyTo({
      center: focusedWaypoint,
      zoom: 14,
      pitch: 40,
      duration: 1200,
    });
  }, [focusedWaypoint, isMapLoaded]);

  // Synchronize Layer Visibility & Opacity Props
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    layers.forEach((layer) => {
      const visibility = layer.enabled ? 'visible' : 'none';

      switch (layer.id) {
        case 'satellite':
          if (map.getLayer('satellite-layer')) {
            map.setLayoutProperty('satellite-layer', 'visibility', visibility);
            map.setPaintProperty('satellite-layer', 'raster-opacity', layer.opacity);
          }
          break;
        case 'flood':
          if (map.getLayer('flood-layer') && map.getLayer('flood-outline-layer')) {
            map.setLayoutProperty('flood-layer', 'visibility', visibility);
            map.setLayoutProperty('flood-outline-layer', 'visibility', visibility);
            map.setPaintProperty('flood-layer', 'fill-opacity', layer.opacity * 0.85);
          }
          break;
        case 'landslide':
          if (map.getLayer('landslide-layer')) {
            map.setLayoutProperty('landslide-layer', 'visibility', visibility);
            map.setPaintProperty('landslide-layer', 'fill-opacity', layer.opacity * 0.7);
          }
          break;
        case 'damage':
          if (map.getLayer('damage-layer')) {
            map.setLayoutProperty('damage-layer', 'visibility', visibility);
            map.setPaintProperty('damage-layer', 'fill-opacity', layer.opacity * 0.5);
          }
          break;
        case 'buildings':
          if (map.getLayer('buildings-layer')) {
            map.setLayoutProperty('buildings-layer', 'visibility', visibility);
            map.setPaintProperty('buildings-layer', 'fill-opacity', layer.opacity * 0.85);
          }
          break;
        case 'roads':
          if (map.getLayer('roads-layer')) {
            map.setLayoutProperty('roads-layer', 'visibility', visibility);
          }
          break;
        case 'hospitals':
          if (map.getLayer('hospitals-layer')) {
            map.setLayoutProperty('hospitals-layer', 'visibility', visibility);
          }
          break;
      }
    });
  }, [layers, isMapLoaded]);

  const handleFitNepalCountry = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: NEPAL_NATION_CENTER,
      zoom: NEPAL_NATION_ZOOM,
      pitch: 0,
      bearing: 0,
      duration: 1200,
    });
  }, []);

  const handleFocusDisasterCorridor = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: NEPAL_CENTER,
      zoom: NEPAL_INITIAL_ZOOM,
      pitch: NEPAL_PITCH,
      bearing: NEPAL_BEARING,
      duration: 1500,
    });
  }, []);

  return (
    <div className={`relative w-full ${heightClass} bg-command-bg rounded-xl overflow-hidden border border-command-border shadow-2xl`}>
      {/* Loading & Error Overlays */}
      {!isMapLoaded && !mapError && <LoadingState message="Initializing Geographic MapLibre Engine..." />}
      {mapError && <ErrorState error={mapError} onRetry={() => setIsMapLoaded(false)} />}

      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Hovered Province Badge */}
      {hoveredProvince && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-command-card/95 border border-sky-500 text-xs font-mono text-sky-300 font-bold shadow-tactical-glow pointer-events-none animate-in fade-in">
          {hoveredProvince} (Click to inspect)
        </div>
      )}

      {/* Floating Tactical Map Controls Toolbar */}
      <div className="absolute top-4 right-14 z-10 flex items-center gap-1.5 bg-command-card/90 backdrop-blur-md border border-command-border p-1 rounded-lg shadow-xl font-mono text-xs">
        <button
          onClick={handleFitNepalCountry}
          className="px-2.5 py-1 rounded bg-command-surface hover:bg-command-border text-command-text hover:text-command-accent-glow font-bold flex items-center gap-1.5 transition-colors"
          title="Fit full Nepal nation view"
        >
          <Compass className="w-3.5 h-3.5 text-command-accent-glow" />
          <span>NEPAL</span>
        </button>

        <button
          onClick={handleFocusDisasterCorridor}
          className="px-2.5 py-1 rounded bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold flex items-center gap-1.5 transition-colors"
          title="Focus on active Bhote Koshi / Tatopani disaster corridor"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>DISASTER ZONE</span>
        </button>

        <button
          onClick={() => setShowLayerDrawer(!showLayerDrawer)}
          className={`p-1.5 rounded transition-colors ${
            showLayerDrawer
              ? 'bg-command-accent text-white shadow-sm'
              : 'bg-command-surface text-command-muted hover:text-command-text'
          }`}
          title="Toggle GIS layers"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Human-Friendly Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <HumanMapLegend />
      </div>

      {/* Layer Control Drawer */}
      {showLayerDrawer && (
        <div className="absolute top-16 right-4 z-20 w-64 bg-command-card/95 backdrop-blur-md border border-command-border rounded-xl p-3 font-mono shadow-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-command-border">
            <span className="font-bold text-command-text uppercase">GIS LAYERS</span>
            <button
              onClick={() => setShowLayerDrawer(false)}
              className="text-command-dim hover:text-command-text text-[10px]"
            >
              CLOSE
            </button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {layers.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-1.5 rounded bg-command-panel/70 border border-command-border"
              >
                <span className="text-[11px] text-command-muted truncate">{l.label.replace(' (DEMO)', '')}</span>
                <button
                  onClick={() => onToggleLayer(l.id)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    l.enabled
                      ? 'bg-sky-950 text-sky-300 border border-sky-700'
                      : 'bg-command-surface text-command-dim'
                  }`}
                >
                  {l.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Popup when Waypoint is Clicked */}
      {selectedFeature && (
        <MapPopup
          properties={selectedFeature.properties}
          coordinates={selectedFeature.coordinates}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </div>
  );
};
