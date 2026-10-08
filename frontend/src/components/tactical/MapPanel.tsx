import React from 'react';
import type { MapLayerConfig } from '../../types';
import type { SearchableLocation } from '../../data/searchLocations';
import type { ProvinceProperties } from '../../data/nepalProvincesGeoJson';
import { InteractiveMap } from '../map/InteractiveMap';

interface MapPanelProps {
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  activeAoiName: string;
  coordinates: [number, number];
  heightClass?: string;
  focusedWaypoint?: [number, number] | null;
  selectedLocation?: SearchableLocation | null;
  onSelectProvince?: (prov: ProvinceProperties) => void;
  initialViewMode?: 'NATION' | 'CORRIDOR';
}

export const MapPanel: React.FC<MapPanelProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  activeAoiName,
  coordinates,
  heightClass = "h-full min-h-[560px]",
  focusedWaypoint,
  selectedLocation,
  onSelectProvince,
  initialViewMode = 'NATION',
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
    />
  );
};
