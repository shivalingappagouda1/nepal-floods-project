import React, { useState, useMemo } from 'react';
import type { MapLayerConfig } from '../../types';
import type { RiskZone, RiskWeights } from '../../types/risk';
import { 
  riskAnalysisService, 
  DEFAULT_RISK_WEIGHTS 
} from '../../services/RiskAnalysisService';
import { RiskBreakdown } from './RiskBreakdown';
import { WeightConfigurator } from './WeightConfigurator';
import { MapPanel } from '../../components/tactical/MapPanel';
import { 
  Flame, 
} from 'lucide-react';

interface RiskViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  isMapFocused?: boolean;
}

export const RiskView: React.FC<RiskViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  isMapFocused = false,
}) => {
  const [weights, setWeights] = useState<RiskWeights>(DEFAULT_RISK_WEIGHTS);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZONE-A');
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [sideTab, setSideTab] = useState<'ZONE' | 'WEIGHTS' | 'ZONES_LIST'>('ZONE');

  const zones: RiskZone[] = useMemo(() => {
    return riskAnalysisService.getRiskZones(weights);
  }, [weights]);

  const selectedZone: RiskZone = useMemo(() => {
    const found = zones.find((z) => z.id === selectedZoneId);
    return found || zones[0];
  }, [zones, selectedZoneId]);

  const handleSelectZone = (zone: RiskZone) => {
    setSelectedZoneId(zone.id);
    setFocusedWaypoint(zone.coordinates);
    setSideTab('ZONE');
  };

  const handleFocusZone = (coords: [number, number]) => {
    setFocusedWaypoint(coords);
  };

  const handleWeightsChange = (newWeights: RiskWeights) => {
    setWeights(newWeights);
  };

  const handleResetWeights = (presetId?: string) => {
    const reset = riskAnalysisService.resetWeights(presetId);
    setWeights(reset);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Header Strip */}
      <div className="bg-command-card/90 border border-command-border rounded-lg px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-tactical-amber" />
              MCDA RISK ENGINE
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-command-text">
              EXPLAINABLE GEOSPATIAL MULTI-FACTOR RISK ASSESSMENT
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-bold">
            PRECOMPUTED ANALYSIS
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-dim">
            CONFIDENCE: Not available
          </span>
        </div>
      </div>

      {/* Main Workspace: Dominant Map (65-70%) + Right Zone Deck (30-35%) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[640px]`}>
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Risk Assessment Sectors"
            coordinates={selectedZone.coordinates}
            focusedWaypoint={focusedWaypoint}
          />
        </div>

        {/* Right Zone Summary & Configuration Deck */}
        {!isMapFocused && (
          <div className="lg:col-span-4 flex flex-col h-[640px] space-y-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-lg p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('ZONE')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'ZONE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                SELECTED ZONE
              </button>
              <button
                onClick={() => setSideTab('ZONES_LIST')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'ZONES_LIST'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                ALL ZONES ({zones.length})
              </button>
              <button
                onClick={() => setSideTab('WEIGHTS')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'WEIGHTS'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                WEIGHTS
              </button>
            </div>

            {/* Tab 1: Selected Zone Breakdown */}
            {sideTab === 'ZONE' && (
              <div className="flex-1 overflow-y-auto">
                <RiskBreakdown
                  zone={selectedZone}
                  onFocusZone={handleFocusZone}
                />
              </div>
            )}

            {/* Tab 2: All Zones List */}
            {sideTab === 'ZONES_LIST' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {zones.map((z) => {
                  const isSelected = selectedZoneId === z.id;
                  let levelColor = 'text-rose-400 border-rose-800 bg-rose-950/60';
                  if (z.riskLevel === 'HIGH') levelColor = 'text-orange-400 border-orange-800 bg-orange-950/60';
                  if (z.riskLevel === 'MODERATE') levelColor = 'text-amber-400 border-amber-800 bg-amber-950/60';
                  if (z.riskLevel === 'LOW') levelColor = 'text-emerald-400 border-emerald-800 bg-emerald-950/60';

                  return (
                    <div
                      key={z.id}
                      onClick={() => handleSelectZone(z)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-command-surface border-command-accent shadow-tactical-glow'
                          : 'bg-command-panel/70 border-command-border hover:border-command-border-light'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-command-text">{z.id}</span>
                          <span className="text-xs text-command-muted">{z.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${levelColor}`}>
                          {z.scaledScore}/100 • {z.riskLevel}
                        </span>
                      </div>
                      <p className="text-[10px] text-command-dim line-clamp-1">
                        {z.recommendedDecisionAction}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Weights Configurator */}
            {sideTab === 'WEIGHTS' && (
              <div className="flex-1 overflow-y-auto">
                <WeightConfigurator
                  weights={weights}
                  onWeightsChange={handleWeightsChange}
                  onReset={handleResetWeights}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
