import React from 'react';
import type { DamageFeature } from '../../types/damage';
import { DAMAGE_CATEGORY_CONFIGS } from '../../data/damageConfigs';

interface DamageMapLayerProps {
  features: DamageFeature[];
  selectedFeatureId?: string | null;
  onSelectFeature?: (feature: DamageFeature) => void;
}

/**
 * DamageMapLayer - Manages geospatial damage layer overlays and interactive waypoint markers
 * based strictly on observable satellite/GIS evidence.
 */
export const DamageMapLayer: React.FC<DamageMapLayerProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
}) => {
  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between text-[10px] text-command-dim pb-1 border-b border-command-border/50">
        <span className="font-bold uppercase">MAP OVERLAY LAYER: DAMAGE EVIDENCE</span>
        <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
          PRECOMPUTED
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
        {features.map((feature) => {
          const config = DAMAGE_CATEGORY_CONFIGS[feature.category];
          const isSelected = selectedFeatureId === feature.id;

          return (
            <div
              key={feature.id}
              onClick={() => onSelectFeature?.(feature)}
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-command-surface border-command-accent text-command-text shadow-tactical-glow'
                  : 'bg-command-panel/60 border-command-border text-command-muted hover:border-command-border-light'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: config.colorClass.replace('text-', '') }} />
                <span className="font-bold text-[10px] text-command-text">{feature.id}:</span>
                <span className="text-[10px] truncate">{feature.name}</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${config.badgeClass}`}>
                {feature.categoryLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
