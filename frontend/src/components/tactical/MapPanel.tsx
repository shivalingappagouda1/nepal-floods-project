import React from 'react';
import type { 
  MapLayerConfig, 
  LanguageMode, 
  LiveEarthquakeEvent, 
  LiveWeatherStation 
} from '../../types';
import type { SearchableLocation } from '../../data/searchLocations';
import type { ProvinceProperties } from '../../data/nepalProvincesGeoJson';
import { InteractiveMap } from '../map/InteractiveMap';

interface MapPanelProps {
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onOpacityChange?: (layerId: string, opacity: number) => void;
  activeAoiName?: string;
  coordinates?: [number, number];
  heightClass?: string;
  focusedWaypoint?: [number, number] | null;
  selectedLocation?: SearchableLocation | null;
  onSelectProvince?: (prov: ProvinceProperties) => void;
  initialViewMode?: 'NATION' | 'CORRIDOR';
  language?: LanguageMode;
  liveEarthquakes?: LiveEarthquakeEvent[];
  liveWeatherStations?: LiveWeatherStation[];
}

export const MapPanel: React.FC<MapPanelProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  activeAoiName = "Bhote Koshi Transboundary Corridor",
  coordinates = [84.1240, 28.3949],
  heightClass = "h-full min-h-[580px]",
  focusedWaypoint,
  selectedLocation,
  onSelectProvince,
  initialViewMode = 'NATION',
  language = 'en',
  liveEarthquakes = [],
  liveWeatherStations = [],
}) => {
  return (
    <InteractiveMap
      layers={layers}
      onToggleLayer={onToggleLayer}
      onOpacityChange={onOpacityChange}
      activeAoiName={activeAoiName}
      coordinates={coordinates}
      heightClass={heightClass}
      focusedWaypoint={focusedWaypoint}
      selectedLocation={selectedLocation}
      onSelectProvince={onSelectProvince}
      initialViewMode={initialViewMode}
      language={language}
      liveEarthquakes={liveEarthquakes}
      liveWeatherStations={liveWeatherStations}
    />
  );
};
