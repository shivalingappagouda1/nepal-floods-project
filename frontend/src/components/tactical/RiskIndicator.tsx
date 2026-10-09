import React, { useState } from 'react';
import type { SeverityLevel, ProvenanceMeta } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { ShieldAlert, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface RiskIndicatorProps {
  score: number; // 0 to 100
  zoneName: string;
  severity: SeverityLevel;
  provenance: ProvenanceMeta;
  breakdown?: {
    floodFactor: number;
    debrisFactor: number;
    lifelineFactor: number;
    isolationFactor: number;
  };
  isPrototype?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  score,
  zoneName,
  severity,
  provenance,
  breakdown = {
    floodFactor: 85,
    debrisFactor: 90,
    lifelineFactor: 75,
    isolationFactor: 80,
  },
  isPrototype = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getSeverityTheme = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          textColor: 'text-rose-600 dark:text-rose-400',
          badge: isPrototype ? 'Prototype Estimate: Elevated Concern' : 'Critical Exposure',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700',
          fillColor: 'bg-rose-600',
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-600 dark:text-orange-400',
          badge: isPrototype ? 'Prototype Estimate: High Concern' : 'High Exposure',
          badgeClass: 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700',
          fillColor: 'bg-orange-500',
        };
      case 'MODERATE':
        return {
          textColor: 'text-amber-600 dark:text-amber-400',
          badge: isPrototype ? 'Prototype Estimate: Moderate Concern' : 'Moderate Exposure',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700',
          fillColor: 'bg-amber-500',
        };
      case 'LOW':
        return {
          textColor: 'text-emerald-600 dark:text-emerald-400',
          badge: 'Low Concern',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700',
          fillColor: 'bg-emerald-500',
        };
      default:
        return {
          textColor: 'text-blue-600 dark:text-blue-400',
          badge: 'Advisory Monitoring',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700',
          fillColor: 'bg-blue-500',
        };
    }
  };

  const theme = getSeverityTheme(severity);

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 font-sans shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-command-border gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-5 h-5 ${theme.textColor}`} />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-command-text">
              Area Hazard Estimate
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-command-dim">
              Prototype estimate based on slope, river, and road data
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${theme.badgeClass}`}>
          {theme.badge}
        </span>
      </div>

      {/* Main Score Visual */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 dark:text-command-dim block font-medium">
            Calculated score for {zoneName}
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-3xl font-extrabold ${theme.textColor}`}>
              {score > 0 ? score : '—'}
            </span>
            <span className="text-sm text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium block mt-0.5">
            Prototype estimate (Requires field verification)
          </span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-command-border text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white dark:text-command-muted dark:hover:bg-command-surface flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>{showDetails ? 'Hide factors' : 'Why this score?'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Progressive Disclosure: Main Factors (Requirement 7) */}
      {showDetails && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-3 text-xs animate-in slide-in-from-top-1">
          <div className="font-semibold text-slate-700 dark:text-command-text">
            Key factors behind this calculation:
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-command-muted">
                <span>Steep slope & landslide susceptibility</span>
                <span className="font-semibold text-slate-800 dark:text-command-text">{breakdown.debrisFactor}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-command-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${breakdown.debrisFactor}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-command-muted">
                <span>River flood corridor proximity</span>
                <span className="font-semibold text-slate-800 dark:text-command-text">{breakdown.floodFactor}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-command-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-600 rounded-full" 
                  style={{ width: `${breakdown.floodFactor}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-600 dark:text-command-muted">
                <span>Road access & isolation risk</span>
                <span className="font-semibold text-slate-800 dark:text-command-text">{breakdown.isolationFactor}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-command-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${breakdown.isolationFactor}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Scientific / Verification Notice */}
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              A high calculated score indicates elevated environmental vulnerability in model data. It does not certify that a disaster has occurred or that a building is damaged without confirmation from local authorities.
            </div>
          </div>
        </div>
      )}

      {/* Provenance footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-command-border/60 flex items-center justify-between text-xs">
        <DataSourceBadge provenance={provenance} />
        <span className="text-[11px] text-slate-500">Method: Multi-Factor Model</span>
      </div>
    </div>
  );
};
