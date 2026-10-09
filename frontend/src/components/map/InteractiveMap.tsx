import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Map as MapLibreMap, 
  NavigationControl, 
  ScaleControl,
  LngLatBounds,
  setWorkerUrl
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
if (typeof window !== 'undefined') {
  setWorkerUrl('https://unpkg.com/maplibre-gl@6.13.0/dist/maplibre-gl-worker.mjs');
}
import type { 
  MapLayerConfig, 
  BasemapStyle, 
  LanguageMode, 
  LiveEarthquakeEvent, 
  LiveWeatherStation 
} from '../../types';
import { 
  DARK_TACTICAL_STYLE_URL,
  STREETS_STYLE_URL,
  DARK_TACTICAL_FALLBACK_STYLE,
  SATELLITE_STYLE,
  BASEMAP_ATTRIBUTION_HTML,
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
import { nepalDistrictsGeoJson } from '../../data/nepalDistrictsGeoJson';
import type { SearchableLocation } from '../../data/searchLocations';
import { MapPopup } from './MapPopup';
import { LoadingState } from '../common/LoadingState';
import { 
  Layers,
  Globe,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Info,
  ShieldAlert,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { HumanMapLegend } from '../tactical/HumanMapLegend';
import { I18N } from '../../data/i18n';

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
  language?: LanguageMode;
  liveEarthquakes?: LiveEarthquakeEvent[];
  liveWeatherStations?: LiveWeatherStation[];
  isMapFocused?: boolean;
  onToggleFocusMap?: () => void;
  onBasemapStatusChange?: (status: 'OPERATIONAL' | 'DEGRADED' | 'DISCONNECTED', provider: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange: _onOpacityChange,
  activeAoiName: _activeAoiName = "Bhote Koshi Transboundary Corridor",
  coordinates: _coordinates = [84.1240, 28.3949],
  heightClass = "h-full min-h-[580px]",
  showLayerDrawerDefault = false,
  focusedWaypoint,
  selectedLocation,
  onSelectProvince,
  initialViewMode = 'NATION',
  language = 'en',
  liveEarthquakes = [],
  liveWeatherStations = [],
  isMapFocused = false,
  onToggleFocusMap,
  onBasemapStatusChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapTileError, setMapTileError] = useState<string | null>(null);
  const [useFallbackRaster, setUseFallbackRaster] = useState(false);
  const [showLayerDrawer, setShowLayerDrawer] = useState(showLayerDrawerDefault);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [basemap, setBasemap] = useState<BasemapStyle>('dark');
  const [selectedPinInfo, setSelectedPinInfo] = useState<{
    title: string;
    subtitle: string;
    badge: string;
    details: string;
    link?: string;
    coordinates: [number, number];
  } | null>(null);

  const t = I18N[language] || I18N.en;

  // Selected feature for generic waypoint popup
  const [selectedFeature, setSelectedFeature] = useState<{
    properties: GeoFeatureProperties;
    coordinates: [number, number];
  } | null>(null);

  const getProviderName = useCallback((style: BasemapStyle, fallback: boolean) => {
    if (fallback) return 'OpenStreetMap Dark Raster (Offline Fallback)';
    switch (style) {
      case 'satellite':
        return 'Esri World Imagery (Satellite) + Boundaries';
      case 'streets':
        return 'OpenFreeMap Liberty (Vector)';
      default:
        return 'OpenFreeMap Dark Tactical (Vector)';
    }
  }, []);

  const getBasemapStyle = useCallback((style: BasemapStyle, fallback: boolean) => {
    if (fallback) {
      return style === 'satellite' ? SATELLITE_STYLE : DARK_TACTICAL_FALLBACK_STYLE;
    }
    switch (style) {
      case 'satellite':
        return SATELLITE_STYLE;
      case 'streets':
        return STREETS_STYLE_URL;
      default:
        return DARK_TACTICAL_STYLE_URL;
    }
  }, []);

  // Sync visibility of all thematic layers
  const syncAllLayers = useCallback((map: MapLibreMap, layerConfigs: MapLayerConfig[]) => {
    layerConfigs.forEach((layer) => {
      const visibility = layer.enabled ? 'visible' : 'none';

      switch (layer.id) {
        case 'provinces':
          if (map.getLayer('provinces-fill')) map.setLayoutProperty('provinces-fill', 'visibility', visibility);
          if (map.getLayer('provinces-line')) map.setLayoutProperty('provinces-line', 'visibility', visibility);
          break;
        case 'districts':
          if (map.getLayer('nepal-districts-line')) map.setLayoutProperty('nepal-districts-line', 'visibility', visibility);
          break;
        case 'earthquakes':
          if (map.getLayer('live-earthquakes-circle')) map.setLayoutProperty('live-earthquakes-circle', 'visibility', visibility);
          break;
        case 'weather':
          if (map.getLayer('live-weather-circle')) map.setLayoutProperty('live-weather-circle', 'visibility', visibility);
          break;
        case 'flood':
          if (map.getLayer('flood-layer')) map.setLayoutProperty('flood-layer', 'visibility', visibility);
          if (map.getLayer('flood-outline-layer')) map.setLayoutProperty('flood-outline-layer', 'visibility', visibility);
          break;
        case 'landslide':
          if (map.getLayer('landslide-layer')) map.setLayoutProperty('landslide-layer', 'visibility', visibility);
          break;
        case 'damage':
          if (map.getLayer('damage-layer')) map.setLayoutProperty('damage-layer', 'visibility', visibility);
          break;
        case 'buildings':
          if (map.getLayer('buildings-layer')) map.setLayoutProperty('buildings-layer', 'visibility', visibility);
          break;
        case 'roads':
          if (map.getLayer('roads-layer')) map.setLayoutProperty('roads-layer', 'visibility', visibility);
          break;
        case 'hospitals':
          if (map.getLayer('hospitals-layer')) map.setLayoutProperty('hospitals-layer', 'visibility', visibility);
          break;
        case 'caseStudy':
          if (map.getLayer('case-study-layer')) map.setLayoutProperty('case-study-layer', 'visibility', visibility);
          break;
      }
    });
  }, []);

  // Helper to add all data sources & layers to map
  const addAllGeoLayers = useCallback((map: MapLibreMap) => {
    // 1. NEPAL NATIONAL BOUNDARY SOURCE & LAYER (ADM0)
    if (!map.getSource('nepal-national-source')) {
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
          'line-opacity': 0.95,
        },
      });
    }

    // 2. NEPAL 77 DISTRICTS BOUNDARY SOURCE & LAYER (ADM2)
    if (!map.getSource('nepal-districts-source')) {
      map.addSource('nepal-districts-source', {
        type: 'geojson',
        data: nepalDistrictsGeoJson,
      });

      map.addLayer({
        id: 'nepal-districts-line',
        type: 'line',
        source: 'nepal-districts-source',
        paint: {
          'line-color': '#0284c7',
          'line-width': 0.8,
          'line-dasharray': [2, 2],
          'line-opacity': 0.45,
        },
      });
    }

    // 3. NEPAL 7 PROVINCES SOURCE & LAYERS (ADM1)
    if (!map.getSource('nepal-provinces-source')) {
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
            'PROV-3', 'rgba(225, 29, 72, 0.16)', // Bagmati
            'PROV-1', 'rgba(245, 158, 11, 0.06)', // Koshi
            'PROV-4', 'rgba(245, 158, 11, 0.06)', // Gandaki
            'rgba(56, 189, 248, 0.03)',
          ],
          'fill-opacity': 0.85,
        },
      });

      map.addLayer({
        id: 'provinces-line',
        type: 'line',
        source: 'nepal-provinces-source',
        paint: {
          'line-color': '#0284c7',
          'line-width': 1.8,
          'line-dasharray': [3, 1.5],
          'line-opacity': 0.85,
        },
      });

      // Province hover and click interactions
      map.on('mousemove', 'provinces-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const provProps = e.features[0].properties as any;
          const name = language === 'np' && provProps.nepaliName ? provProps.nepaliName : provProps.name;
          setHoveredProvince(name);
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
    }

    // 4. FLOOD INUNDATION SOURCE & LAYER (Bhote Koshi / Case Study)
    if (!map.getSource('flood-source')) {
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
    }

    // 5. LANDSLIDE & DEBRIS FLOW SOURCE & LAYER
    if (!map.getSource('landslide-source')) {
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
    }

    // 6. DAMAGE ZONES SOURCE & LAYER
    if (!map.getSource('damage-source')) {
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
          'fill-opacity': 0.45,
        },
      });
    }

    // 7. INFRASTRUCTURE: ROADS, BUILDINGS, HOSPITALS
    if (!map.getSource('buildings-source')) {
      map.addSource('buildings-source', { type: 'geojson', data: demoBuildingsGeoJson });
      map.addLayer({
        id: 'buildings-layer',
        type: 'fill',
        source: 'buildings-source',
        paint: { 'fill-color': '#fbbf24', 'fill-opacity': 0.85 },
      });
    }

    if (!map.getSource('roads-source')) {
      map.addSource('roads-source', { type: 'geojson', data: demoRoadsGeoJson });
      map.addLayer({
        id: 'roads-layer',
        type: 'line',
        source: 'roads-source',
        paint: { 'line-color': '#38bdf8', 'line-width': 3 },
      });
    }

    if (!map.getSource('hospitals-source')) {
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
    }

    // 8. VERIFIED 2026 CASE STUDY WAYPOINTS
    if (!map.getSource('case-study-source')) {
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

      map.on('click', 'case-study-layer', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const props = feature.properties as any;
        setSelectedFeature({
          properties: props,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 9. LIVE USGS EARTHQUAKES GEOJSON SOURCE & LAYER
    if (!map.getSource('live-earthquakes-source')) {
      const eqGeoJson = {
        type: 'FeatureCollection',
        features: liveEarthquakes.map((eq) => ({
          type: 'Feature',
          properties: {
            id: eq.id,
            title: eq.title,
            magnitude: eq.magnitude,
            place: eq.place,
            time: eq.time,
            depth_km: eq.depth_km,
            url: eq.url,
          },
          geometry: {
            type: 'Point',
            coordinates: eq.coordinates,
          },
        })),
      };

      map.addSource('live-earthquakes-source', {
        type: 'geojson',
        data: eqGeoJson as any,
      });

      map.addLayer({
        id: 'live-earthquakes-circle',
        type: 'circle',
        source: 'live-earthquakes-source',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'magnitude'],
            2.0, 7,
            4.0, 12,
            6.0, 18,
            8.0, 26,
          ],
          'circle-color': [
            'step',
            ['get', 'magnitude'],
            '#eab308', // < 3.5 yellow (minor tremor)
            3.5, '#f97316', // 3.5 - 4.5 orange (light/moderate)
            4.5, '#ef4444', // >= 4.5 red (moderate-to-strong epicentral energy)
          ],
          'circle-opacity': 0.85,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'live-earthquakes-circle', (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties as any;
        setSelectedPinInfo({
          title: `USGS Seismic Event: M ${props.magnitude}`,
          subtitle: props.place,
          badge: 'INSTRUMENT RECORD (USGS)',
          details: `Magnitude: M ${props.magnitude} | Focal Depth: ${props.depth_km} km\nRecorded Time: ${props.time}\n\nNotice: Recorded magnitude measures energy release at the epicenter. Ground shaking and local impact depend on focal depth and soil geomorphology. Magnitude is not proof of local damage or structural collapse. Await official impact reports from NDRRMA.`,
          link: props.url,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 10. LIVE WEATHER & RAINFALL STATIONS SOURCE & LAYER
    if (!map.getSource('live-weather-source')) {
      const wxGeoJson = {
        type: 'FeatureCollection',
        features: liveWeatherStations.map((st) => ({
          type: 'Feature',
          properties: {
            id: st.station_id,
            name: st.name,
            province: st.province,
            temp: st.temperature_c,
            precip: st.precipitation_mm,
            wind: st.wind_speed_kmh,
            hazard: st.hazard_level,
            hazardLabel: st.hazard_label,
          },
          geometry: {
            type: 'Point',
            coordinates: st.coordinates,
          },
        })),
      };

      map.addSource('live-weather-source', {
        type: 'geojson',
        data: wxGeoJson as any,
      });

      map.addLayer({
        id: 'live-weather-circle',
        type: 'circle',
        source: 'live-weather-source',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'hazard'],
            'CRITICAL', '#dc2626',
            'HIGH', '#ea580c',
            'MODERATE', '#38bdf8',
            '#10b981',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('click', 'live-weather-circle', (e) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties as any;
        setSelectedPinInfo({
          title: `Weather Station: ${props.name}`,
          subtitle: props.province,
          badge: 'LIVE METEOROLOGICAL (Open-Meteo)',
          details: `Precipitation: ${props.precip} mm | Temp: ${props.temp}°C | Wind: ${props.wind} km/h\nStatus: ${props.hazardLabel}`,
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }

    // 11. ACTIVE DISASTER PULSE BEACON OVER SINDHUPALCHOK
    if (!map.getSource('active-disaster-beacon-source')) {
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
    }

    // 12. DYNAMIC SELECTED LOCATION HIGHLIGHT
    if (!map.getSource('selected-location-highlight-source')) {
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
    }

    // 13. SELECTED POINT MARKER
    if (!map.getSource('selected-location-point-source')) {
      map.addSource('selected-location-point-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'selected-location-point-outer',
        type: 'circle',
        source: 'selected-location-point-source',
        paint: {
          'circle-radius': 16,
          'circle-color': '#a855f7',
          'circle-opacity': 0.3,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#c084fc',
        },
      });

      map.addLayer({
        id: 'selected-location-point-inner',
        type: 'circle',
        source: 'selected-location-point-source',
        paint: {
          'circle-radius': 8,
          'circle-color': '#a855f7',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    }
  }, [language, liveEarthquakes, liveWeatherStations, onSelectProvince]);

  // Initialize MapLibre instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;
    const providerName = getProviderName(basemap, useFallbackRaster);

    try {
      const initialCenter = initialViewMode === 'NATION' ? NEPAL_NATION_CENTER : NEPAL_CENTER;
      const initialZoom = initialViewMode === 'NATION' ? NEPAL_NATION_ZOOM : NEPAL_INITIAL_ZOOM;
      const initialPitch = initialViewMode === 'NATION' ? NEPAL_NATION_PITCH : NEPAL_PITCH;
      const initialBearing = initialViewMode === 'NATION' ? NEPAL_NATION_BEARING : NEPAL_BEARING;

      const map = new MapLibreMap({
        container: mapContainerRef.current,
        style: getBasemapStyle(basemap, useFallbackRaster),
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

      // Tile & Style Error Listener
      map.on('error', (e) => {
        if (!isMounted) return;
        const errStr = e.error?.message || '';
        // If tile request failed or style failed
        if (errStr.includes('Failed to fetch') || errStr.includes('NetworkError') || (e.error as any)?.status === 404 || (e.error as any)?.status === 403) {
          console.warn('MapLibre tile connection issue:', e.error);
          setMapTileError(`Basemap tile warning (${providerName}): Network request failed. Some tiles may be delayed.`);
          onBasemapStatusChange?.('DEGRADED', providerName);
        }
      });

      map.on('load', () => {
        if (!isMounted) return;
        addAllGeoLayers(map);
        syncAllLayers(map, layers);
        setIsMapLoaded(true);
        setMapError(null);
        setMapTileError(null);
        onBasemapStatusChange?.('OPERATIONAL', providerName);
      });

      mapRef.current = map;
    } catch (err: any) {
      if (isMounted) {
        const msg = err.message || 'WebGL acceleration failed to start.';
        setMapError(msg);
        onBasemapStatusChange?.('DISCONNECTED', providerName);
      }
    }

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [basemap, initialViewMode, useFallbackRaster, getBasemapStyle, getProviderName, addAllGeoLayers, syncAllLayers, layers, onBasemapStatusChange]);

  // Update Live Earthquake & Weather GeoJSON Sources whenever props change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const eqSrc = map.getSource('live-earthquakes-source') as any;
    if (eqSrc) {
      eqSrc.setData({
        type: 'FeatureCollection',
        features: liveEarthquakes.map((eq) => ({
          type: 'Feature',
          properties: {
            id: eq.id,
            title: eq.title,
            magnitude: eq.magnitude,
            place: eq.place,
            time: eq.time,
            depth_km: eq.depth_km,
            url: eq.url,
          },
          geometry: {
            type: 'Point',
            coordinates: eq.coordinates,
          },
        })),
      });
    }

    const wxSrc = map.getSource('live-weather-source') as any;
    if (wxSrc) {
      wxSrc.setData({
        type: 'FeatureCollection',
        features: liveWeatherStations.map((st) => ({
          type: 'Feature',
          properties: {
            id: st.station_id,
            name: st.name,
            province: st.province,
            temp: st.temperature_c,
            precip: st.precipitation_mm,
            wind: st.wind_speed_kmh,
            hazard: st.hazard_level,
            hazardLabel: st.hazard_label,
          },
          geometry: {
            type: 'Point',
            coordinates: st.coordinates,
          },
        })),
      });
    }
  }, [liveEarthquakes, liveWeatherStations, isMapLoaded]);

  // Responsive map resize on container dimension change & focus change
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

  // Explicit resize trigger when map focus mode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 150);
    return () => clearTimeout(timer);
  }, [isMapFocused]);

  // Update selected location highlight polygon & flyTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const polySource = map.getSource('selected-location-highlight-source') as any;
    const pointSource = map.getSource('selected-location-point-source') as any;
    if (!polySource || !pointSource) return;

    if (selectedLocation) {
      let actualGeometry: any = selectedLocation.boundaryGeoJson || null;

      if (!actualGeometry) {
        if (selectedLocation.type === 'PROVINCE') {
          const match = nepalProvincesGeoJson.features.find((f) =>
            f.properties.name.toLowerCase().includes(selectedLocation.name.toLowerCase()) ||
            selectedLocation.name.toLowerCase().includes(f.properties.name.toLowerCase())
          );
          if (match) actualGeometry = match.geometry;
        } else if (selectedLocation.type === 'DISTRICT') {
          const match = nepalDistrictsGeoJson.features.find((f) =>
            f.properties.district.toLowerCase().includes(selectedLocation.name.toLowerCase()) ||
            selectedLocation.name.toLowerCase().includes(f.properties.district.toLowerCase())
          );
          if (match) actualGeometry = match.geometry;
        }
      }

      if (actualGeometry && (actualGeometry.type === 'Polygon' || actualGeometry.type === 'MultiPolygon')) {
        polySource.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: selectedLocation.name,
                label: 'VERIFIED ADMINISTRATIVE BOUNDARY',
              },
              geometry: actualGeometry,
            },
          ],
        });

        pointSource.setData({
          type: 'FeatureCollection',
          features: [],
        });

        try {
          const bounds = new LngLatBounds();
          const coords = actualGeometry.coordinates;
          const extractCoords = (arr: any[]) => {
            if (typeof arr[0] === 'number') {
              bounds.extend([arr[0], arr[1]]);
            } else {
              arr.forEach(extractCoords);
            }
          };
          extractCoords(coords);
          map.fitBounds(bounds, {
            padding: 60,
            duration: 1400,
            maxZoom: 13,
          });
        } catch {
          map.flyTo({
            center: selectedLocation.coordinates,
            zoom: selectedLocation.zoom || 10,
            duration: 1200,
          });
        }
      } else {
        polySource.setData({
          type: 'FeatureCollection',
          features: [],
        });

        pointSource.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                name: selectedLocation.name,
              },
              geometry: {
                type: 'Point',
                coordinates: selectedLocation.coordinates,
              },
            },
          ],
        });

        map.flyTo({
          center: selectedLocation.coordinates,
          zoom: selectedLocation.zoom || 14,
          pitch: 30,
          duration: 1400,
          essential: true,
        });
      }
    } else {
      polySource.setData({ type: 'FeatureCollection', features: [] });
      pointSource.setData({ type: 'FeatureCollection', features: [] });
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

  // Synchronize Layer Visibility Props
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    syncAllLayers(map, layers);
  }, [layers, isMapLoaded, syncAllLayers]);

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

  const handleRetry = useCallback(() => {
    setMapError(null);
    setMapTileError(null);
    setIsMapLoaded(false);
  }, []);

  const handleSwitchToFallback = useCallback(() => {
    setUseFallbackRaster(true);
    setMapError(null);
    setMapTileError(null);
    setIsMapLoaded(false);
  }, []);

  const currentProvider = getProviderName(basemap, useFallbackRaster);

  return (
    <div className={`relative w-full ${heightClass} bg-command-bg rounded-2xl overflow-hidden border border-command-border shadow-2xl transition-all`}>
      {/* Loading Overlay */}
      {!isMapLoaded && !mapError && (
        <LoadingState message={`Initializing ${currentProvider}...`} />
      )}

      {/* Explicit Map Unavailable Screen if Critical Initialization Fails */}
      {mapError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-command-bg/95 p-6 backdrop-blur-sm">
          <div className="max-w-md w-full bg-command-card border border-rose-600 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-600 flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-command-text uppercase tracking-wider">MAP BASEMAP UNAVAILABLE</h3>
              <p className="text-xs text-command-muted mt-1 leading-relaxed">
                Could not connect to {currentProvider}. Check internet connection or CORS/firewall settings.
              </p>
            </div>
            <div className="text-[11px] text-rose-300 bg-rose-950/80 p-2.5 rounded-xl border border-rose-800/80 font-mono text-left break-words">
              {mapError}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleRetry}
                className="px-3.5 py-2 rounded-xl bg-command-accent hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
              {!useFallbackRaster && (
                <button
                  onClick={handleSwitchToFallback}
                  className="px-3.5 py-2 rounded-xl bg-command-surface hover:bg-command-border text-command-text border border-command-border font-bold text-xs transition-colors"
                >
                  Use Offline Fallback
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Non-blocking Tile Warning Banner */}
      {mapTileError && isMapLoaded && (
        <div className="absolute top-16 left-4 right-14 z-20 bg-amber-950/95 border border-amber-600/90 rounded-xl p-2.5 text-xs font-mono shadow-2xl flex items-center justify-between gap-3 text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">{mapTileError}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {!useFallbackRaster && (
              <button
                onClick={handleSwitchToFallback}
                className="px-2 py-0.5 rounded bg-amber-900 hover:bg-amber-800 border border-amber-700 text-[10px] font-bold text-white transition-colors"
              >
                Switch to Fallback
              </button>
            )}
            <button
              onClick={() => setMapTileError(null)}
              className="px-1.5 py-0.5 rounded text-amber-400 hover:text-white text-[11px]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MapLibre DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Hovered Province / Region Badge */}
      {hoveredProvince && (
        <div className="absolute top-4 left-4 z-10 px-3.5 py-2 rounded-xl bg-command-card/95 backdrop-blur-md border border-sky-500 text-xs font-mono text-sky-300 font-bold shadow-tactical-glow pointer-events-none animate-in fade-in flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-400" />
          <span>{hoveredProvince} (Click to inspect province)</span>
        </div>
      )}

      {/* Floating Tactical Map Controls Toolbar */}
      <div className="absolute top-4 right-14 z-10 flex items-center gap-1.5 bg-command-card/90 backdrop-blur-md border border-command-border p-1 rounded-xl shadow-xl font-mono text-xs">
        {/* Basemap Switcher */}
        <div className="flex items-center bg-command-panel rounded-lg p-0.5 border border-command-border">
          <button
            onClick={() => setBasemap('dark')}
            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              basemap === 'dark' ? 'bg-command-accent text-white shadow-sm' : 'text-command-dim hover:text-command-text'
            }`}
            title="Clean OpenFreeMap Dark Tactical Vector Map"
          >
            <MapIcon className="w-3 h-3" />
            <span className="hidden sm:inline">Dark</span>
          </button>
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              basemap === 'satellite' ? 'bg-command-accent text-white shadow-sm' : 'text-command-dim hover:text-command-text'
            }`}
            title="High-Resolution Esri Satellite Imagery + Boundaries"
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'np' ? 'उपग्रह' : 'Satellite'}</span>
          </button>
        </div>

        {/* Fit Nepal Extent */}
        <button
          onClick={handleFitNepalCountry}
          className="px-2.5 py-1 rounded-lg bg-command-surface hover:bg-command-border text-command-text hover:text-command-accent-glow font-bold flex items-center gap-1.5 transition-colors border border-command-border"
          title={t.fitNepal}
        >
          <Maximize2 className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="font-bold">{language === 'np' ? 'नेपाल' : 'NEPAL'}</span>
        </button>

        {/* Focus Disaster Corridor */}
        <button
          onClick={handleFocusDisasterCorridor}
          className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold flex items-center gap-1.5 transition-colors"
          title={t.activeDisasterZone}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="hidden md:inline">{language === 'np' ? 'विपद् क्षेत्र' : 'AOI CORRIDOR'}</span>
        </button>

        {/* Focus Map (Maximize Usable Map Area) */}
        {onToggleFocusMap && (
          <button
            onClick={onToggleFocusMap}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all border ${
              isMapFocused
                ? 'bg-command-accent text-white border-sky-400 shadow-sm'
                : 'bg-command-surface hover:bg-command-border text-command-text hover:text-command-accent-glow border-command-border'
            }`}
            title={isMapFocused ? 'Restore Normal Layout' : 'Focus Map (Maximize Map Viewport)'}
          >
            {isMapFocused ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESTORE</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-command-accent-glow" />
                <span className="hidden sm:inline">FOCUS</span>
              </>
            )}
          </button>
        )}

        {/* Toggle Layer Drawer */}
        <button
          onClick={() => setShowLayerDrawer(!showLayerDrawer)}
          className={`p-1.5 rounded-lg transition-colors border ${
            showLayerDrawer
              ? 'bg-command-accent text-white border-command-accent shadow-sm'
              : 'bg-command-surface border-command-border text-command-muted hover:text-command-text'
          }`}
          title={t.mapLayers}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Human-Friendly Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <HumanMapLegend language={language} />
      </div>

      {/* Verified Map Legal Attribution Pill */}
      <div className="absolute bottom-1 right-2 z-10 px-2 py-0.5 rounded bg-command-panel/90 backdrop-blur-sm border border-command-border/60 text-[9px] font-mono text-command-dim flex items-center gap-1.5 select-text shadow-sm pointer-events-auto">
        <span
          dangerouslySetInnerHTML={{
            __html: basemap === 'satellite' ? BASEMAP_ATTRIBUTION_HTML.satellite : BASEMAP_ATTRIBUTION_HTML.dark,
          }}
        />
      </div>

      {/* Layer Control Drawer */}
      {showLayerDrawer && (
        <div className="absolute top-16 right-4 z-20 w-72 bg-command-card/95 backdrop-blur-lg border border-command-border rounded-2xl p-3.5 font-mono shadow-2xl space-y-2.5 text-xs animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-command-border">
            <span className="font-bold text-command-text uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-command-accent-glow" />
              <span>{t.mapLayers}</span>
            </span>
            <button
              onClick={() => setShowLayerDrawer(false)}
              className="text-command-dim hover:text-command-text text-[11px] px-1.5 py-0.5 rounded bg-command-panel hover:bg-command-surface"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {layers.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-2 rounded-xl bg-command-panel/80 border border-command-border/70 hover:border-command-border transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-bold text-command-text truncate">
                    {l.label.replace(' (DEMO)', '')}
                  </div>
                  <div className="text-[9px] text-command-dim truncate">
                    {l.description}
                  </div>
                </div>

                <button
                  onClick={() => onToggleLayer(l.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                    l.enabled
                      ? 'bg-sky-950 text-sky-300 border border-sky-700 shadow-sm'
                      : 'bg-command-surface text-command-dim border border-command-border'
                  }`}
                >
                  {l.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup when Live Pin or Marker is Clicked */}
      {selectedPinInfo && (
        <div className="absolute top-20 left-4 z-30 max-w-sm bg-command-card/95 backdrop-blur-md border border-command-border rounded-xl p-3.5 shadow-2xl font-mono text-xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-command-text text-sm">{selectedPinInfo.title}</div>
              <div className="text-[11px] text-command-dim">{selectedPinInfo.subtitle}</div>
            </div>
            <button
              onClick={() => setSelectedPinInfo(null)}
              className="text-command-dim hover:text-command-text text-[11px]"
            >
              ✕
            </button>
          </div>

          <div className="text-[11px] text-command-muted whitespace-pre-line leading-relaxed bg-command-panel p-2.5 rounded-lg border border-command-border">
            {selectedPinInfo.details}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
              {selectedPinInfo.badge}
            </span>
            {selectedPinInfo.link && (
              <a
                href={selectedPinInfo.link}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-sky-400 hover:underline"
              >
                Official USGS Record ↗
              </a>
            )}
          </div>
        </div>
      )}

      {/* Case Study Feature Popup */}
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
