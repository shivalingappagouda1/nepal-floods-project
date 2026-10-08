import React from 'react';
import type { 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent,
  IncidentInfo
} from '../../types';
import { KPIGrid } from '../../components/tactical/KPIGrid';
import { MapPanel } from '../../components/tactical/MapPanel';
import { RiskIndicator } from '../../components/tactical/RiskIndicator';
import { PriorityList } from '../../components/tactical/PriorityList';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { Activity } from 'lucide-react';

interface DashboardViewProps {
  incident: IncidentInfo;
  kpis: KPICardData[];
  layers: MapLayerConfig[];
  priorityItems: PriorityActionItem[];
  riskMetric: RiskZoneMetric;
  activityLogs: ActivityEvent[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onApproveAction: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incident,
  kpis,
  layers,
  priorityItems,
  riskMetric,
  activityLogs,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Incident Summary Banner */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-[10px] font-bold">
              ACTIVE SITUATION
            </span>
            <h2 className="text-sm font-bold text-command-text font-mono">
              {incident.title}
            </h2>
          </div>
          <p className="text-xs text-command-muted font-mono max-w-2xl">
            Transboundary GLOF surge and debris flow along the Bhote Koshi / Araniko Highway axis. AI change detection and baseline OSM infrastructure correlation active.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-command-border pt-3 md:pt-0 md:pl-4">
          <div className="text-right font-mono">
            <span className="text-[10px] text-command-dim block">AOI BOUNDARY</span>
            <span className="text-xs font-bold text-command-text">{incident.boundingCoordinates}</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-command-dim block">LEAD AGENCIES</span>
            <span className="text-xs font-bold text-command-accent-glow">NDRRMA / DHM / ICIMOD</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KPIGrid cards={kpis} />

      {/* Main Grid: Map (Left 8 Cols) + Tactical Panels (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center Map Viewport */}
        <div className="lg:col-span-8 flex flex-col h-[600px]">
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName={incident.region}
            coordinates={incident.centerCoordinates}
          />
        </div>

        {/* Right Tactical Analytical Deck */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Composite Risk Index */}
          <RiskIndicator
            score={riskMetric.compositeScore}
            zoneName={riskMetric.zoneName}
            severity={riskMetric.severity}
            provenance={riskMetric.provenance}
          />

          {/* Activity Log / Telemetry Feed */}
          <div className="bg-command-card border border-command-border rounded-lg p-3 flex-1 flex flex-col min-h-[240px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/60">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-command-accent-glow" />
                <h4 className="font-mono text-xs font-bold text-command-text uppercase tracking-wider">
                  SATELLITE & SENSOR EVENT STREAM
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 max-h-[220px] pr-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-command-panel/70 border border-command-border text-[11px] font-mono">
                  <div className="flex items-center justify-between gap-1 text-[10px] text-command-dim mb-1">
                    <span className="text-command-accent-glow font-bold">{log.timestamp}</span>
                    <DataSourceBadge provenance={{ tier: log.tier, source: log.source, timestamp: log.timestamp }} />
                  </div>
                  <div className="font-semibold text-command-text">{log.title}</div>
                  <div className="text-command-muted text-[10px] mt-0.5">{log.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Response Action Queue */}
      <PriorityList
        items={priorityItems}
        onApproveAction={onApproveAction}
      />
    </div>
  );
};
