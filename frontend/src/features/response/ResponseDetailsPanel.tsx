import React, { useState } from 'react';
import type { PriorityZone } from '../../types/response';
import { RouteAnalysisViewer } from './RouteAnalysisViewer';
import { 
  MapPin, 
  Compass, 
  FileCheck, 
  Layers, 
  UserCheck,
  ChevronDown,
  ChevronUp
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
  const [showTechnicalFactors, setShowTechnicalFactors] = useState(false);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PRIORITY_1':
        return 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/90 dark:text-rose-300 dark:border-rose-600';
      case 'PRIORITY_2':
        return 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950/90 dark:text-orange-300 dark:border-orange-600';
      case 'PRIORITY_3':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-600';
    }
  };

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 font-sans shadow-xs space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getTierBadge(zone.priorityTier)}`}>
              {zone.priorityTier.replace('_', ' ')}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-command-surface border border-slate-200 text-slate-700">
              {zone.id}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
              Synthetic Scenario Case
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-command-text leading-snug">
            {zone.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-command-dim mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{zone.coordinates[1].toFixed(4)}°N, {zone.coordinates[0].toFixed(4)}°E • Sector: {zone.sector}</span>
          </div>
        </div>

        {/* Priority Score */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 text-right self-start sm:self-auto">
          <div className="text-sm font-extrabold text-blue-700 dark:text-sky-400">
            {zone.score}/100
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Priority Score
          </div>
        </div>
      </div>

      {/* Decision-Support Recommendation Action Box */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-command-panel border border-blue-200 dark:border-command-border space-y-2.5 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/70 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-sky-300">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>Advisory Emergency Guidance</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
            Human Review Required
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-command-text leading-relaxed bg-white dark:bg-command-surface/60 p-3 rounded-xl border border-slate-200">
          "{zone.recommendedAction}"
        </p>

        <p className="text-[11px] text-slate-500 italic">
          This system provides advisory prioritization only. It does not dispatch relief teams or order evacuations. Official deployment remains the sole responsibility of the Incident Commander and local authorities.
        </p>
      </div>

      {/* Route & Road Status */}
      <RouteAnalysisViewer
        routeStatus={zone.routeStatus}
        zoneName={zone.name}
      />

      {/* Progressive Disclosure: Technical Factors */}
      <div className="border-t border-slate-200 dark:border-command-border/60 pt-2">
        <button
          onClick={() => setShowTechnicalFactors(!showTechnicalFactors)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Underlying Scenario Priority Factors (6 Factors)</span>
          </div>
          {showTechnicalFactors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalFactors && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-in slide-in-from-top-1">
            {Object.values(zone.factors).map((factor) => (
              <div key={factor.key} className="p-2.5 rounded-xl bg-slate-50 dark:bg-command-surface border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block font-semibold truncate">
                  {factor.label}
                </span>
                <span className="text-xs text-slate-900 font-bold block truncate">
                  {factor.statusDisplay}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2">
        <button
          onClick={() => onFocusZone(zone.coordinates)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Show {zone.name} on Map</span>
        </button>

        {onApproveActionDirective && (
          <button
            onClick={() => onApproveActionDirective(zone.id, zone.recommendedAction)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Mark Directive Reviewed</span>
          </button>
        )}
      </div>
    </div>
  );
};
