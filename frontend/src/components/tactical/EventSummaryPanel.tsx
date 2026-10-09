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
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 font-sans shadow-xs relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold">
              Disaster Scenario Study
            </span>
            <span className="text-xs text-slate-500 dark:text-command-dim">
              Ref: {caseStudy.code}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-command-text">
            {caseStudy.name}
          </h3>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>{caseStudy.mechanismStatus}</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-1.5 pt-3 pb-2 border-b border-slate-200/60 dark:border-command-border/40 text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-command-surface dark:text-command-accent-glow'
              : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
          }`}
        >
          Event Overview
        </button>
        <button
          onClick={() => setActiveTab('WAYPOINTS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'WAYPOINTS'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-command-surface dark:text-command-accent-glow'
              : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
          }`}
        >
          Key Locations ({caseStudy.verifiedWaypoints.length})
        </button>
        <button
          onClick={() => setActiveTab('SOURCES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'SOURCES'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-command-surface dark:text-command-accent-glow'
              : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
          }`}
        >
          Official Sources ({caseStudy.authoritativeSources.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-3">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-3 text-xs">
            {/* Context Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
                <span className="text-[11px] text-slate-500 block">River Basin:</span>
                <span className="font-semibold text-slate-900 dark:text-command-text">{caseStudy.basin}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
                <span className="text-[11px] text-slate-500 block">Region:</span>
                <span className="font-semibold text-slate-900 dark:text-command-text">{caseStudy.region}</span>
              </div>
            </div>

            {/* Scientific Mechanism */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 leading-relaxed text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Hazard Mechanism: {caseStudy.mechanismStatus}</span>
              </div>
              <p className="text-amber-950 dark:text-amber-100/90 text-xs">
                {caseStudy.mechanismNotes}
              </p>
            </div>

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-command-dim uppercase tracking-wider block">
                Safety Guidance & Preparedness Priorities:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-command-muted">
                {caseStudy.decisionSupportRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'WAYPOINTS' && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {caseStudy.verifiedWaypoints.map((wp: VerifiedGeographicWaypoint) => (
              <div
                key={wp.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border hover:border-blue-300 transition-colors flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-command-text text-xs">{wp.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {wp.coordinates[1].toFixed(4)}° N, {wp.coordinates[0].toFixed(4)}° E {wp.elevationMeters ? `• Elev: ${wp.elevationMeters}m` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    Source: {wp.authoritySource}
                  </p>
                </div>

                {onFocusWaypoint && (
                  <button
                    onClick={() => onFocusWaypoint(wp.coordinates)}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-command-surface hover:bg-blue-50 border border-slate-200 dark:border-command-border text-xs font-semibold text-blue-700 dark:text-command-accent-glow flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    title="Center map on this location"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SOURCES' && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {caseStudy.authoritativeSources.map((source) => (
              <div
                key={source.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 dark:text-command-text">{source.name}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Visit source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-slate-600 dark:text-command-muted text-[11px]">
                  {source.authority} • {source.evidenceScope}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
