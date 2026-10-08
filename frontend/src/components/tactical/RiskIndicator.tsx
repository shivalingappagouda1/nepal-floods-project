import React from 'react';
import type { SeverityLevel, ProvenanceMeta } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { ShieldAlert } from 'lucide-react';

interface RiskIndicatorProps {
  score: number; // 0 to 100
  zoneName: string;
  severity: SeverityLevel;
  provenance: ProvenanceMeta;
  breakdown?: {
    floodFactor: number; // 0 - 100
    debrisFactor: number;
    lifelineFactor: number;
    isolationFactor: number;
  };
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
  }
}) => {
  const getSeverityTheme = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          textColor: 'text-tactical-critical',
          borderColor: 'border-tactical-critical/50',
          bgGlow: 'bg-tactical-critical/10',
          badge: 'CRITICAL HAZARD',
          badgeClass: 'bg-rose-950/80 text-rose-400 border-rose-800',
        };
      case 'HIGH':
        return {
          textColor: 'text-tactical-high',
          borderColor: 'border-tactical-high/50',
          bgGlow: 'bg-tactical-high/10',
          badge: 'HIGH HAZARD',
          badgeClass: 'bg-orange-950/80 text-orange-400 border-orange-800',
        };
      case 'MODERATE':
        return {
          textColor: 'text-tactical-moderate',
          borderColor: 'border-tactical-moderate/50',
          bgGlow: 'bg-tactical-moderate/10',
          badge: 'MODERATE HAZARD',
          badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-800',
        };
      case 'LOW':
        return {
          textColor: 'text-tactical-low',
          borderColor: 'border-tactical-low/50',
          bgGlow: 'bg-tactical-low/10',
          badge: 'LOW HAZARD',
          badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
        };
      default:
        return {
          textColor: 'text-tactical-cyan',
          borderColor: 'border-tactical-cyan/50',
          bgGlow: 'bg-tactical-cyan/10',
          badge: 'MONITORING',
          badgeClass: 'bg-sky-950/80 text-sky-400 border-sky-800',
        };
    }
  };

  const theme = getSeverityTheme(severity);

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 relative overflow-hidden">
      {/* Background visual indicator */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${theme.bgGlow} filter blur-2xl -mr-10 -mt-10 pointer-events-none`} />

      <div className="flex items-center justify-between pb-3 border-b border-command-border/60">
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${theme.textColor}`} />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-command-text">
            COMPOSITE RISK INDEX
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold tracking-wider ${theme.badgeClass}`}>
          {theme.badge}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4 items-center">
        {/* Main Score Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-command-panel rounded-lg border border-command-border">
          <div className="relative flex items-center justify-center">
            <span className={`font-mono text-4xl font-extrabold tracking-tight ${theme.textColor}`}>
              {score > 0 ? score : '—'}
            </span>
            <span className="text-xs font-mono text-command-dim ml-1">/100</span>
          </div>
          <span className="text-[10px] font-mono text-command-muted uppercase tracking-wider mt-1 text-center truncate max-w-full">
            {zoneName}
          </span>
        </div>

        {/* Multi-Criteria Sub-factors */}
        <div className="md:col-span-7 space-y-2">
          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1 text-command-muted">
              <span>Debris Flow Hazard</span>
              <span className="text-command-text font-bold">{breakdown.debrisFactor}%</span>
            </div>
            <div className="w-full h-1.5 bg-command-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.debrisFactor}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1 text-command-muted">
              <span>Flood Inundation Velocity</span>
              <span className="text-command-text font-bold">{breakdown.floodFactor}%</span>
            </div>
            <div className="w-full h-1.5 bg-command-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.floodFactor}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-mono mb-1 text-command-muted">
              <span>Lifeline Cutoff / Isolation</span>
              <span className="text-command-text font-bold">{breakdown.isolationFactor}%</span>
            </div>
            <div className="w-full h-1.5 bg-command-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${breakdown.isolationFactor}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Provenance & Confidence footer */}
      <div className="pt-3 border-t border-command-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <DataSourceBadge provenance={provenance} />
        <ConfidenceBadge confidence={provenance.confidence} method={provenance.algorithm} />
      </div>
    </div>
  );
};
