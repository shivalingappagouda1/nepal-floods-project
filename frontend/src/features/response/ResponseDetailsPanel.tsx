import React from 'react';
import type { PriorityZone } from '../../types/response';
import { RouteAnalysisViewer } from './RouteAnalysisViewer';
import { 
  MapPin, 
  Compass, 
  FileCheck, 
  Layers, 
  UserCheck 
} from 'lucide-react';

interface ResponseDetailsPanelProps {
  zone: PriorityZone;
  onFocusZone: (coords: [number, number]) => void;
  onApproveActionDirective?: (zoneId: string, actionText: string) => void;
}

export const ResponseDetailsPanel: React.FC<ResponseDetailsPanelProps> = ({
  zone,
  onFocusZone,
  onApproveActionDirective,
}) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PRIORITY_1':
        return 'bg-rose-950/90 text-rose-300 border-rose-600';
      case 'PRIORITY_2':
        return 'bg-orange-950/90 text-orange-300 border-orange-600';
      case 'PRIORITY_3':
      default:
        return 'bg-amber-950/90 text-amber-300 border-amber-600';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-purple-950/80 text-purple-300 border-purple-700';
      case 'SEVERE':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 font-mono shadow-xl space-y-3">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2.5 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${getTierBadge(zone.priorityTier)}`}>
              {zone.priorityTier.replace('_', ' ')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-accent-glow">
              {zone.id}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${getSeverityBadge(zone.severity)}`}>
              {zone.severity} SEVERITY
            </span>
          </div>

          <h3 className="text-sm font-bold text-command-text leading-snug">
            {zone.name}
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-command-dim mt-1">
            <MapPin className="w-3 h-3 text-command-accent-glow" />
            <span>{zone.coordinates[1].toFixed(4)}°N, {zone.coordinates[0].toFixed(4)}°E</span>
          </div>
        </div>

        {/* Priority Score & Confidence */}
        <div className="flex flex-col sm:items-end gap-1 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded bg-command-panel border border-command-border text-right">
              <div className="text-xs font-bold text-command-text">
                {zone.score}/100
              </div>
              <div className="text-[9px] text-command-dim font-bold">
                PROTOTYPE RESPONSE PRIORITY SCORE
              </div>
            </div>

            <span
              className="inline-flex items-center text-[10px] font-mono text-command-dim border border-command-border px-2 py-1 rounded bg-command-panel/80"
              title="Numerical confidence omitted until empirical ground-truth validation is connected"
            >
              CONFIDENCE: Not available
            </span>
          </div>
        </div>
      </div>

      {/* Decision-Support Recommendation Action Box */}
      <div className="p-3 rounded-lg bg-command-panel border border-command-border space-y-2 text-xs">
        <div className="flex items-center justify-between pb-1 border-b border-command-border/50 flex-wrap gap-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase">
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Decision-Support Recommendation:</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-700">
              HUMAN REVIEW REQUIRED
            </span>
            <span className="text-[9px] text-sky-300 font-bold bg-sky-950/80 px-1.5 py-0.2 rounded border border-sky-700">
              DECISION-SUPPORT QUEUE ONLY
            </span>
          </div>
        </div>

        <p className="text-xs font-semibold text-command-text leading-relaxed bg-command-surface/60 p-2.5 rounded border border-command-border">
          "{zone.recommendedAction}"
        </p>
      </div>

      {/* Priority Inputs Matrix (6 Key Factors) */}
      <div className="p-2.5 rounded-lg bg-command-panel/90 border border-command-border space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-command-border/50 text-[11px] font-bold text-command-text">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
            <span className="uppercase">RESPONSE PRIORITY FACTORS:</span>
          </div>
          <span className="text-[10px] text-command-dim">DEMO / PRECOMPUTED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(zone.factors).map((factor) => {
            return (
              <div key={factor.key} className="p-2 rounded bg-command-surface border border-command-border space-y-1">
                <span className="text-[10px] text-command-dim block font-bold truncate">
                  {factor.label}
                </span>
                <span className="text-[10px] text-command-text font-bold block truncate">
                  {factor.statusDisplay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Analysis Component */}
      <RouteAnalysisViewer
        routeStatus={zone.routeStatus}
        zoneName={zone.name}
      />

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
        <button
          onClick={() => onFocusZone(zone.coordinates)}
          className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center justify-center gap-1.5 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>CENTER MAP ON {zone.id}</span>
        </button>

        {onApproveActionDirective && (
          <button
            onClick={() => onApproveActionDirective(zone.id, zone.recommendedAction)}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-command-accent hover:bg-sky-500 text-white text-xs font-bold shadow-tactical-glow flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>REVIEW DIRECTIVE</span>
          </button>
        )}
      </div>
    </div>
  );
};
