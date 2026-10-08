import React from 'react';
import type { RiskLevel } from '../../types/risk';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, Flame, HelpCircle } from 'lucide-react';

interface RiskScoreProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  prototypeLabel?: string;
  dataCompletenessPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  riskLevel,
  prototypeLabel = 'Prototype risk score',
  dataCompletenessPercentage = 100,
  size = 'md',
  showDetails = true,
}) => {
  const getLevelTheme = (level: RiskLevel) => {
    switch (level) {
      case 'EXTREME':
        return {
          color: 'text-purple-400',
          bg: 'bg-purple-950/80',
          border: 'border-purple-600',
          glow: 'shadow-[0_0_12px_rgba(168,85,247,0.35)]',
          icon: <Flame className="w-4 h-4 text-purple-400" />,
        };
      case 'VERY HIGH':
        return {
          color: 'text-rose-400',
          bg: 'bg-rose-950/80',
          border: 'border-rose-600',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
      case 'HIGH':
        return {
          color: 'text-orange-400',
          bg: 'bg-orange-950/80',
          border: 'border-orange-600',
          glow: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]',
          icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
        };
      case 'MODERATE':
        return {
          color: 'text-amber-400',
          bg: 'bg-amber-950/80',
          border: 'border-amber-600',
          glow: '',
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-600',
          glow: '',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
    }
  };

  const theme = getLevelTheme(riskLevel);

  return (
    <div className={`font-mono inline-flex flex-col gap-1 ${theme.glow}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${theme.bg} ${theme.border}`}>
          {theme.icon}
          <span className={`font-bold ${theme.color} ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
            {riskLevel} RISK
          </span>
          <span className="text-command-dim text-xs font-bold">|</span>
          <span className={`font-bold text-command-text ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
            {score}/100
          </span>
        </div>

        <span className="text-[10px] text-command-dim font-bold border border-command-border px-1.5 py-0.5 rounded bg-command-surface" title="Configurable Multi-Criteria Weighted Model">
          {prototypeLabel}
        </span>

        {dataCompletenessPercentage < 100 && (
          <span className="text-[9px] text-amber-300 font-bold bg-amber-950/80 border border-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1">
            <HelpCircle className="w-2.5 h-2.5" />
            <span>{dataCompletenessPercentage}% INPUT DATA COMPLETENESS</span>
          </span>
        )}
      </div>

      {showDetails && (
        <span className="text-[9px] text-command-dim italic">
          * Prototype risk score calculated from configurable multi-criteria normalization (Not an official government hazard certification).
        </span>
      )}
    </div>
  );
};
