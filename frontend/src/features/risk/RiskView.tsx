import React from 'react';
import type { MapLayerConfig } from '../../types';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { 
  Flame, 
  Info 
} from 'lucide-react';

interface RiskViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const RiskView: React.FC<RiskViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
}) => {
  const riskZones = [
    {
      id: 'ZONE-A',
      name: 'Tatopani Sector (DEMO)',
      score: 92,
      debrisRisk: 'HIGH (DEMO Slope Index)',
      floodRisk: 'CRITICAL (DEMO Inundation)',
      isolationRisk: 'EXTREME (DEMO Severance)',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'ZONE-B',
      name: 'Larcha Sector (DEMO)',
      score: 84,
      debrisRisk: 'HIGH (DEMO Tributary Index)',
      floodRisk: 'HIGH (DEMO Surge)',
      isolationRisk: 'HIGH (DEMO Bridge Impact)',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'ZONE-C',
      name: 'Barhabise Sector (DEMO)',
      score: 68,
      debrisRisk: 'MODERATE (DEMO Scour Index)',
      floodRisk: 'HIGH (DEMO Floodplain)',
      isolationRisk: 'MODERATE (DEMO Bypass)',
      status: 'DEMO_VALUE' as const,
    },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-tactical-amber" />
            <h2 className="text-sm font-bold text-command-text uppercase tracking-wider">
              MULTI-CRITERIA RISK ENGINE (STEP 3 PROTOTYPE VIEW)
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Mathematical model framework. Genuine risk scoring will be calculated in Step 6.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge
            provenance={{
              tier: 'DEMO_VALUE',
              source: 'MCDA Prototype Framework (DEMO / ILLUSTRATIVE)',
              timestamp: '2026-08-27T00:00:00Z',
              algorithm: 'Multi-Criteria Decision Analysis (AHP Weighted)',
              confidence: 0.80,
            }}
            showDetails
          />
        </div>
      </div>

      {/* Main Grid: Risk Formulations + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Formula & Zone Breakdown */}
        <div className="lg:col-span-5 space-y-3">
          {/* Mathematical Model Formula Card */}
          <div className="bg-command-panel border border-command-border rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/60">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-command-accent-glow" />
                <span className="text-xs font-bold text-command-text">RISK FORMULATION METHODOLOGY</span>
              </div>
              <span className="text-[10px] text-command-dim">DECISION SUPPORT</span>
            </div>
            <div className="text-[11px] text-command-muted space-y-1">
              <div className="p-2 bg-command-card rounded border border-command-border text-command-accent-glow font-bold text-xs">
                Risk Index = 0.35 × (Inundation Hazard) + 0.30 × (Debris Velocity) + 0.20 × (Lifeline Cutoff) + 0.15 × (Population Density)
              </div>
              <p className="text-[10px] text-command-dim pt-1">
                * Note: System produces vulnerability rankings. It does not claim exact prediction of future glacier collapse timings.
              </p>
            </div>
          </div>

          {/* Priority Risk Zones Table */}
          <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2">
            <h3 className="text-xs font-bold text-command-text uppercase tracking-wider mb-2">
              Sector Rankings (DEMO Data)
            </h3>

            <div className="space-y-2">
              {riskZones.map((zone) => (
                <div key={zone.id} className="p-2.5 rounded bg-command-panel border border-command-border text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-command-text">{zone.name}</span>
                    <span className={`font-mono font-bold text-xs ${zone.score >= 90 ? 'text-tactical-critical' : 'text-tactical-high'}`}>
                      {zone.score}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-command-muted mb-1.5">
                    <div>Debris: <span className="text-command-text">{zone.debrisRisk}</span></div>
                    <div>Flood: <span className="text-command-text">{zone.floodRisk}</span></div>
                  </div>
                  <div className="pt-1.5 border-t border-command-border/40 flex items-center justify-between text-[9px]">
                    <span className="text-rose-300">{zone.isolationRisk}</span>
                    <DataSourceBadge
                      provenance={{
                        tier: zone.status,
                        source: 'MCDA Prototype Grid (DEMO / ILLUSTRATIVE)',
                        timestamp: '2026-08-27T00:00:00Z',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Map */}
        <div className="lg:col-span-7 h-[600px]">
          <InteractiveMap
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Map initial viewport — DEMO / navigation reference"
            heightClass="h-[600px]"
          />
        </div>
      </div>
    </div>
  );
};
