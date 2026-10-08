import React from 'react';
import type { DamageFeature } from '../../types/damage';
import { DAMAGE_CATEGORY_CONFIGS } from '../../data/damageConfigs';
import { EvidencePanel } from './EvidencePanel';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { 
  Compass, 
  Send 
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

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-2xl space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-accent-glow">
              {feature.id}
            </span>

            <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${categoryConfig.badgeClass}`}>
              {feature.categoryLabel}
            </span>

            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-bold uppercase">
              {feature.processingStatus}
            </span>
          </div>

          <h3 className="text-sm font-bold text-command-text leading-snug">
            {feature.name}
          </h3>
        </div>

        {/* Confidence & Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ConfidenceIndicator
            confidence={feature.confidence}
            method={feature.confidenceMethod}
            size="md"
          />
        </div>
      </div>

      {/* Primary Telemetry & Verification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
        {/* Verification Status */}
        <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-0.5">
          <span className="text-[9px] text-command-dim block font-bold uppercase">VERIFICATION STATUS</span>
          <span className={`font-bold text-[11px] block ${
            feature.verificationStatus === 'Ground verification recommended'
              ? 'text-amber-300'
              : feature.verificationStatus === 'Verified by rapid field survey'
              ? 'text-emerald-400'
              : 'text-sky-300'
          }`}>
            {feature.verificationStatus}
          </span>
        </div>

        {/* Coordinates */}
        <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-0.5">
          <span className="text-[9px] text-command-dim block font-bold uppercase">COORDINATES</span>
          <span className="font-bold text-command-text text-[11px] block">
            {feature.coordinates[1].toFixed(4)}° N, {feature.coordinates[0].toFixed(4)}° E
          </span>
          <span className="text-[9px] text-command-dim italic block truncate" title={feature.coordinateProvenance}>
            Source: {feature.coordinateProvenance}
          </span>
        </div>

        {/* Source / Satellite Sensor */}
        <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-0.5">
          <span className="text-[9px] text-command-dim block font-bold uppercase">EVIDENCE SENSOR</span>
          <span className="font-bold text-command-accent-glow text-[10px] truncate block" title={feature.source}>
            {feature.source}
          </span>
        </div>

        {/* Evaluation Timestamp */}
        <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-0.5">
          <span className="text-[9px] text-command-dim block font-bold uppercase">OBSERVATION REFERENCE</span>
          <span className="font-bold text-command-muted text-[10px] block">
            {feature.timestamp}
          </span>
        </div>
      </div>

      {/* Affected Dimension & Directives */}
      <div className="p-3 rounded bg-command-panel/80 border border-command-border space-y-2 text-xs">
        <div>
          <span className="text-[10px] text-command-dim font-bold uppercase block">
            Observed Physical Modification (Image Evidence):
          </span>
          <p className="text-command-text text-[11px] font-semibold">
            {feature.affectedDimension}
          </p>
        </div>

        <div className="pt-2 border-t border-command-border/40">
          <span className="text-[10px] text-command-dim font-bold uppercase block">
            Decision-Support Recommendation:
          </span>
          <p className="text-amber-300 text-[11px]">
            {feature.recommendedResponse}
          </p>
        </div>
      </div>

      {/* Deep Evidence Panel */}
      <EvidencePanel feature={feature} />

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => onFocusFeature(feature.coordinates)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>CENTER MAP ON TARGET</span>
        </button>

        {onAssignFieldInspection && (
          <button
            onClick={() => onAssignFieldInspection(feature.id)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-command-accent hover:bg-sky-500 text-white text-xs font-bold shadow-tactical-glow flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>RECOMMEND FOR FIELD INSPECTION QUEUE</span>
          </button>
        )}
      </div>
    </div>
  );
};
