import React from 'react';
import type { RouteStatus } from '../../types/response';
import { Route, AlertTriangle, CheckCircle2, Navigation, Truck, Plane } from 'lucide-react';

interface RouteAnalysisViewerProps {
  routeStatus: RouteStatus;
  zoneName?: string;
}

export const RouteAnalysisViewer: React.FC<RouteAnalysisViewerProps> = ({
  routeStatus,
}) => {
  const getPassabilityBadge = (passability: string) => {
    switch (passability) {
      case 'OPEN_ALL_VEHICLES':
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
          label: 'OPEN TO ALL VEHICLES',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'RESTRICTED_SINGLE_LANE':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-700',
          label: 'RESTRICTED SINGLE-LANE (4x4 ONLY)',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'IMPASSABLE_DEBRIS':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-700',
          label: 'IMPASSABLE DEBRIS BLOCKAGE',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'SEVERED':
      case 'UNAVAILABLE':
      default:
        return {
          bg: 'bg-purple-950/80 text-purple-300 border-purple-700',
          label: 'ROUTE ANALYSIS UNAVAILABLE / SEVERED',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />,
        };
    }
  };

  const badge = getPassabilityBadge(routeStatus.roadPassability);

  return (
    <div className="p-3.5 rounded-lg bg-command-panel/90 border border-command-border font-mono text-xs space-y-2.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-command-border/60">
        <div className="flex items-center gap-1.5 font-bold text-command-text">
          <Route className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="uppercase">ROUTE & ACCESSIBILITY TELEMETRY:</span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${badge.bg}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </span>
      </div>

      {/* Main Status Description */}
      <div>
        <p className={`text-[11px] font-semibold leading-relaxed ${
          routeStatus.isAvailable ? 'text-command-text' : 'text-rose-300'
        }`}>
          {routeStatus.routeDescription}
        </p>
      </div>

      {/* Telemetry Metrics when Route is Available */}
      {routeStatus.isAvailable && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {routeStatus.corridorDistanceKm && (
            <div className="p-2 rounded bg-command-surface/70 border border-command-border flex items-center justify-between">
              <span className="text-[10px] text-command-dim flex items-center gap-1">
                <Navigation className="w-3 h-3 text-command-accent-glow" />
                <span>Corridor Distance:</span>
              </span>
              <span className="font-bold text-command-text text-[11px]">
                {routeStatus.corridorDistanceKm} km
              </span>
            </div>
          )}

          {routeStatus.estimatedTransitTime && (
            <div className="p-2 rounded bg-command-surface/70 border border-command-border flex items-center justify-between">
              <span className="text-[10px] text-command-dim flex items-center gap-1">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span>Est. Convoy Time:</span>
              </span>
              <span className="font-bold text-command-text text-[11px]">
                {routeStatus.estimatedTransitTime}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Alternative Aerial / High-Line Option */}
      <div className="p-2 rounded bg-command-surface/50 border border-command-border/40 text-[10px] text-command-muted flex items-start gap-2">
        <Plane className="w-3.5 h-3.5 text-command-accent-glow shrink-0 mt-0.5" />
        <div>
          <strong className="text-command-text">Tactical Alternative: </strong>
          <span>{routeStatus.alternativeAccessMethod}</span>
        </div>
      </div>
    </div>
  );
};
