import React from 'react';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Building2, 
  Car, 
  Activity, 
  GitCommit, 
  AlertTriangle 
} from 'lucide-react';

export const DamageView: React.FC = () => {
  const damageCategories = [
    {
      id: 'ROADS',
      title: 'Araniko Highway & Feeder Roads',
      icon: Car,
      baselineTotal: '48.2 km surveyed',
      impactedEstimated: '—',
      severedSections: 'Awaiting spatial join',
      status: 'AWAITING_PASS' as const,
      source: 'OpenStreetMap Highway Vector (Nepal Central)',
    },
    {
      id: 'BRIDGES',
      title: 'Transboundary Bridges & Culverts',
      icon: GitCommit,
      baselineTotal: '14 structures recorded',
      impactedEstimated: '—',
      severedSections: 'Awaiting flood polygon overlay',
      status: 'AWAITING_PASS' as const,
      source: 'OSM Bridge Tags / Dept of Roads Nepal',
    },
    {
      id: 'BUILDINGS',
      title: 'Residential & Commercial Footprints',
      icon: Building2,
      baselineTotal: '1,420 mapped buildings',
      impactedEstimated: '—',
      severedSections: 'Spatial intersection pending',
      status: 'AWAITING_PASS' as const,
      source: 'OSM Building Footprints / HDX',
    },
    {
      id: 'HEALTHCARE',
      title: 'Health Posts & Emergency Clinics',
      icon: Activity,
      baselineTotal: '6 facilities in AOI',
      impactedEstimated: '—',
      severedSections: 'Buffer distance calculation pending',
      status: 'AWAITING_PASS' as const,
      source: 'Nepal Ministry of Health / HDX Health',
    },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-command-accent-glow" />
            <h2 className="text-sm font-bold text-command-text uppercase tracking-wider">
              CRITICAL INFRASTRUCTURE DAMAGE & EXPOSURE ASSESSMENT
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Cross-referencing flood and landslide change polygons with baseline OpenStreetMap & HDX infrastructure vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge
            provenance={{
              tier: 'VERIFIED',
              source: 'OpenStreetMap Contributors / HDX Nepal Baseline 2026',
              timestamp: '2026-08-27T00:00:00Z',
            }}
            showDetails
          />
        </div>
      </div>

      {/* Exposure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {damageCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-command-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-command-surface border border-command-border flex items-center justify-center text-command-accent-glow">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-command-text">{cat.title}</span>
                  </div>
                  <span className="text-[10px] text-command-dim uppercase">
                    ID: {cat.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="bg-command-panel p-2.5 rounded border border-command-border">
                    <span className="text-[10px] text-command-dim block mb-0.5">BASELINE SURVEY</span>
                    <span className="font-bold text-command-text">{cat.baselineTotal}</span>
                  </div>
                  <div className="bg-command-panel p-2.5 rounded border border-command-border">
                    <span className="text-[10px] text-command-dim block mb-0.5">ESTIMATED IMPACT</span>
                    <span className="font-bold text-command-dim italic">{cat.impactedEstimated}</span>
                  </div>
                </div>

                <div className="text-[11px] text-command-muted bg-command-panel/60 p-2 rounded border border-command-border/40 mb-3">
                  Analysis Status: <span className="text-amber-400 font-semibold">{cat.severedSections}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-command-border/60 flex items-center justify-between text-xs">
                <DataSourceBadge
                  provenance={{
                    tier: cat.status,
                    source: cat.source,
                    timestamp: '2026-08-27T00:00:00Z',
                  }}
                />
                <span className="text-[10px] text-command-dim">EPSG:32645</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Integrity Callout */}
      <div className="bg-sky-950/40 border border-sky-800/60 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-command-accent-glow flex-shrink-0 mt-0.5" />
        <div className="text-xs text-sky-200">
          <strong className="block font-bold mb-0.5 text-command-accent-glow">FACTUAL INTEGRITY & PROVENANCE PROTOCOL</strong>
          Spatial damage calculations are computed via direct geometric intersection (`Shapely` / `GeoPandas`) between verified OSM infrastructure lines and satellite-derived flood masks. Figures are not synthesized or estimated without an active satellite inference run.
        </div>
      </div>
    </div>
  );
};
