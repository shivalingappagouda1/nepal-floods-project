import React, { useState, useEffect } from 'react';
import type { MapLayerConfig, PriorityActionItem } from '../../types';
import type { 
  PriorityZone, 
  StagedReliefUnit 
} from '../../types/response';
import { 
  responsePriorityService, 
  INITIAL_PRIORITY_ZONES, 
  DEMO_STAGED_UNITS 
} from '../../services/ResponsePriorityService';
import { PriorityZoneCard } from './PriorityZoneCard';
import { ResponseDetailsPanel } from './ResponseDetailsPanel';
import { MapPanel } from '../../components/tactical/MapPanel';
import { 
  ShieldAlert, 
  Truck, 
  CheckCircle2, 
} from 'lucide-react';

interface ResponseViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  priorityItems?: PriorityActionItem[];
  onApproveAction?: (id: string) => void;
  isMapFocused?: boolean;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
  isMapFocused = false,
}) => {
  const [zones, setZones] = useState<PriorityZone[]>(INITIAL_PRIORITY_ZONES);
  const [selectedZone, setSelectedZone] = useState<PriorityZone>(INITIAL_PRIORITY_ZONES[0]);
  const [stagedUnits, setStagedUnits] = useState<StagedReliefUnit[]>(DEMO_STAGED_UNITS);
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);
  const [sideTab, setSideTab] = useState<'DIRECTIVE' | 'ZONES' | 'UNITS'>('DIRECTIVE');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const z = await responsePriorityService.getPriorityZones();
      const u = await responsePriorityService.getStagedUnits();
      if (isMounted) {
        setZones(z);
        setStagedUnits(u);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectZone = (zone: PriorityZone) => {
    setSelectedZone(zone);
    setFocusedWaypoint(zone.coordinates);
    setSideTab('DIRECTIVE');
  };

  const handleFocusZone = (coords: [number, number]) => {
    setFocusedWaypoint(coords);
  };

  const handleApproveActionDirective = (zoneId: string, _actionText: string) => {
    setDispatchAlert(`Advisory directive for ${zoneId} submitted to Incident Commander review queue.`);
    onApproveAction?.(zoneId);
    setTimeout(() => {
      setDispatchAlert(null);
    }, 4000);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Header Strip */}
      <div className="bg-command-card/90 border border-command-border rounded-lg px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-tactical-amber" />
              EMERGENCY RESPONSE DIRECTIVES
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-command-text">
              DECISION-SUPPORT PRIORITIZATION QUEUE
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-bold">
            HUMAN REVIEW REQUIRED
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/70 border border-sky-800 text-sky-300 font-bold">
            DECISION-SUPPORT QUEUE ONLY
          </span>
        </div>
      </div>

      {/* Dispatch Alert Toast */}
      {dispatchAlert && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2 shadow-tactical-glow">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dispatchAlert}</span>
        </div>
      )}

      {/* Main Workspace: Dominant Map (65-70%) + Right Response Deck (30-35%) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[640px]`}>
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Emergency Staging & Priority Zones"
            coordinates={selectedZone.coordinates}
            focusedWaypoint={focusedWaypoint}
          />
        </div>

        {/* Right Response & Priority Deck */}
        {!isMapFocused && (
          <div className="lg:col-span-4 flex flex-col h-[640px] space-y-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-lg p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('DIRECTIVE')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'DIRECTIVE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                DIRECTIVE
              </button>
              <button
                onClick={() => setSideTab('ZONES')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'ZONES'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                PRIORITY ZONES ({zones.length})
              </button>
              <button
                onClick={() => setSideTab('UNITS')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'UNITS'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                STAGED UNITS ({stagedUnits.length})
              </button>
            </div>

            {/* Tab 1: Selected Zone Directive */}
            {sideTab === 'DIRECTIVE' && (
              <div className="flex-1 overflow-y-auto">
                <ResponseDetailsPanel
                  zone={selectedZone}
                  onFocusZone={handleFocusZone}
                  onApproveActionDirective={handleApproveActionDirective}
                />
              </div>
            )}

            {/* Tab 2: Priority Zones List */}
            {sideTab === 'ZONES' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {zones.map((z) => (
                  <PriorityZoneCard
                    key={z.id}
                    zone={z}
                    isSelected={selectedZone.id === z.id}
                    onSelectZone={handleSelectZone}
                  />
                ))}
              </div>
            )}

            {/* Tab 3: Staged Emergency Units */}
            {sideTab === 'UNITS' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {stagedUnits.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-lg bg-command-panel border border-command-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-command-text">{u.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                        {u.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-command-muted">
                      Base: {u.baseLocation} • Agency: {u.agency}
                    </p>
                    <div className="text-[10px] text-command-dim flex items-center gap-2">
                      <Truck className="w-3 h-3 text-command-accent-glow" />
                      <span>{u.role} • Callsign: {u.callsign} • Freq: {u.contactFrequency}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
