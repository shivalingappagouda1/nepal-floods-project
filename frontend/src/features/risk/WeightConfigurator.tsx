import React from 'react';
import type { RiskWeights } from '../../types/risk';
import { WEIGHT_PRESETS } from '../../services/RiskAnalysisService';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';

interface WeightConfiguratorProps {
  weights: RiskWeights;
  onWeightsChange: (newWeights: RiskWeights) => void;
  onReset: (presetId?: string) => void;
}

export const WeightConfigurator: React.FC<WeightConfiguratorProps> = ({
  weights,
  onWeightsChange,
  onReset,
}) => {
  const handleSliderChange = (key: keyof RiskWeights, rawValue: number) => {
    const val = rawValue / 100;
    onWeightsChange({
      ...weights,
      [key]: val,
    });
  };

  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-command-border">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-command-accent-glow" />
          <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
            MULTI-FACTOR WEIGHT CONFIGURATION
          </h3>
        </div>

        <button
          onClick={() => onReset()}
          className="px-2.5 py-1 rounded bg-command-surface hover:bg-command-border border border-command-border text-[10px] font-bold text-command-muted hover:text-command-text flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET DEFAULTS</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-command-dim font-bold uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>PROTOTYPE SCENARIO CONFIGURATIONS (CONFIGURABLE PARAMETERS):</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
          {WEIGHT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onReset(preset.id)}
              className="p-2 rounded border text-left bg-command-panel/70 border-command-border hover:border-command-accent hover:bg-command-surface transition-all text-xs group"
              title={preset.description}
            >
              <div className="font-bold text-[10px] text-command-text group-hover:text-command-accent-glow truncate">
                {preset.name}
              </div>
              <div className="text-[9px] text-command-dim line-clamp-1 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {/* Slope Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Slope Gradient</span>
            <span className="text-rose-400 font-bold">{(weights.slopeWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.slopeWeight * 100)}
            onChange={(e) => handleSliderChange('slopeWeight', parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">Gravitational shear stress</span>
        </div>

        {/* Elevation Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Valley Elevation</span>
            <span className="text-blue-400 font-bold">{(weights.elevationWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.elevationWeight * 100)}
            onChange={(e) => handleSliderChange('elevationWeight', parseInt(e.target.value, 10))}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">Gorge funneling & head</span>
        </div>

        {/* Rainfall Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Rainfall Trigger</span>
            <span className="text-sky-400 font-bold">{(weights.rainfallWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.rainfallWeight * 100)}
            onChange={(e) => handleSliderChange('rainfallWeight', parseInt(e.target.value, 10))}
            className="w-full accent-sky-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">24h precipitation intensity</span>
        </div>

        {/* Geology Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Bedrock Geology</span>
            <span className="text-amber-400 font-bold">{(weights.geologyWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.geologyWeight * 100)}
            onChange={(e) => handleSliderChange('geologyWeight', parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">Rock shear & faulting</span>
        </div>

        {/* Satellite Change Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Satellite Change</span>
            <span className="text-purple-400 font-bold">{(weights.satelliteChangeWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.satelliteChangeWeight * 100)}
            onChange={(e) => handleSliderChange('satelliteChangeWeight', parseInt(e.target.value, 10))}
            className="w-full accent-purple-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">MNDWI & SAR deltas</span>
        </div>

        {/* Historical Risk Weight */}
        <div className="p-2.5 rounded bg-command-panel/80 border border-command-border space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-command-text">Historical Recurrence</span>
            <span className="text-emerald-400 font-bold">{(weights.historicalRiskWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={Math.round(weights.historicalRiskWeight * 100)}
            onChange={(e) => handleSliderChange('historicalRiskWeight', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-command-surface rounded"
          />
          <span className="text-[9px] text-command-dim block">GLOF & debris flood records</span>
        </div>
      </div>

      {/* Disclaimers & Normalization Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-command-border/60 text-[10px] text-command-dim">
        <span>
          Nominal Sum: <strong>{(totalWeightSum * 100).toFixed(0)}%</strong> (Auto-normalized during zone calculation).
        </span>
        <span className="text-amber-300/80 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/50">
          Weights are configurable decision-support parameters, not scientifically universal constants.
        </span>
      </div>
    </div>
  );
};
