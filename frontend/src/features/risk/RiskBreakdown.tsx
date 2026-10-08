import React from 'react';
import type { RiskZone } from '../../types/risk';
import { RiskScore } from './RiskScore';
import { RiskFactorCard } from './RiskFactorCard';
import { 
  ShieldAlert, 
  MapPin, 
  Compass, 
  Calculator, 
  ListOrdered, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface RiskBreakdownProps {
  zone: RiskZone;
  onFocusZone?: (coords: [number, number]) => void;
}

export const RiskBreakdown: React.FC<RiskBreakdownProps> = ({
  zone,
  onFocusZone,
}) => {
  const factorKeys: (keyof typeof zone.factors)[] = [
    'slope',
    'elevation',
    'rainfall',
    'geology',
    'satelliteChange',
    'historicalRisk',
  ];

  const getContribution = (key: string) => {
    return zone.contributions.find((c) => c.key === key);
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-2xl space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-accent-glow">
              {zone.id}
            </span>
            <span className="text-xs text-command-muted">
              {zone.sector}
            </span>
          </div>

          <h3 className="text-sm font-bold text-command-text leading-snug">
            {zone.name}
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-command-dim mt-1">
            <MapPin className="w-3 h-3 text-command-accent-glow" />
            <span>{zone.coordinates[1].toFixed(4)}°N, {zone.coordinates[0].toFixed(4)}°E</span>
            <span>•</span>
            <span className="truncate max-w-xs" title={zone.coordinateProvenance}>
              Source: {zone.coordinateProvenance}
            </span>
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

      {/* Concise Factors Summary Table (Prompt Example Format) */}
      <div className="p-3 rounded-lg bg-command-panel/90 border border-command-border space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-command-border/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-command-text">
            <ListOrdered className="w-3.5 h-3.5 text-command-accent-glow" />
            <span className="uppercase">WHY THIS ZONE RECEIVED ITS SCORE:</span>
          </div>
          <span className="text-[10px] text-command-dim">EXPLAINABILITY SUMMARY</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {factorKeys.map((key) => {
            const factor = zone.factors[key];
            const level = factor.level;
            let levelColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
            if (level === 'VERY_HIGH' || level === 'HIGH') {
              levelColor = 'text-rose-400 bg-rose-950/60 border-rose-800';
            } else if (level === 'MEDIUM') {
              levelColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
            } else if (level === 'DATA_UNAVAILABLE') {
              levelColor = 'text-slate-400 bg-slate-900 border-slate-700';
            }

            return (
              <div key={key} className="p-2 rounded bg-command-surface/70 border border-command-border space-y-1">
                <span className="text-[10px] text-command-dim block font-bold truncate">
                  {factor.label.replace(' Gradient', '').replace(' Confinement', '').replace(' Trigger', '')}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border block text-center truncate ${levelColor}`}>
                  {level.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Multi-Factor Breakdown Cards Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-command-text uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-tactical-amber" />
            <span>FACTOR MEASUREMENTS & DATA TELEMETRY</span>
          </h4>
          <span className="text-[10px] text-command-dim">6 MULTI-CRITERIA FACTORS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {factorKeys.map((key) => (
            <RiskFactorCard
              key={key}
              factor={zone.factors[key]}
              contribution={getContribution(key)}
            />
          ))}
        </div>
      </div>

      {/* Transparent Formula Step-by-Step Walkthrough */}
      <div className="p-3 rounded-lg bg-command-panel/90 border border-command-border space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-command-text">
          <Calculator className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="uppercase">MATHEMATICAL SCORING FORMULATION (TRANSPARENT WALKTHROUGH):</span>
        </div>

        <div className="p-2.5 rounded bg-command-surface border border-command-border/80 font-mono text-[11px] text-command-accent-glow overflow-x-auto">
          {zone.formulaWalkthrough ? zone.formulaWalkthrough : `Score = ∑ (w_i × s_i) / ∑ w_available = ${zone.scaledScore}/100 [${zone.riskLevel}]`}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-command-dim pt-1">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-command-accent-glow" />
            <span>Input Data Completeness: <strong>{zone.dataCompletenessPercentage}%</strong> ({6 - zone.missingFactorsCount}/6 factors active)</span>
          </span>
          <span className="text-command-dim italic">
            * Missing factor weights are dynamically renormalized without artificial zero-assumption.
          </span>
        </div>
      </div>

      {/* Primary Vulnerabilities & Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Vulnerabilities */}
        <div className="p-3 rounded bg-command-panel border border-command-border space-y-1.5">
          <span className="text-[10px] text-rose-400 font-bold uppercase block">
            Primary Vulnerabilities Identified:
          </span>
          <ul className="space-y-1 text-[11px] text-command-muted">
            {zone.primaryVulnerabilities.map((vuln, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <ChevronRight className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                <span>{vuln}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decision-Support Recommendation */}
        <div className="p-3 rounded bg-command-panel border border-command-border space-y-1.5">
          <span className="text-[10px] text-amber-300 font-bold uppercase block">
            Decision-Support Operational Recommendation:
          </span>
          <p className="text-[11px] text-command-text leading-relaxed">
            {zone.recommendedDecisionAction}
          </p>
          <div className="pt-2 border-t border-command-border/40 text-[9px] text-command-dim italic">
            * Advisory directive for Incident Commander & Emergency Operations Center review (Does not issue autonomous evacuation orders).
          </div>
        </div>
      </div>

      {/* Scientific Safety Notice */}
      <div className="p-2.5 rounded bg-amber-950/20 border border-amber-800/40 text-[10px] text-amber-300/80 flex items-center justify-between">
        <span><strong>LEGAL & SCIENTIFIC NOTICE:</strong> Prototype risk scores do not predict exact event timing or represent validated hazard probabilities.</span>
      </div>

      {/* Center Map Footer */}
      {onFocusZone && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onFocusZone(zone.coordinates)}
            className="px-4 py-2 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center gap-2 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CENTER MAP ON {zone.id}</span>
          </button>
        </div>
      )}
    </div>
  );
};
