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
      title: 'Araniko Highway Corridor (DEMO)',
      icon: Car,
      baselineTotal: 'Awaiting Step 4 data',
      impactedEstimated: '—',
      severedSections: 'Awaiting Step 4 spatial join',
      status: 'DEMO_VALUE' as const,
      source: 'Prototype Road Layer (DEMO / ILLUSTRATIVE)',
    },
    {
      id: 'BRIDGES',
      title: 'Transboundary Bridges (DEMO)',
      icon: GitCommit,
      baselineTotal: 'Awaiting Step 4 data',
      impactedEstimated: '—',
      severedSections: 'Awaiting Step 4 flood overlay',
      status: 'DEMO_VALUE' as const,
      source: 'Prototype Bridge Layer (DEMO / ILLUSTRATIVE)',
    },
    {
      id: 'BUILDINGS',
      title: 'Settlement Footprints (DEMO)',
      icon: Building2,
      baselineTotal: 'Awaiting Step 4 data',
      impactedEstimated: '—',
      severedSections: 'Spatial intersection pending',
      status: 'DEMO_VALUE' as const,
      source: 'Prototype Settlement Layer (DEMO / ILLUSTRATIVE)',
    },
    {
      id: 'HEALTHCARE',
      title: 'Health Outposts (DEMO)',
      icon: Activity,
      baselineTotal: 'Awaiting Step 4 data',
      impactedEstimated: '—',
      severedSections: 'Buffer distance calculation pending',
      status: 'DEMO_VALUE' as const,
      source: 'Prototype Health Post Layer (DEMO / ILLUSTRATIVE)',
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
              INFRASTRUCTURE DAMAGE ASSESSMENT INTERFACE (STEP 3 PROTOTYPE)
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Interactive map viewport and exposure matrix layout. Real baseline datasets connect in Step 4.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge
            provenance={{
              tier: 'DEMO_VALUE',
              source: 'Prototype Baseline Layout (Awaiting Step 4 Real Data)',
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

          <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-200">
              <strong className="block font-bold mb-0.5 text-amber-300">DATA INTEGRITY NOTE</strong>
              Values will be derived via geometric intersection (`Shapely` / `GeoPandas`) on genuine baseline data in Step 4.
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 h-[620px]">
          <InteractiveMap
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Map initial viewport — DEMO / navigation reference"
            heightClass="h-[620px]"
          />
        </div>
      </div>
    </div>
  );
};
