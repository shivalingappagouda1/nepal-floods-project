import React, { useState } from 'react';
import type { RiskZone } from '../../types/risk';
import { RiskScore } from './RiskScore';
import { 
  MapPin, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle
} from 'lucide-react';

interface RiskBreakdownProps {
  zone: RiskZone;
  onFocusZone?: (coords: [number, number]) => void;
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({
  zone,
  onFocusZone,
}) => {
  const [showAllFactors, setShowAllFactors] = useState(false);

  const factorDisplayNames: Record<string, { label: string; desc: string }> = {
    slope: { label: 'Hillside Steepness', desc: 'Steeper mountain slopes carry higher landslide potential' },
    rainfall: { label: 'Rainfall Saturation', desc: 'Monsoon rainfall accumulation loosening soil' },
    satelliteChange: { label: 'Satellite Surface Change', desc: 'Detected changes in river width or vegetation loss' },
    elevation: { label: 'Valley Elevation', desc: 'Low gorge elevation relative to peak ridges' },
    geology: { label: 'Rock & Soil Formation', desc: 'Weathered metamorphic rock stability index' },
    historicalRisk: { label: 'Historical Disaster Records', desc: 'Past frequency of flood surges and rockfalls' },
  };

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 font-sans shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-700 dark:text-command-accent-glow">
              {zone.id}
            </span>
            <span className="text-xs text-slate-500 dark:text-command-muted font-medium">
              {zone.sector}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-command-text leading-snug">
            {zone.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-command-dim mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{zone.coordinates[1].toFixed(4)}°N, {zone.coordinates[0].toFixed(4)}°E</span>
          </div>
        </div>

        {/* Dynamic Composite Score */}
        <div className="self-start sm:self-auto">
          <RiskScore
            score={zone.scaledScore}
            riskLevel={zone.riskLevel}
            dataCompletenessPercentage={zone.dataCompletenessPercentage}
            size="lg"
          />
        </div>
      </div>

      {/* Primary Drivers Breakdown in Plain Language */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel/90 border border-slate-200 dark:border-command-border space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
          <span className="text-xs font-bold text-slate-800 dark:text-command-text">
            Why was this score calculated?
          </span>
          <span className="text-[11px] text-slate-500">
            Top factors
          </span>
        </div>

        <div className="space-y-2.5">
          {zone.contributions.slice(0, showAllFactors ? zone.contributions.length : 3).map((contrib) => {
            const info = factorDisplayNames[contrib.key] || { label: contrib.label, desc: '' };
            return (
              <div key={contrib.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-command-text">{info.label}</span>
                  <span className="font-bold text-blue-600 dark:text-sky-400">{(contrib.normalizedScore * 100).toFixed(0)} / 100</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-command-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(0, contrib.normalizedScore * 100))}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-command-dim">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setShowAllFactors(!showAllFactors)}
          className="text-xs font-semibold text-blue-600 hover:underline pt-1 flex items-center gap-1 cursor-pointer"
        >
          <span>{showAllFactors ? 'Show fewer factors' : 'Show all 6 model factors'}</span>
          {showAllFactors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Caution notice */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Model estimate only:</strong> A higher score means this terrain has environmental risk factors (steep slopes, heavy rain). It does not confirm an active disaster without on-the-ground reports.
        </div>
      </div>

      {/* Map Action Button */}
      {onFocusZone && (
        <div className="pt-1">
          <button
            onClick={() => onFocusZone(zone.coordinates)}
            className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Center Map on {zone.name}</span>
          </button>
        </div>
      )}
    </div>
  );
};
