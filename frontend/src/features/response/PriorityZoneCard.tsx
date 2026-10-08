import React from 'react';
import type { PriorityZone } from '../../types/response';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  UserCheck, 
  AlertOctagon,
  ChevronRight,
  Route
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
          border: 'border-rose-600',
          badge: 'bg-rose-950/90 text-rose-300 border-rose-600',
          glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]',
          label: 'PRIORITY 1 — CRITICAL',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'PRIORITY_2':
        return {
          border: 'border-orange-600',
          badge: 'bg-orange-950/90 text-orange-300 border-orange-600',
          glow: 'shadow-[0_0_10px_rgba(249,115,22,0.2)]',
          label: 'PRIORITY 2 — HIGH',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 'PRIORITY_3':
      default:
        return {
          border: 'border-amber-600',
          badge: 'bg-amber-950/90 text-amber-300 border-amber-600',
          glow: '',
          label: 'PRIORITY 3 — MODERATE',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
        };
    }
  };

  const theme = getTierTheme(zone.priorityTier);

  return (
    <div
      onClick={() => onSelectZone(zone)}
      className={`p-3.5 rounded-lg border font-mono cursor-pointer transition-all space-y-2.5 ${
        isSelected
          ? `bg-command-surface border-command-accent ${theme.glow}`
          : 'bg-command-panel/80 border-command-border hover:border-command-border-light'
      }`}
    >
      {/* Top Priority Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-command-border/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${theme.badge}`}>
            {theme.icon}
            <span>{theme.label}</span>
          </span>
          <span className="text-xs font-bold text-command-accent-glow">
            {zone.id}
          </span>
        </div>

        <div className="flex items-center gap-1 text-right">
          <span className="text-xs font-bold text-command-text font-mono">
            {zone.score}/100
          </span>
          <span className="text-[9px] text-command-dim" title="Prototype response priority score">
            SCORE
          </span>
        </div>
      </div>

      {/* Zone Title & Sector */}
      <div>
        <h4 className="text-xs font-bold text-command-text leading-tight">
          {zone.name}
        </h4>
        <div className="text-[10px] text-command-dim flex items-center gap-1 mt-0.5 truncate">
          <MapPin className="w-3 h-3 text-command-dim shrink-0" />
          <span className="truncate">{zone.sector}</span>
        </div>
      </div>

      {/* Why? Bullet List (Prompt Example) */}
      <div className="p-2.5 rounded bg-command-surface/80 border border-command-border/50 text-[10px] space-y-1">
        <span className="font-bold text-command-text block uppercase">
          Why this zone is prioritized:
        </span>
        <ul className="space-y-0.5 text-command-muted">
          {zone.whyFactors.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-command-accent-glow font-bold">•</span>
              <span className="capitalize">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Action Box */}
      <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/60 text-[10px] space-y-0.5">
        <span className="font-bold text-amber-400 uppercase block">
          Recommendation:
        </span>
        <p className="text-amber-100/90 leading-snug">
          "{zone.recommendedAction.replace('Recommended: ', '')}"
        </p>
      </div>

      {/* Route & Verification Status Footer */}
      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-command-border/40 text-[9px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sky-300 font-bold flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            <span>Human verification required</span>
          </span>

          {!zone.routeStatus.isAvailable && (
            <span className="text-rose-300 bg-rose-950/60 border border-rose-800 px-1.5 py-0.2 rounded flex items-center gap-1" title="Road severed">
              <Route className="w-2.5 h-2.5" />
              <span>Route unavailable</span>
            </span>
          )}
        </div>

        <span className="text-command-accent-glow font-bold flex items-center gap-0.5">
          <span>INSPECT</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
