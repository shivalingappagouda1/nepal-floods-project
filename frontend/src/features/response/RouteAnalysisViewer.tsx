import React from 'react';
import type { RouteStatus } from '../../types/response';
import { Route, AlertTriangle, HelpCircle } from 'lucide-react';

interface RouteAnalysisViewerProps {
  routeStatus: RouteStatus;
  zoneName?: string;
}

export const RouteAnalysisViewer: React.FC<RouteAnalysisViewerProps> = ({
  routeStatus,
}) => {
  return (
    <div className="p-3.5 rounded-lg bg-command-panel/90 border border-command-border font-mono text-xs space-y-2.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-command-border/60">
        <div className="flex items-center gap-1.5 font-bold text-command-text">
          <Route className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="uppercase">ROUTE & ACCESSIBILITY STATUS:</span>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 bg-purple-950/80 text-purple-300 border-purple-700">
          <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
          <span>ROUTE ANALYSIS UNAVAILABLE</span>
        </span>
      </div>

      {/* Main Status Description */}
      <div>
        <p className="text-[11px] font-semibold leading-relaxed text-rose-300">
          {routeStatus.routeDescription}
        </p>
      </div>

      {/* Disclaimers & Recon Recommendation */}
      <div className="p-2.5 rounded bg-command-surface/60 border border-command-border/40 text-[10px] text-command-muted space-y-1">
        <div className="flex items-center gap-1.5 text-command-text font-bold">
          <HelpCircle className="w-3 h-3 text-command-accent-glow" />
          <span>ROUTING DATA PROVENANCE:</span>
        </div>
        <p className="text-[9.5px] leading-relaxed">
          Ground transport routing requires live road-condition feeds. In the prototype environment without connected road-network telemetry, routes are explicitly marked <strong>"Route analysis unavailable"</strong> to prevent misleading navigation.
        </p>
      </div>
    </div>
  );
};
