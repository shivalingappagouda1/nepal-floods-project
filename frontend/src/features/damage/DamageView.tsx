import React from 'react';
import type { MapLayerConfig } from '../../types';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { 
  Building2, 
  Car, 
  Activity, 
  GitCommit, 
  AlertTriangle 
} from 'lucide-react';

interface DamageViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const DamageView: React.FC<DamageViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
}) => {
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

      {/* Main Grid: Damage Summary Cards + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Exposure Matrix Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {damageCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="bg-command-card border border-command-border rounded-lg p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-command-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-command-surface border border-command-border flex items-center justify-center text-command-accent-glow">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-command-text">{cat.title}</span>
                    </div>
                    <span className="text-[9px] text-command-dim uppercase">
                      {cat.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="bg-command-panel p-2 rounded border border-command-border">
                      <span className="text-[9px] text-command-dim block">BASELINE</span>
                      <span className="font-bold text-command-text text-[11px]">{cat.baselineTotal}</span>
                    </div>
                    <div className="bg-command-panel p-2 rounded border border-command-border">
                      <span className="text-[9px] text-command-dim block">IMPACT</span>
                      <span className="font-bold text-command-dim italic text-[11px]">{cat.impactedEstimated}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-command-muted bg-command-panel/60 px-2 py-1 rounded border border-command-border/40 flex items-center justify-between">
                    <span>Status: <strong className="text-amber-400">{cat.severedSections}</strong></span>
                    <DataSourceBadge
                      provenance={{
                        tier: cat.status,
                        source: cat.source,
                        timestamp: '2026-08-27T00:00:00Z',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-sky-950/40 border border-sky-800/60 rounded-lg p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-command-accent-glow flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-sky-200">
              <strong className="block font-bold mb-0.5 text-command-accent-glow">PROVENANCE PROTOCOL</strong>
              Calculations are computed via vector polygon intersection (`Shapely` / `GeoPandas`) on genuine baseline data.
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 h-[620px]">
          <InteractiveMap
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Infrastructure Exposure Deck"
            heightClass="h-[620px]"
          />
        </div>
      </div>
    </div>
  );
};
