import React, { useState } from 'react';
import type { 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent,
  IncidentInfo
} from '../../types';
import { MapPanel } from '../../components/tactical/MapPanel';
import { EventSummaryPanel } from '../../components/tactical/EventSummaryPanel';
import { KPIGrid } from '../../components/tactical/KPIGrid';
import { PriorityList } from '../../components/tactical/PriorityList';
import { RiskIndicator } from '../../components/tactical/RiskIndicator';
import { 
  Clock, 
} from 'lucide-react';

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
  isMapFocused?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incident,
  kpis,
  layers,
  priorityItems,
  riskMetric,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
  isMapFocused = false,
}) => {
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [sideTab, setSideTab] = useState<'OVERVIEW' | 'KPIS' | 'QUEUE'>('OVERVIEW');

  return (
    <div className="space-y-3 font-mono">
      {/* Compact Top Event Header Banner */}
      <div className="bg-command-card/90 border border-command-border rounded-lg px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold">
              REAL-WORLD EVENT
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-command-text">
              26 AUG 2026 — NEPAL–CHINA FLOOD & DEBRIS CORRIDOR
            </h2>
          </div>
          <span className="text-command-dim text-xs hidden lg:inline">|</span>
          <span className="text-[11px] text-command-muted hidden lg:inline">
            Bhote Koshi / Poiqu Basin • Araniko Highway Lifeline
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-300 text-[10px] font-bold">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>Mechanism under investigation</span>
          </div>
          <span className="text-[10px] text-command-dim hidden sm:inline">
            DHM Gauge 610 Telemetry Ref
          </span>
        </div>
      </div>

      {/* Main Workspace: Dominant Map (65-70%) + Floating / Side Panel (30-35%) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[640px]`}>
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Bhote Koshi / Tatopani Transboundary AOI"
            coordinates={incident.centerCoordinates}
            focusedWaypoint={focusedWaypoint}
          />
        </div>

        {/* Right Tactical Analytical Deck */}
        {!isMapFocused && (
          <div className="lg:col-span-4 flex flex-col h-[640px] space-y-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-lg p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('OVERVIEW')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'OVERVIEW'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                EVENT & SOURCES
              </button>
              <button
                onClick={() => setSideTab('KPIS')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'KPIS'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                RAPID METRICS
              </button>
              <button
                onClick={() => setSideTab('QUEUE')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'QUEUE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                ACTION QUEUE
              </button>
            </div>

            {/* Tab 1: Event Summary & Waypoints */}
            {sideTab === 'OVERVIEW' && (
              <div className="flex-1 overflow-y-auto">
                <EventSummaryPanel onFocusWaypoint={(coords) => setFocusedWaypoint(coords)} />
              </div>
            )}

            {/* Tab 2: KPIS & Risk Indicator */}
            {sideTab === 'KPIS' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <KPIGrid cards={kpis} />
                <RiskIndicator
                  score={riskMetric.compositeScore}
                  zoneName={riskMetric.zoneName}
                  severity={riskMetric.severity}
                  provenance={riskMetric.provenance}
                />
              </div>
            )}

            {/* Tab 3: Action Queue */}
            {sideTab === 'QUEUE' && (
              <div className="flex-1 overflow-y-auto pr-1">
                <PriorityList
                  items={priorityItems}
                  onApproveAction={onApproveAction}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
