import React from 'react';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Flame, 
  Info
} from 'lucide-react';

export const RiskView: React.FC = () => {
  const riskZones = [
    {
      id: 'ZONE-A',
      name: 'Tatopani Border Crossing & Dry Port',
      score: 92,
      debrisRisk: 'HIGH (Steep canyon slope > 42°)',
      floodRisk: 'CRITICAL (Riverbank overflow)',
      isolationRisk: 'EXTREME (Araniko Hwy severed)',
      populationExp: 'Demo estimate pending pass',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'ZONE-B',
      name: 'Larcha / Bhairabkunda Confluence',
      score: 84,
      debrisRisk: 'HIGH (Tributary debris fan)',
      floodRisk: 'HIGH (Backwater surge)',
      isolationRisk: 'HIGH (Bhairabkunda Bridge severed)',
      populationExp: 'Demo estimate pending pass',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'ZONE-C',
      name: 'Barhabise Municipality Lower Reach',
      score: 68,
      debrisRisk: 'MODERATE (Bank scouring)',
      floodRisk: 'HIGH (Floodplain inundation)',
      isolationRisk: 'MODERATE (Secondary bypass open)',
      populationExp: 'Demo estimate pending pass',
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
              MULTI-CRITERIA DISASTER RISK SCORING ENGINE
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Composite vulnerability indices combining terrain slope, hydrological velocity, and lifeline severance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge
            provenance={{
              tier: 'AI_COMPUTED',
              source: 'HIMALAYA-SHIELD MCDA Engine (v1.0)',
              timestamp: '2026-08-27T06:00:00Z',
              algorithm: 'Multi-Criteria Decision Analysis (AHP Weighted)',
              confidence: 0.86,
            }}
            showDetails
          />
        </div>
      </div>

      {/* Mathematical Model Formula Card */}
      <div className="bg-command-panel border border-command-border rounded-lg p-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/60">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-command-accent-glow" />
            <span className="text-xs font-bold text-command-text">RISK FORMULATION METHODOLOGY</span>
          </div>
          <span className="text-[10px] text-command-dim">SCIENTIFIC DECISION SUPPORT</span>
        </div>
        <div className="text-xs text-command-muted space-y-1">
          <div className="p-2.5 bg-command-card rounded border border-command-border text-command-accent-glow font-bold">
            Risk Index = 0.35 × (Inundation Hazard) + 0.30 × (Debris Velocity) + 0.20 × (Lifeline Cutoff) + 0.15 × (Population Density)
          </div>
          <p className="text-[11px] text-command-dim pt-1">
            * Note: System produces decision-support vulnerability rankings. It does not predict future unpredictable glacier collapse timings.
          </p>
        </div>
      </div>

      {/* Priority Risk Zones Table */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 overflow-x-auto">
        <h3 className="text-xs font-bold text-command-text uppercase tracking-wider mb-3">
          Transboundary Corridor High-Risk Priority Sectors
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-command-border text-command-dim text-[10px]">
              <th className="pb-2">SECTOR / ZONE</th>
              <th className="pb-2">RISK SCORE</th>
              <th className="pb-2">DEBRIS FLOW</th>
              <th className="pb-2">INUNDATION</th>
              <th className="pb-2">ISOLATION</th>
              <th className="pb-2">DATA PROVENANCE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-command-border/60">
            {riskZones.map((zone) => (
              <tr key={zone.id} className="hover:bg-command-surface/30 transition-colors">
                <td className="py-3 font-semibold text-command-text">
                  <div>{zone.name}</div>
                  <span className="text-[10px] text-command-dim">{zone.id}</span>
                </td>
                <td className="py-3 font-bold text-sm">
                  <span className={zone.score >= 90 ? 'text-tactical-critical' : 'text-tactical-high'}>
                    {zone.score}/100
                  </span>
                </td>
                <td className="py-3 text-command-muted">{zone.debrisRisk}</td>
                <td className="py-3 text-command-muted">{zone.floodRisk}</td>
                <td className="py-3 text-command-muted">{zone.isolationRisk}</td>
                <td className="py-3">
                  <DataSourceBadge
                    provenance={{
                      tier: zone.status,
                      source: 'Illustrative MCDA Calibration Matrix',
                      timestamp: '2026-08-27T06:00:00Z',
                      confidence: 0.82,
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
