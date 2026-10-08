import React, { useState, useMemo } from 'react';
import type { MapLayerConfig } from '../../types';
import type { RiskZone, RiskWeights } from '../../types/risk';
import { 
  riskAnalysisService, 
  DEFAULT_RISK_WEIGHTS 
} from '../../services/RiskAnalysisService';
import { RiskBreakdown } from './RiskBreakdown';
import { RiskMapLayer } from './RiskMapLayer';
import { WeightConfigurator } from './WeightConfigurator';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Flame, 
  SlidersHorizontal, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RiskViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const RiskView: React.FC<RiskViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
}) => {
  const [weights, setWeights] = useState<RiskWeights>(DEFAULT_RISK_WEIGHTS);
  const [showWeightConfig, setShowWeightConfig] = useState<boolean>(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('ZONE-A');
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);

  // Recalculate all zones dynamically whenever weights change
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
    <div className="space-y-4 font-mono">
      {/* Top Header Strip */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-tactical-amber" />
              MULTI-CRITERIA DECISION ANALYSIS (MCDA)
            </span>
            <h2 className="text-sm font-bold text-command-text font-mono uppercase tracking-wider">
              EXPLAINABLE GEOSPATIAL RISK ASSESSMENT ENGINE
            </h2>
          </div>
          <p className="text-xs text-command-muted font-mono max-w-2xl">
            Multi-factor vulnerability modeling synthesizing slope, elevation head, rainfall saturation, bedrock geology, satellite change, and historical disaster recurrence.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowWeightConfig(!showWeightConfig)}
            className="px-3 py-1.5 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-text flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-command-accent-glow" />
            <span>{showWeightConfig ? 'HIDE WEIGHTS' : 'CUSTOMIZE WEIGHTS'}</span>
            {showWeightConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <DataSourceBadge
            provenance={{
              tier: 'DEMO_VALUE',
              source: 'Multi-Criteria Risk Model (Prototype evaluation run)',
              timestamp: 'Dynamic runtime calculation',
              algorithm: 'MCDA Multi-Factor Weighted Normalization',
            }}
            showDetails
          />
        </div>
      </div>

      {/* Interactive Weight Configurator Drawer */}
      {showWeightConfig && (
        <WeightConfigurator
          weights={weights}
          onWeightsChange={handleWeightsChange}
          onReset={handleResetWeights}
        />
      )}

      {/* Main Grid: Zone List (Left 4 cols) + Map & Deep Breakdown (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Evaluated Zones Catalog */}
        <div className="lg:col-span-4">
          <RiskMapLayer
            zones={zones}
            selectedZoneId={selectedZone.id}
            onSelectZone={handleSelectZone}
          />

          {/* Methodological Guidance Card */}
          <div className="mt-3 p-3 rounded-lg bg-command-panel/80 border border-command-border text-[10px] text-command-dim space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-command-text">
              <Info className="w-3.5 h-3.5 text-command-accent-glow" />
              <span>SCIENTIFIC & LEGAL NOTICE</span>
            </div>
            <p className="leading-relaxed">
              Risk scores are generated via transparent weighted MCDA and presented strictly as <strong>"Prototype risk score"</strong>. They represent decision-support indices rather than definitive predictive forecasts.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Map Viewport & Zone Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Interactive Map */}
          <div className="h-[380px] w-full rounded-lg overflow-hidden border border-command-border">
            <InteractiveMap
              layers={layers}
              onToggleLayer={onToggleLayer}
              onOpacityChange={onOpacityChange}
              activeAoiName={`Risk AOI: ${selectedZone.name}`}
              coordinates={selectedZone.coordinates}
              heightClass="h-[380px]"
              focusedWaypoint={focusedWaypoint}
            />
          </div>

          {/* Deep Explainability Breakdown Panel */}
          <RiskBreakdown
            zone={selectedZone}
            onFocusZone={handleFocusZone}
          />
        </div>
      </div>
    </div>
  );
};
