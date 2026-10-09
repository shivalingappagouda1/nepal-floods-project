import React from 'react';
import type { DataTier, ProvenanceMeta } from '../../types';
import { ShieldCheck, Cpu, AlertTriangle, Clock, Radio, MapPin } from 'lucide-react';

interface DataSourceBadgeProps {
  provenance: ProvenanceMeta;
  showDetails?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ provenance, showDetails = false }) => {
  const getBadgeConfig = (tier: DataTier | string) => {
    switch (tier) {
      case 'LIVE_OBSERVED':
        return {
          label: 'Live Sensor Feed',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500 animate-pulse',
          icon: Radio,
        };
      case 'VERIFIED_GEODATASET':
      case 'VERIFIED':
        return {
          label: 'Official GIS Data',
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-400',
          dot: 'bg-emerald-600',
          icon: ShieldCheck,
        };
      case 'AI_COMPUTED':
        return {
          label: 'Model Estimate',
          bg: 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-sky-950/60 dark:border-sky-700 dark:text-sky-400',
          dot: 'bg-blue-600',
          icon: Cpu,
        };
      case 'DEMO_VALUE':
        return {
          label: 'Demonstration Data',
          bg: 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/70 dark:border-amber-700 dark:text-amber-300',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'AWAITING_PASS':
        return {
          label: 'Awaiting Satellite Pass',
          bg: 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-400',
          dot: 'bg-slate-400',
          icon: Clock,
        };
      default:
        return {
          label: typeof tier === 'string' ? tier : 'Data Feed',
          bg: 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-sky-950/60 dark:border-sky-700 dark:text-sky-400',
          dot: 'bg-blue-600',
          icon: MapPin,
        };
    }
  };

  const config = getBadgeConfig(provenance.tier);
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col gap-0.5">
      <div 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-sans ${config.bg}`}
        title={`Source: ${provenance.source} | Method: ${provenance.algorithm || 'Direct telemetry'}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-medium">{config.label}</span>
      </div>
      {showDetails && (
        <span className="text-[11px] text-slate-500 dark:text-command-dim truncate max-w-[220px]" title={provenance.source}>
          {provenance.source}
        </span>
      )}
    </div>
  );
};
