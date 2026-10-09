import React from 'react';
import type { RiskLevel } from '../../types/risk';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  prototypeLabel = 'Prototype estimate',
  dataCompletenessPercentage = 100,
  size = 'md',
  showDetails = true,
}) => {
  const getLevelTheme = (level: RiskLevel) => {
    switch (level) {
      case 'EXTREME':
        return {
          color: 'text-purple-700 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-950/80',
          border: 'border-purple-300 dark:border-purple-600',
          icon: <ShieldAlert className="w-4 h-4 text-purple-600" />,
        };
      case 'VERY HIGH':
        return {
          color: 'text-rose-700 dark:text-rose-400',
          bg: 'bg-rose-50 dark:bg-rose-950/80',
          border: 'border-rose-300 dark:border-rose-600',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
        };
      case 'HIGH':
        return {
          color: 'text-orange-700 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-950/80',
          border: 'border-orange-300 dark:border-orange-600',
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
        };
      case 'MODERATE':
        return {
          color: 'text-amber-800 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/80',
          border: 'border-amber-300 dark:border-amber-600',
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-700 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/80',
          border: 'border-emerald-300 dark:border-emerald-600',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
    }
  };

  const theme = getLevelTheme(riskLevel);

  return (
    <div className="font-sans inline-flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border ${theme.bg} ${theme.border}`}>
          {theme.icon}
          <span className={`font-bold ${theme.color} ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
            {riskLevel} CONCERN
          </span>
          <span className="text-slate-300 dark:text-command-dim text-xs">|</span>
          <span className={`font-extrabold text-slate-900 dark:text-command-text ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
            {score}/100
          </span>
        </div>

        <span className="text-[11px] text-slate-500 dark:text-command-dim font-medium border border-slate-200 dark:border-command-border px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-command-surface" title="Multi-Criteria Weighted Model">
          {prototypeLabel}
        </span>
      </div>

      {showDetails && (
        <span className="text-[11px] text-slate-400 dark:text-command-dim">
          * Prototype estimate ({dataCompletenessPercentage}% data completeness) from terrain, weather & history.
        </span>
      )}
    </div>
  );
};
