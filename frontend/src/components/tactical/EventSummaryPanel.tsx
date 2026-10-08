import React, { useState } from 'react';
import { 
  NEPAL_CHINA_BORDER_DISASTER_2026, 
  type RealWorldDisasterCaseStudy,
  type VerifiedGeographicWaypoint 
} from '../../data/events';
import { 
  MapPin, 
  ExternalLink, 
  AlertCircle, 
  Compass, 
  Clock 
} from 'lucide-react';

interface EventSummaryPanelProps {
  caseStudy?: RealWorldDisasterCaseStudy;
  onFocusWaypoint?: (coordinates: [number, number]) => void;
}

export const EventSummaryPanel: React.FC<EventSummaryPanelProps> = ({
  caseStudy = NEPAL_CHINA_BORDER_DISASTER_2026,
  onFocusWaypoint,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SOURCES' | 'WAYPOINTS'>('OVERVIEW');

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-command-accent/5 filter blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold">
              REAL-WORLD CASE STUDY
            </span>
            <span className="text-[10px] text-command-dim">
              CODE: {caseStudy.code}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-command-text">
            {caseStudy.name}
          </h3>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/70 border border-amber-800 text-amber-300 text-[10px] font-bold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          <span>{caseStudy.mechanismStatus}</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 pt-3 pb-2 border-b border-command-border/40 text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
            activeTab === 'OVERVIEW'
              ? 'bg-command-surface text-command-accent-glow border border-command-border'
              : 'text-command-muted hover:text-command-text'
          }`}
        >
          EVENT OVERVIEW
        </button>
        <button
          onClick={() => setActiveTab('WAYPOINTS')}
          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
            activeTab === 'WAYPOINTS'
              ? 'bg-command-surface text-command-accent-glow border border-command-border'
              : 'text-command-muted hover:text-command-text'
          }`}
        >
          VERIFIED WAYPOINTS ({caseStudy.verifiedWaypoints.length})
        </button>
        <button
          onClick={() => setActiveTab('SOURCES')}
          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
            activeTab === 'SOURCES'
              ? 'bg-command-surface text-command-accent-glow border border-command-border'
              : 'text-command-muted hover:text-command-text'
          }`}
        >
          AUTHORITATIVE SOURCES ({caseStudy.authoritativeSources.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-3">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-3 text-xs">
            {/* Context Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-command-panel border border-command-border">
                <span className="text-[10px] text-command-dim block">TRANSBOUNDARY BASIN:</span>
                <span className="font-bold text-command-text">{caseStudy.basin}</span>
              </div>
              <div className="p-2 rounded bg-command-panel border border-command-border">
                <span className="text-[10px] text-command-dim block">GEOGRAPHIC REGION:</span>
                <span className="font-bold text-command-text">{caseStudy.region}</span>
              </div>
            </div>

            {/* Scientific Investigation Callout */}
            <div className="p-3 rounded bg-amber-950/20 border border-amber-800/50 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>SCIENTIFIC MECHANISM: {caseStudy.mechanismStatus.toUpperCase()}</span>
              </div>
              <p className="text-amber-100/90 text-[10px]">
                {caseStudy.mechanismNotes}
              </p>
            </div>

            {/* Decision-Support Recommendations */}
            <div className="p-2.5 rounded bg-command-panel border border-command-border space-y-1.5">
              <span className="text-[10px] font-bold text-command-dim uppercase tracking-wider block">
                Decision-Support Recommendations (Human Verification Required):
              </span>
              <ul className="space-y-1 text-[10px] text-command-muted">
                {caseStudy.decisionSupportRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-command-accent-glow font-bold">›</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'WAYPOINTS' && (
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {caseStudy.verifiedWaypoints.map((wp: VerifiedGeographicWaypoint) => (
              <div
                key={wp.id}
                className="p-2.5 rounded bg-command-panel border border-command-border hover:border-command-accent/50 transition-colors flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-bold text-command-text text-[11px]">{wp.name}</span>
                  </div>
                  <p className="text-[10px] text-command-dim">
                    {wp.coordinates[1].toFixed(4)}° N, {wp.coordinates[0].toFixed(4)}° E {wp.elevationMeters ? `| Elev: ${wp.elevationMeters}m` : ''}
                  </p>
                  <p className="text-[10px] text-command-muted italic">
                    Source: {wp.authoritySource}
                  </p>
                </div>

                {onFocusWaypoint && (
                  <button
                    onClick={() => onFocusWaypoint(wp.coordinates)}
                    className="px-2 py-1 rounded bg-command-surface hover:bg-command-border border border-command-border text-[10px] font-bold text-command-accent-glow flex items-center gap-1 flex-shrink-0"
                    title="Center map on this verified waypoint"
                  >
                    <Compass className="w-3 h-3" />
                    <span>FOCUS</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SOURCES' && (
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {caseStudy.authoritativeSources.map((source) => (
              <div
                key={source.id}
                className="p-2.5 rounded bg-command-panel border border-command-border text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-command-text">{source.name}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-command-accent-glow hover:underline inline-flex items-center gap-1 text-[10px]"
                  >
                    <span>{source.id}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-[10px] text-command-dim">
                  Authority: <span className="text-command-text">{source.authority}</span>
                </div>
                <div className="text-[10px] text-command-muted">
                  Evidence Scope: {source.evidenceScope}
                </div>
                <div className="pt-1 flex items-center justify-between text-[9px] text-command-dim">
                  <span>Accessed: {source.accessDate}</span>
                  <span className="text-emerald-400 font-semibold">{source.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
