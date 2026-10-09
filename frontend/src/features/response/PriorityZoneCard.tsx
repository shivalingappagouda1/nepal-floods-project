import React from 'react';
import type { PriorityZone } from '../../types/response';
import { 
  AlertTriangle, 
  MapPin, 
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';

interface PriorityZoneCardProps {
  zone: PriorityZone;
  isSelected?: boolean;
  onSelectZone: (zone: PriorityZone) => void;
}

export const PriorityZoneCard: React.FC<PriorityZoneCardProps> = ({
  zone,
  isSelected = false,
  onSelectZone,
}) => {
  const getTierTheme = (tier: string) => {
    switch (tier) {
      case 'PRIORITY_1':
        return {
          badge: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700',
          label: 'Priority 1: Critical',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'PRIORITY_2':
        return {
          badge: 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700',
          label: 'Priority 2: High',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />,
        };
      case 'PRIORITY_3':
      default:
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700',
          label: 'Priority 3: Moderate',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />,
        };
    }
  };

  const theme = getTierTheme(zone.priorityTier);

  return (
    <div
      onClick={() => onSelectZone(zone)}
      className={`p-4 rounded-2xl border font-sans cursor-pointer transition-all space-y-2.5 ${
        isSelected
          ? 'bg-blue-50/70 border-blue-500 shadow-xs dark:bg-blue-950/40 dark:border-blue-500'
          : 'bg-white hover:bg-slate-50 border-slate-200 dark:bg-command-panel dark:border-command-border'
      }`}
    >
      {/* Top Priority Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-command-border/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${theme.badge}`}>
            {theme.icon}
            <span>{theme.label}</span>
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-command-dim">
            {zone.id}
          </span>
        </div>

        <div className="text-right">
          <span className="text-sm font-extrabold text-blue-700 dark:text-sky-400">
            {zone.score}/100
          </span>
          <span className="text-[10px] text-slate-400 block font-medium">
            Priority Score
          </span>
        </div>
      </div>

      {/* Zone Title & Sector */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-command-text leading-tight">
          {zone.name}
        </h4>
        <div className="text-xs text-slate-500 dark:text-command-dim flex items-center gap-1 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{zone.sector}</span>
        </div>
      </div>

      {/* Why in priority list? (Plain Language) */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-surface border border-slate-200/80 dark:border-command-border/50 text-xs space-y-1">
        <span className="font-semibold text-slate-700 dark:text-command-text block">
          Why is this location prioritized?
        </span>
        <ul className="space-y-1 text-slate-600 dark:text-command-muted text-[11px]">
          {zone.whyFactors?.length ? (
            zone.whyFactors.slice(0, 3).map((factor, idx) => (
              <li key={idx} className="line-clamp-1">• {factor}</li>
            ))
          ) : (
            <>
              <li>• Access: {zone.factors.accessibility?.description || 'Scenario assessment'}</li>
              <li>• Population: {zone.factors.populationExposure?.description || 'Scenario estimate'}</li>
            </>
          )}
        </ul>
      </div>

      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-command-border/40 flex items-center justify-between">
        <span>Synthetic scenario input</span>
        <span className="text-blue-600 font-semibold">{isSelected ? '✓ Selected' : 'View details →'}</span>
      </div>
    </div>
  );
};
