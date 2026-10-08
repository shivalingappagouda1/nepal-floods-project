import React, { useState } from 'react';
import type { RiskZone } from '../../types/risk';
import { RiskScore } from './RiskScore';
import { RiskFactorCard } from './RiskFactorCard';
import { 
  MapPin, 
  Compass, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
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
  const [showFormula, setShowFormula] = useState(false);

  const factorKeys: (keyof typeof zone.factors)[] = [
    'slope',
    'elevation',
    'rainfall',
    'geology',
    'satelliteChange',
    'historicalRisk',
  ];

  const top3Keys: (keyof typeof zone.factors)[] = ['slope', 'rainfall', 'satelliteChange'];

  const getContribution = (key: string) => {
    return zone.contributions.find((c) => c.key === key);
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 font-mono shadow-xl space-y-3">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2.5 border-b border-command-border/70">
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

      {/* Top 3 Factors Quick Overview */}
      <div className="p-2.5 rounded-lg bg-command-panel/90 border border-command-border space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-command-border/50">
          <span className="text-[11px] font-bold text-command-text uppercase">
            PRIMARY RISK DRIVERS
          </span>
          <button
            onClick={() => setShowAllFactors(!showAllFactors)}
            className="text-[10px] text-command-accent-glow hover:underline flex items-center gap-1 font-bold"
          >
            <span>{showAllFactors ? 'SHOW TOP 3 ONLY' : 'VIEW ALL 6 FACTORS'}</span>
            {showAllFactors ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Top Factors Grid */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {(showAllFactors ? factorKeys : top3Keys).map((key) => {
            const factor = zone.factors[key];
            const level = factor.level;
            let levelColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
            if (level === 'VERY_HIGH' || level === 'HIGH') {
              levelColor = 'text-rose-400 bg-rose-950/60 border-rose-800';
            } else if (level === 'MEDIUM') {
              levelColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
            }

            return (
              <div key={key} className="p-2 rounded bg-command-surface/70 border border-command-border space-y-0.5">
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

      {/* Expandable All 6 Factor Details */}
      {showAllFactors && (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {factorKeys.map((key) => (
              <RiskFactorCard
                key={key}
                factor={zone.factors[key]}
                contribution={getContribution(key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Decision-Support Recommendation */}
      <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-1 text-xs">
        <span className="text-[10px] text-amber-300 font-bold uppercase block">
          Decision-Support Operational Recommendation:
        </span>
        <p className="text-[11px] text-command-text leading-relaxed">
          {zone.recommendedDecisionAction}
        </p>
      </div>

      {/* Collapsible Formula Drawer */}
      <div className="border border-command-border rounded-lg overflow-hidden">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full px-3 py-2 bg-command-surface/60 hover:bg-command-surface flex items-center justify-between text-xs font-bold text-command-muted transition-colors"
        >
          <div className="flex items-center gap-1.5 text-command-text">
            <Calculator className="w-3.5 h-3.5 text-command-accent-glow" />
            <span>MCDA MATHEMATICAL FORMULATION</span>
          </div>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormula && (
          <div className="p-3 bg-command-panel/90 border-t border-command-border space-y-2 text-xs">
            <div className="p-2 rounded bg-command-surface border border-command-border font-mono text-[11px] text-command-accent-glow overflow-x-auto">
              {zone.formulaWalkthrough || `Score = ∑ (w_i × s_i) / ∑ w_available = ${zone.scaledScore}/100 [${zone.riskLevel}]`}
            </div>
            <div className="text-[10px] text-command-dim">
              Input Data Completeness: <strong>{zone.dataCompletenessPercentage}%</strong> ({6 - zone.missingFactorsCount}/6 factors active)
            </div>
          </div>
        )}
      </div>

      {/* Center Map Footer */}
      {onFocusZone && (
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onFocusZone(zone.coordinates)}
            className="px-3 py-1.5 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CENTER MAP ON {zone.id}</span>
          </button>
        </div>
      )}
    </div>
  );
};
