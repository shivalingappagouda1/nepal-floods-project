import React from 'react';
import type { RiskZone } from '../../types/risk';
import { Flame, ChevronRight, Layers, HelpCircle } from 'lucide-react';

interface RiskMapLayerProps {
  zones: RiskZone[];
  selectedZoneId?: string | null;
  onSelectZone: (zone: RiskZone) => void;
}

export const RiskMapLayer: React.FC<RiskMapLayerProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const getZoneLevelColor = (level: string) => {
    switch (level) {
      case 'EXTREME':
        return 'text-purple-400 bg-purple-950/80 border-purple-700';
      case 'VERY HIGH':
        return 'text-rose-400 bg-rose-950/80 border-rose-700';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/80 border-orange-700';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-950/80 border-amber-700';
      case 'LOW':
      default:
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-700';
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 font-mono shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-command-border">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
          <h4 className="text-xs font-bold text-command-text uppercase tracking-wider">
            EVALUATED RISK ZONES ({zones.length})
          </h4>
        </div>
        <span className="text-[10px] text-command-dim">
          DYNAMIC MCDA
        </span>
      </div>

      {/* Zone Selector Cards */}
      <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
        {zones.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          const levelClass = getZoneLevelColor(zone.riskLevel);

          return (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-command-surface border-command-accent shadow-tactical-glow'
                  : 'bg-command-panel/70 border-command-border hover:border-command-border-light'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-command-accent-glow">
                    {zone.id}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${levelClass}`}>
                    {zone.riskLevel}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="font-bold text-xs text-command-text">
                    {zone.scaledScore}/100
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-command-text leading-tight mb-1">
                {zone.name}
              </div>

              <div className="text-[10px] text-command-dim truncate mb-2">
                {zone.sector}
              </div>

              {/* Factors pill row */}
              <div className="flex items-center justify-between text-[9px] text-command-dim pt-1.5 border-t border-command-border/40">
                <div className="flex items-center gap-2">
                  <span>{zone.coordinates[1].toFixed(3)}°N, {zone.coordinates[0].toFixed(3)}°E</span>
                  {zone.missingFactorsCount > 0 && (
                    <span className="text-amber-400 flex items-center gap-0.5" title="Data gap present; renormalized">
                      <HelpCircle className="w-2.5 h-2.5" />
                      <span>{zone.missingFactorsCount} gap</span>
                    </span>
                  )}
                </div>

                <span className="text-command-accent-glow flex items-center gap-0.5 font-bold">
                  <span>INSPECT</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Symbology Legend */}
      <div className="pt-2 border-t border-command-border/60 space-y-1 text-[9px] text-command-dim">
        <span className="font-bold uppercase block text-command-text">Risk Tier Classification:</span>
        <div className="grid grid-cols-2 gap-1 text-[9px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>EXTREME (≥ 90)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>VERY HIGH (75–89)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>HIGH (55–74)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>MODERATE (35–54)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>LOW (&lt; 35)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
