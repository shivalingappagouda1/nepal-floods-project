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
  AlertTriangle, 
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
  const [sideTab, setSideTab] = useState<'ZONE' | 'ZONES_LIST' | 'WEIGHTS'>('ZONE');

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
    <div className="space-y-4 font-sans">
      {/* Top Header Strip */}
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-command-text">
              Risk Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-command-muted">
            Understand where hazards like floods and landslides may be a concern based on slope, rainfall, and river distance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold">
            Prototype estimate
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-600 dark:text-command-dim text-xs">
            Explainable multi-factor model
          </span>
        </div>
      </div>

      {/* Main Workspace: Dominant Map + Right Zone Deck */}
      <div className={`grid gap-4 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport (Preserved MapLibre Map) */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[650px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-command-border`}>
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
          <div className="lg:col-span-4 flex flex-col h-[650px] space-y-3">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl p-1 text-xs shrink-0 shadow-xs">
              <button
                onClick={() => setSideTab('ZONE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'ZONE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Selected Zone
              </button>
              <button
                onClick={() => setSideTab('ZONES_LIST')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'ZONES_LIST'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                All Zones ({zones.length})
              </button>
              <button
                onClick={() => setSideTab('WEIGHTS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'WEIGHTS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Advanced Model
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
                {zones.map((zone) => {
                  const isSelected = zone.id === selectedZone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => handleSelectZone(zone)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-500 shadow-xs dark:bg-blue-950/40'
                          : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-command-panel dark:border-command-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-command-text">
                          {zone.name}
                        </span>
                        <span className="text-xs font-extrabold text-blue-700 dark:text-sky-400">
                          {zone.scaledScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {zone.sector} • {zone.riskLevel} Concern
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 3: Model Weights Configurator */}
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
