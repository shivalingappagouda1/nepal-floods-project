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
          label: 'LIVE OBSERVED',
          bg: 'bg-emerald-950/80 border-emerald-600 text-emerald-300',
          dot: 'bg-emerald-400 animate-pulse',
          icon: Radio,
        };
      case 'VERIFIED_GEODATASET':
      case 'VERIFIED':
        return {
          label: 'VERIFIED GIS DATA',
          bg: 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400',
          dot: 'bg-emerald-500',
          icon: ShieldCheck,
        };
      case 'AI_COMPUTED':
        return {
          label: 'AI / COMPUTED',
          bg: 'bg-sky-950/60 border-sky-700/50 text-sky-400',
          dot: 'bg-sky-400',
          icon: Cpu,
        };
      case 'DEMO_VALUE':
        return {
          label: 'CASE STUDY / DEMO',
          bg: 'bg-amber-950/70 border-amber-700/60 text-amber-300',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
        };
      case 'AWAITING_PASS':
        return {
          label: 'AWAITING PASS',
          bg: 'bg-slate-900/80 border-slate-700/60 text-slate-400',
          dot: 'bg-slate-500',
          icon: Clock,
        };
      default:
        return {
          label: typeof tier === 'string' ? tier : 'DATA FEED',
          bg: 'bg-sky-950/60 border-sky-700/50 text-sky-400',
          dot: 'bg-sky-400',
          icon: MapPin,
        };
    }
  };

  const config = getBadgeConfig(provenance.tier);
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col gap-0.5">
      <div 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono tracking-wider uppercase ${config.bg}`}
        title={`Source: ${provenance.source} | Method: ${provenance.algorithm || 'Direct telemetry'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <Icon className="w-3 h-3" />
        <span className="font-semibold">{config.label}</span>
      </div>
      {showDetails && (
        <span className="text-[9px] font-mono text-command-dim truncate max-w-[200px]" title={provenance.source}>
          {provenance.source}
        </span>
      )}
    </div>
  );
};
