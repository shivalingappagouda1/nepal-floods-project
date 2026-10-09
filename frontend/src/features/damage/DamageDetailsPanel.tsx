import React, { useState } from 'react';
import type { DamageFeature } from '../../types/damage';
import { DAMAGE_CATEGORY_CONFIGS } from '../../data/damageConfigs';
import { EvidencePanel } from './EvidencePanel';
import { 
  Compass, 
  Send,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DamageDetailsPanelProps {
  feature: DamageFeature;
  onFocusFeature: (coords: [number, number]) => void;
  onAssignFieldInspection?: (featureId: string) => void;
}

export const DamageDetailsPanel: React.FC<DamageDetailsPanelProps> = ({
  feature,
  onFocusFeature,
  onAssignFieldInspection,
}) => {
  const categoryConfig = DAMAGE_CATEGORY_CONFIGS[feature.category];
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 font-sans shadow-xs space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border/70">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-700 dark:text-command-accent-glow">
              {feature.id}
            </span>

            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${categoryConfig.badgeClass}`}>
              {feature.categoryLabel}
            </span>

            <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-300 font-medium">
              Prototype estimate
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-command-text leading-snug">
            {feature.name}
          </h3>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onFocusFeature(feature.coordinates)}
          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Show on Map</span>
        </button>
      </div>

      {/* Summary Box */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-2 text-xs">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold uppercase block">
            Observed Changes from Satellite / GIS:
          </span>
          <p className="text-slate-800 dark:text-command-text text-xs font-medium leading-relaxed mt-0.5">
            {feature.affectedDimension}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200/80 dark:border-command-border/40">
          <span className="text-[11px] text-slate-500 font-semibold uppercase block">
            Recommended Next Step:
          </span>
          <p className="text-amber-800 dark:text-amber-300 text-xs font-medium leading-relaxed mt-0.5">
            {feature.recommendedResponse}
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Ground check recommended:</strong> This is a satellite-detected surface anomaly. Physical safety or structural damage can only be confirmed by on-site teams.
        </div>
      </div>

      {/* Progressive Disclosure: Technical Details Toggle */}
      <div className="border-t border-slate-200 dark:border-command-border/60 pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
        >
          <span>Advanced Evidence & Technical Data</span>
          {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTechnicalDetails && (
          <div className="mt-3 space-y-3 animate-in slide-in-from-top-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">GPS COORDINATES</span>
                <span className="font-semibold text-slate-800">{feature.coordinates[1].toFixed(4)}° N, {feature.coordinates[0].toFixed(4)}° E</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-semibold">DATA SOURCE</span>
                <span className="font-semibold text-blue-700">{feature.source}</span>
              </div>
            </div>

            <EvidencePanel feature={feature} />
          </div>
        )}
      </div>

      {/* Inspection CTA */}
      {onAssignFieldInspection && (
        <div className="pt-2">
          <button
            onClick={() => onAssignFieldInspection(feature.id)}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Mark for Field Inspection Queue</span>
          </button>
        </div>
      )}
    </div>
  );
};
