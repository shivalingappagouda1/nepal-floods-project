import React from 'react';
import type { PriorityZone } from '../../types/response';
import { RouteAnalysisViewer } from './RouteAnalysisViewer';
import { 
  MapPin, 
  Users, 
  Building2, 
  Send, 
  Compass, 
  HeartPulse, 
  AlertTriangle,
  Radio,
  FileCheck,
  HelpCircle,
  Layers
} from 'lucide-react';

interface ResponseDetailsPanelProps {
  zone: PriorityZone;
  onFocusZone: (coords: [number, number]) => void;
  onApproveActionDirective?: (zoneId: string, actionText: string) => void;
}

export const ResponseDetailsPanel: React.FC<ResponseDetailsPanelProps> = ({
  zone,
  onFocusZone,
  onApproveActionDirective,
}) => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PRIORITY_1':
        return 'bg-rose-950/90 text-rose-300 border-rose-600';
      case 'PRIORITY_2':
        return 'bg-orange-950/90 text-orange-300 border-orange-600';
      case 'PRIORITY_3':
      default:
        return 'bg-amber-950/90 text-amber-300 border-amber-600';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-purple-950/80 text-purple-300 border-purple-700';
      case 'SEVERE':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-2xl space-y-4">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded border uppercase ${getTierBadge(zone.priorityTier)}`}>
              {zone.priorityTier.replace('_', ' ')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-accent-glow">
              {zone.id}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border uppercase ${getSeverityBadge(zone.severity)}`}>
              {zone.severity} SEVERITY
            </span>
          </div>

          <h3 className="text-sm font-bold text-command-text leading-snug">
            {zone.name}
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-command-dim mt-1">
            <MapPin className="w-3 h-3 text-command-accent-glow" />
            <span>{zone.coordinates[1].toFixed(4)}°N, {zone.coordinates[0].toFixed(4)}°E</span>
            <span>•</span>
            <span className="truncate max-w-xs" title={zone.coordinateProvenance}>
              Source: {zone.coordinateProvenance}
            </span>
          </div>
        </div>

        {/* Priority Score & Confidence */}
        <div className="flex flex-col sm:items-end gap-1 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded bg-command-panel border border-command-border text-right">
              <div className="text-xs font-bold text-command-text">
                {zone.score}/100
              </div>
              <div className="text-[9px] text-command-dim font-bold">
                {zone.prototypeScoreLabel}
              </div>
            </div>

            <span
              className="inline-flex items-center text-[10px] font-mono text-command-dim border border-command-border px-2 py-1.5 rounded bg-command-panel/80"
              title="Numerical confidence omitted until empirical ground-truth validation is connected"
            >
              CONFIDENCE: Not available
            </span>
          </div>
        </div>
      </div>

      {/* Unified 6-Factor Telemetry & Explainability Matrix */}
      <div className="p-3 rounded-lg bg-command-panel/90 border border-command-border space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-command-border/50 text-xs font-bold text-command-text">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
            <span className="uppercase">FACTOR PROVENANCE & SCORING EXPLAINABILITY:</span>
          </div>
          <span className="text-[10px] text-command-dim">6 INPUT FACTORS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Object.values(zone.factors).map((factor) => {
            const getFactorIcon = (key: string) => {
              switch (key) {
                case 'populationExposure':
                  return <Users className="w-3.5 h-3.5 text-command-accent-glow" />;
                case 'damageSeverity':
                  return <Layers className="w-3.5 h-3.5 text-rose-400" />;
                case 'criticalInfrastructure':
                  return <Building2 className="w-3.5 h-3.5 text-sky-400" />;
                case 'accessibility':
                  return <Radio className="w-3.5 h-3.5 text-amber-400" />;
                case 'secondaryHazard':
                  return <AlertTriangle className="w-3.5 h-3.5 text-tactical-amber" />;
                case 'medicalUrgency':
                default:
                  return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
              }
            };

            const getStatusBadge = (status: string) => {
              if (status.includes('PRECOMPUTED')) {
                return (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-sky-950/60 text-sky-300 border-sky-800">
                    PRECOMPUTED
                  </span>
                );
              }
              if (status.includes('DEMO')) {
                return (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-amber-950/60 text-amber-300 border-amber-800">
                    DEMO
                  </span>
                );
              }
              return (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-slate-900 text-slate-400 border-slate-700">
                  OFFLINE
                </span>
              );
            };

            return (
              <div key={factor.key} className="p-2.5 rounded bg-command-surface/80 border border-command-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] gap-1">
                  <span className="font-bold text-command-text flex items-center gap-1.5 truncate">
                    {getFactorIcon(factor.key)}
                    <span className="truncate">{factor.label}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {getStatusBadge(factor.statusDisplay)}
                    <span className={`px-1 py-0.2 rounded border font-bold uppercase text-[9px] ${
                      factor.level === 'CRITICAL' || factor.level === 'HIGH'
                        ? 'text-rose-400 bg-rose-950/60 border-rose-800'
                        : factor.level === 'MEDIUM'
                        ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                        : factor.level === 'DATA_UNAVAILABLE'
                        ? 'text-slate-400 bg-slate-900 border-slate-700'
                        : 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                    }`}>
                      {factor.level.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-amber-300/90 font-mono">
                  Status: {factor.statusDisplay}
                </div>

                <p className="text-[10px] text-command-dim leading-snug line-clamp-2">
                  {factor.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Analysis Telemetry Component */}
      <RouteAnalysisViewer
        routeStatus={zone.routeStatus}
        zoneName={zone.name}
      />

      {/* Decision-Support Recommendation Action Box */}
      <div className="p-3.5 rounded-lg bg-command-panel border border-command-border space-y-2 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-command-border/50">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase">
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Decision-Support Operational Recommendation:</span>
          </div>
          <span className="text-[9px] text-sky-300 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700">
            {zone.verificationStatus}
          </span>
        </div>

        <p className="text-sm font-semibold text-command-text leading-relaxed bg-command-surface/60 p-2.5 rounded border border-command-border">
          "{zone.recommendedAction}"
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[10px] text-command-dim">
          <span className="flex items-center gap-1 text-amber-300/90">
            <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Human-in-the-loop requirement: System presents recommendations only and does not issue autonomous emergency dispatch orders.</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => onFocusZone(zone.coordinates)}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>CENTER MAP ON {zone.id}</span>
        </button>

        {onApproveActionDirective && (
          <button
            onClick={() => onApproveActionDirective(zone.id, zone.recommendedAction)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-command-accent hover:bg-sky-500 text-white text-xs font-bold shadow-tactical-glow flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>RECOMMEND DIRECTIVE FOR COMMAND SIGN-OFF</span>
          </button>
        )}
      </div>
    </div>
  );
};
