import React from 'react';
import type { RiskFactorMeasurement, FactorContribution } from '../../types/risk';
import { 
  Mountain, 
  ArrowDownCircle, 
  CloudRain, 
  Layers, 
  Satellite, 
  History, 
  AlertTriangle, 
  HelpCircle 
} from 'lucide-react';

interface RiskFactorCardProps {
  factor: RiskFactorMeasurement;
  contribution?: FactorContribution;
}

export const RiskFactorCard: React.FC<RiskFactorCardProps> = ({
  factor,
  contribution,
}) => {
  const getFactorIcon = (key: string) => {
    switch (key) {
      case 'slope':
        return <Mountain className="w-3.5 h-3.5 text-rose-400" />;
      case 'elevation':
        return <ArrowDownCircle className="w-3.5 h-3.5 text-blue-400" />;
      case 'rainfall':
        return <CloudRain className="w-3.5 h-3.5 text-sky-400" />;
      case 'geology':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'satelliteChange':
        return <Satellite className="w-3.5 h-3.5 text-purple-400" />;
      case 'historicalRisk':
      default:
        return <History className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'VERY_HIGH':
        return 'bg-purple-950/80 text-purple-300 border-purple-700';
      case 'HIGH':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
      case 'DATA_UNAVAILABLE':
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-slate-700';
    if (score >= 0.8) return 'bg-purple-500';
    if (score >= 0.6) return 'bg-rose-500';
    if (score >= 0.35) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`p-3 rounded-lg border font-mono space-y-2.5 transition-all ${
      factor.isAvailable 
        ? 'bg-command-panel/80 border-command-border' 
        : 'bg-slate-950/70 border-amber-800/80'
    }`}>
      {/* Header Strip */}
      <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-command-border/50">
        <div className="flex items-center gap-1.5">
          {getFactorIcon(factor.key)}
          <span className="text-xs font-bold text-command-text">
            {factor.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/80 text-amber-300 font-bold uppercase">
            {factor.processingStatus}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${getLevelBadge(factor.level)}`}>
            {factor.level.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Raw Value & Measurement */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] text-command-dim font-bold uppercase">Input Telemetry / Observation:</span>
          {factor.rawValue !== undefined && (
            <span className="text-xs font-bold text-command-accent-glow">
              {factor.rawValue} {factor.unit || ''}
            </span>
          )}
        </div>
        <p className="text-[11px] text-command-text font-medium mt-0.5">
          {factor.valueDescription}
        </p>
      </div>

      {/* Score Progress Bar & Contribution */}
      {factor.isAvailable && factor.normalizedScore !== undefined ? (
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between text-[10px] text-command-dim">
            <span>Normalized Score: {(factor.normalizedScore * 100).toFixed(0)}%</span>
            {contribution && (
              <span className="text-command-accent font-semibold">
                Weight: {(contribution.weight * 100).toFixed(0)}% ({contribution.percentageOfTotal}% of composite score)
              </span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-command-surface overflow-hidden border border-command-border/40">
            <div
              className={`h-full transition-all duration-500 ${getScoreColor(factor.normalizedScore)}`}
              style={{ width: `${Math.min(100, Math.max(0, factor.normalizedScore * 100))}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 flex items-start gap-1.5 text-[10px] text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">DATA GAP: </span>
            <span>{factor.missingDataReason || 'Metric currently unavailable. Weight renormalized across active sensors.'}</span>
          </div>
        </div>
      )}

      {/* Explainability Note */}
      <div className="pt-1.5 border-t border-command-border/40 text-[10px] text-command-muted leading-relaxed">
        <strong className="text-command-text">Why this matters: </strong>
        {factor.explainabilityNote}
      </div>

      {/* Provenance & Source Target */}
      <div className="flex flex-col gap-0.5 pt-1 border-t border-command-border/30 text-[9px] text-command-dim">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold">
            <HelpCircle className="w-2.5 h-2.5 text-command-dim" />
            <span>Target Catalog:</span>
          </span>
          <span className="truncate max-w-[220px] text-right" title={factor.dataSource}>
            {factor.dataSource}
          </span>
        </div>
        <div className="text-[8.5px] text-amber-300/70 italic text-right">
          Provenance: DEMO / ILLUSTRATIVE
        </div>
      </div>
    </div>
  );
};
