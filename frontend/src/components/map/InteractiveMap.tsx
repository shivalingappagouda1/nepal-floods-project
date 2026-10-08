import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Map as MapLibreMap, 
  NavigationControl, 
  ScaleControl, 
  type MapMouseEvent, 
  type MapLayerMouseEvent,
  type ErrorEvent 
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapLayerConfig } from '../../types';
import { 
  DARK_TACTICAL_STYLE, 
  NEPAL_CENTER, 
  NEPAL_INITIAL_ZOOM, 
  NEPAL_PITCH, 
  NEPAL_BEARING,
  NEPAL_COUNTRY_BOUNDS 
} from './mapConfig';
import { 
  demoFloodGeoJson, 
  demoLandslideGeoJson, 
  demoDamageZonesGeoJson, 
  demoRoadsGeoJson, 
  demoHospitalsGeoJson, 
  demoBuildingsGeoJson, 
  demoPopulationGeoJson,
  type GeoFeatureProperties 
} from '../../data/demoGeoData';
import { verifiedCaseStudyWaypointsGeoJson } from '../../data/events';
import { MapPopup } from './MapPopup';
import { LoadingState } from '../common/LoadingState';
import { ErrorState } from '../common/ErrorState';
import { 
  Compass, 
  Crosshair, 
  Layers, 
  Sliders, 
  Eye, 
  EyeOff, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { SeverityLegend } from '../tactical/SeverityLegend';

interface InteractiveMapProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  activeAoiName?: string;
  coordinates?: [number, number];
  heightClass?: string;
  showLayerDrawerDefault?: boolean;
  focusedWaypoint?: [number, number] | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  activeAoiName = "Map initial viewport — DEMO / navigation reference",
  coordinates = [27.9520, 85.9410],
  heightClass = "h-full min-h-[500px]",
  showLayerDrawerDefault = true,
  focusedWaypoint,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showLayerDrawer, setShowLayerDrawer] = useState(showLayerDrawerDefault);
  const [showLegend] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const [cursorCoords, setCursorCoords] = useState<[number, number]>(coordinates);

  // Selected feature for popup
  const [selectedFeature, setSelectedFeature] = useState<{
    properties: GeoFeatureProperties;
    coordinates: [number, number];
  } | null>(null);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: DARK_TACTICAL_STYLE,
        center: NEPAL_CENTER,
        zoom: NEPAL_INITIAL_ZOOM,
        pitch: NEPAL_PITCH,
        bearing: NEPAL_BEARING,
        maxBounds: [
          [79.0, 25.0],
          [89.5, 31.5],
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

      map.on('mousemove', (e: MapMouseEvent) => {
        setCursorCoords([e.lngLat.lat, e.lngLat.lng]);
      });

      map.on('load', () => {
        // --- 1. SATELLITE RASTER SOURCE (Visual Prototype Basemap) ---
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

        // --- 2. POPULATION DENSITY GRID SOURCE & LAYER (DEMO) ---
        map.addSource('population-source', {
          type: 'geojson',
          data: demoPopulationGeoJson,
        });

        map.addLayer({
          id: 'population-layer',
          type: 'fill',
          source: 'population-source',
          layout: {
            visibility: 'none',
          },
          paint: {
            'fill-color': '#a855f7',
            'fill-opacity': 0.45,
            'fill-outline-color': '#c084fc',
          },
        });

        // --- 3. DAMAGE ZONES SOURCE & LAYER (DEMO) ---
        map.addSource('damage-source', {
          type: 'geojson',
          data: demoDamageZonesGeoJson,
        });

        map.addLayer({
          id: 'damage-layer',
          type: 'fill',
          source: 'damage-source',
          layout: {
            visibility: 'none',
          },
          paint: {
            'fill-color': [
              'match',
              ['get', 'severity'],
              'CRITICAL', '#dc2626',
              'HIGH', '#ea580c',
              '#eab308'
            ],
            'fill-opacity': 0.4,
            'fill-outline-color': '#f87171',
          },
        });

        // --- 4. FLOOD INUNDATION SOURCE & LAYER (DEMO) ---
        map.addSource('flood-source', {
          type: 'geojson',
          data: demoFloodGeoJson,
        });

        map.addLayer({
          id: 'flood-layer',
          type: 'fill',
          source: 'flood-source',
          layout: {
            visibility: 'visible',
          },
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
          layout: {
            visibility: 'visible',
          },
          paint: {
            'line-color': '#38bdf8',
            'line-width': 2.5,
            'line-dasharray': [2, 1],
          },
        });

        // --- 5. LANDSLIDE & SCARP SOURCE & LAYER (DEMO) ---
        map.addSource('landslide-source', {
          type: 'geojson',
          data: demoLandslideGeoJson,
        });

        map.addLayer({
          id: 'landslide-layer',
          type: 'fill',
          source: 'landslide-source',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'fill-color': '#f97316',
            'fill-opacity': 0.7,
            'fill-outline-color': '#fdba74',
          },
        });

        // --- 6. BUILDINGS SOURCE & LAYER (DEMO) ---
        map.addSource('buildings-source', {
          type: 'geojson',
          data: demoBuildingsGeoJson,
        });

        map.addLayer({
          id: 'buildings-layer',
          type: 'fill',
          source: 'buildings-source',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'fill-color': [
              'match',
              ['get', 'severity'],
              'CRITICAL', '#ef4444',
              '#94a3b8'
            ],
            'fill-opacity': 0.85,
            'fill-outline-color': '#ffffff',
          },
        });

        // --- 7. ROADS SOURCE & LAYER (DEMO) ---
        map.addSource('roads-source', {
          type: 'geojson',
          data: demoRoadsGeoJson,
        });

        map.addLayer({
          id: 'roads-layer',
          type: 'line',
          source: 'roads-source',
          layout: {
            visibility: 'visible',
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'type'],
              'ROAD_BLOCKED', '#ef4444',
              '#10b981'
            ],
            'line-width': [
              'match',
              ['get', 'type'],
              'ROAD_BLOCKED', 4.5,
              3.5
            ],
          },
        });

        // --- 8. HOSPITALS SOURCE & LAYER (DEMO) ---
        map.addSource('hospitals-source', {
          type: 'geojson',
          data: demoHospitalsGeoJson,
        });

        map.addLayer({
          id: 'hospitals-layer',
          type: 'circle',
          source: 'hospitals-source',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'circle-radius': 7,
            'circle-color': [
              'match',
              ['get', 'severity'],
              'CRITICAL', '#ef4444',
              'HIGH', '#f97316',
              '#10b981'
            ],
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#ffffff',
          },
        });

        // --- 9. VERIFIED REAL-WORLD CASE STUDY WAYPOINTS LAYER ---
        map.addSource('case-study-source', {
          type: 'geojson',
          data: verifiedCaseStudyWaypointsGeoJson,
        });

        // Outer beacon ring
        map.addLayer({
          id: 'case-study-glow-layer',
          type: 'circle',
          source: 'case-study-source',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'circle-radius': 14,
            'circle-color': '#38bdf8',
            'circle-opacity': 0.25,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#38bdf8',
          },
        });

        // Core tactical pin
        map.addLayer({
          id: 'case-study-layer',
          type: 'circle',
          source: 'case-study-source',
          layout: {
            visibility: 'visible',
          },
          paint: {
            'circle-radius': 8,
            'circle-color': '#0284c7',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#f1f5f9',
          },
        });

        // --- INTERACTION CLICK HANDLERS ---
        const interactiveLayers = [
          'flood-layer',
          'landslide-layer',
          'damage-layer',
          'buildings-layer',
          'roads-layer',
          'hospitals-layer',
          'population-layer',
          'case-study-layer',
        ];

        interactiveLayers.forEach((layerId) => {
          map.on('click', layerId, (e: MapLayerMouseEvent) => {
            if (!e.features || e.features.length === 0) return;
            const feature = e.features[0];
            const props = feature.properties as any;
            
            let parsedProvenance = props.provenance;
            if (typeof parsedProvenance === 'string') {
              try {
                parsedProvenance = JSON.parse(parsedProvenance);
              } catch {
                parsedProvenance = {
                  source: 'Authoritative Baseline Citation',
                  tier: 'VERIFIED',
                };
              }
            }

            const isFeatureDemo = typeof props.isDemo === 'boolean' 
              ? props.isDemo 
              : (props.isDemo === 'false' ? false : true);

            const featureProps: GeoFeatureProperties = {
              id: props.id || 'FEATURE-ID',
              name: props.name || 'Disaster Entity',
              type: props.type || 'GEOSPATIAL_FEATURE',
              severity: props.severity || 'MODERATE',
              status: props.status || 'ACTIVE',
              description: props.description || 'Geospatial entity in Himalayan transboundary sector.',
              isDemo: isFeatureDemo,
              provenance: parsedProvenance || {
                source: isFeatureDemo ? 'Synthetic / Illustrative Prototype' : 'Authoritative Baseline',
                tier: isFeatureDemo ? 'DEMO_VALUE' : 'VERIFIED',
              },
            };

            setSelectedFeature({
              properties: featureProps,
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            });
          });

          map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
          });
        });

        setIsMapLoaded(true);
      });

      map.on('error', (e: ErrorEvent) => {
        console.warn('MapLibre event error:', e);
      });

      mapRef.current = map;
    } catch (err: any) {
      console.error('Failed to initialize MapLibre GL instance:', err);
      setTimeout(() => {
        setMapError(err.message || 'WebGL acceleration failed to start.');
      }, 0);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Responsive map resize on container dimension change (e.g. Focus Map toggle)
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

  // Handle focusedWaypoint prop changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !focusedWaypoint) return;
    mapRef.current.flyTo({
      center: focusedWaypoint,
      zoom: 14,
      pitch: 45,
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
        case 'population':
          if (map.getLayer('population-layer')) {
            map.setLayoutProperty('population-layer', 'visibility', visibility);
            map.setPaintProperty('population-layer', 'fill-opacity', layer.opacity * 0.45);
          }
          break;
      }
    });
  }, [layers, isMapLoaded]);

  const handleRecenterCorridor = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: NEPAL_CENTER,
      zoom: NEPAL_INITIAL_ZOOM,
      pitch: is3DMode ? NEPAL_PITCH : 0,
      bearing: is3DMode ? NEPAL_BEARING : 0,
      essential: true,
    });
  }, [is3DMode]);

  const handleFitNepalCountry = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(NEPAL_COUNTRY_BOUNDS, {
      padding: 40,
      pitch: 0,
      bearing: 0,
      duration: 1500,
    });
  }, []);

  const handleToggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    mapRef.current.easeTo({
      pitch: nextMode ? NEPAL_PITCH : 0,
      bearing: nextMode ? NEPAL_BEARING : 0,
      duration: 800,
    });
  }, [is3DMode]);

  const handleFocusLocation = useCallback((coords: [number, number]) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: coords,
      zoom: 14.5,
      pitch: 45,
      duration: 1200,
    });
  }, []);

  const handleRetry = () => {
    setMapError(null);
    setIsMapLoaded(false);
  };

  return (
    <div className={`relative w-full ${heightClass} bg-command-bg rounded-lg border border-command-border overflow-hidden flex flex-col font-mono shadow-2xl`}>
      {/* Top Map Tactical Telemetry Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Left HUD readout */}
        <div className="pointer-events-auto bg-command-panel/90 backdrop-blur-md border border-command-border px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-1.5 text-command-accent-glow">
            <Crosshair className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">{activeAoiName}</span>
          </div>
          <span className="text-command-dim">|</span>
          <span className="text-command-muted">
            {cursorCoords[0].toFixed(4)}° N, {cursorCoords[1].toFixed(4)}° E (DEMO Viewport Ref)
          </span>
          <span className="text-command-dim">|</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded font-bold">
            EPSG:32645
          </span>
        </div>

        {/* Right Tactical Map Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={handleRecenterCorridor}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-command-panel/90 text-command-muted border-command-border hover:text-white hover:border-command-accent/50 transition-all backdrop-blur-md flex items-center gap-1.5"
            title="Reset view to initial navigation reference coordinates"
          >
            <RotateCcw className="w-3.5 h-3.5 text-command-accent-glow" />
            <span>AOI CORRIDOR</span>
          </button>

          <button
            onClick={handleFitNepalCountry}
            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold bg-command-panel/90 text-command-muted border-command-border hover:text-white hover:border-command-accent/50 transition-all backdrop-blur-md flex items-center gap-1.5"
            title="Fit full national boundary of Nepal"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEPAL EXTENT</span>
          </button>

          <button
            onClick={handleToggle3D}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all backdrop-blur-md flex items-center gap-1.5 ${
              is3DMode
                ? 'bg-command-accent text-white border-command-accent-glow shadow-tactical-glow'
                : 'bg-command-panel/90 text-command-muted border-command-border hover:text-white'
            }`}
            title="Toggle 3D perspective terrain tilt"
          >
            <span>{is3DMode ? '3D TERRAIN ON' : '2D TOP-DOWN'}</span>
          </button>

          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all backdrop-blur-md flex items-center gap-1.5 ${
              showLayerDrawer
                ? 'bg-command-surface text-command-accent-glow border-command-accent/50'
                : 'bg-command-panel/90 text-command-muted border-command-border hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS ({layers.filter((l) => l.enabled).length})</span>
          </button>
        </div>
      </div>

      {/* Main MapLibre GL Canvas Container */}
      <div className="relative flex-1 w-full h-full bg-[#05080f]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Loading Overlay */}
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 bg-command-bg/90 backdrop-blur-sm z-30 flex items-center justify-center p-6">
            <LoadingState 
              message="INITIALIZING MAPLIBRE GL CANVAS..." 
              subtext="Loading tactical basemap tiles & verified disaster case study layer"
            />
          </div>
        )}

        {/* Error Overlay */}
        {mapError && (
          <div className="absolute inset-0 bg-command-bg/95 z-30 flex items-center justify-center p-6">
            <ErrorState
              title="GEOSPATIAL CANVAS INITIALIZATION ERROR"
              error={mapError}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Selected Feature Popup Inspector */}
        {selectedFeature && (
          <div className="absolute top-14 left-4 z-30 max-w-sm">
            <MapPopup
              properties={selectedFeature.properties}
              coordinates={selectedFeature.coordinates}
              onClose={() => setSelectedFeature(null)}
              onFocus={handleFocusLocation}
            />
          </div>
        )}

        {/* Bottom Left Severity Legend */}
        {showLegend && isMapLoaded && (
          <div className="absolute bottom-6 left-4 z-20 max-w-sm pointer-events-auto">
            <SeverityLegend />
          </div>
        )}

        {/* Right Tactical Layer Drawer */}
        {showLayerDrawer && isMapLoaded && (
          <div className="absolute top-14 right-3 bottom-6 z-20 w-80 bg-command-panel/95 backdrop-blur-md border border-command-border rounded-lg p-3.5 shadow-2xl flex flex-col pointer-events-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/80">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-command-accent-glow" />
                <h4 className="font-mono text-xs font-bold text-command-text uppercase tracking-wider">
                  TACTICAL MAP LAYERS
                </h4>
              </div>
              <span className="text-[10px] text-command-dim">
                {layers.length} LAYERS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {/* Special Verified Case Study Waypoints Pill */}
              <div className="p-2.5 rounded bg-sky-950/40 border border-sky-800/80 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-sky-300 font-bold text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-command-accent-glow" />
                    <span>26 AUG 2026 CASE STUDY</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase font-bold">
                    VERIFIED WAYPOINTS
                  </span>
                </div>
                <p className="text-[10px] text-sky-200/80 font-mono leading-tight">
                  Miteri Bridge, Tatopani Customs, Larcha Confluence & DHM Station 610. Click pin on map to inspect.
                </p>
              </div>

              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-2.5 rounded border transition-all ${
                    layer.enabled
                      ? 'bg-command-surface/70 border-command-accent/40'
                      : 'bg-command-card/40 border-command-border/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <button
                      onClick={() => onToggleLayer(layer.id)}
                      className="flex items-center gap-2 text-left font-mono text-xs font-semibold text-command-text hover:text-command-accent-glow"
                    >
                      {layer.enabled ? (
                        <Eye className="w-3.5 h-3.5 text-command-accent-glow" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-command-dim" />
                      )}
                      <span>{layer.label}</span>
                    </button>

                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${
                        layer.badge === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : layer.badge === 'AI_COMPUTED'
                          ? 'bg-sky-950 text-sky-400 border-sky-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      {layer.badge === 'DEMO_VALUE' ? 'DEMO / ILLUST.' : layer.badge}
                    </span>
                  </div>

                  <p className="text-[10px] text-command-dim font-mono leading-tight mb-2">
                    {layer.description}
                  </p>

                  {/* Opacity Control */}
                  {layer.enabled && (
                    <div className="flex items-center gap-2 pt-1 border-t border-command-border/40">
                      <span className="text-[9px] font-mono text-command-dim">OPACITY:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layer.opacity * 100}
                        onChange={(e) => onOpacityChange(layer.id, Number(e.target.value) / 100)}
                        className="w-full h-1 bg-command-border rounded-lg appearance-none cursor-pointer accent-command-accent"
                      />
                      <span className="text-[9px] font-mono text-command-muted w-6 text-right">
                        {Math.round(layer.opacity * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 mt-2 border-t border-command-border text-[9px] font-mono text-sky-300 text-center">
              * Click any case study waypoint or polygon to inspect.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
