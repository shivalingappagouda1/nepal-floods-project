import React from 'react';
import type { MapLayerConfig } from '../../types';
import { InteractiveMap } from '../map/InteractiveMap';

interface MapPanelProps {
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  activeAoiName: string;
  coordinates: [number, number];
  heightClass?: string;
}

export const MapPanel: React.FC<MapPanelProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  activeAoiName,
  coordinates,
  heightClass = "h-full min-h-[560px]",
}) => {
  return (
    <InteractiveMap
      layers={layers}
      onToggleLayer={onToggleLayer}
      onOpacityChange={onOpacityChange}
      activeAoiName={activeAoiName}
      coordinates={coordinates}
      heightClass={heightClass}
    />
  );
};
