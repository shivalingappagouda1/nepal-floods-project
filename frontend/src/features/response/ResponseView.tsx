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
    <div className="space-y-4 font-sans">
      {/* Top Header Strip */}
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-rose-950 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-command-text">
              Emergency Help & Response Guidance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-command-muted">
            Find safety guidance, response priorities, and road access conditions for affected communities.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold">
            Human review required
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-sky-950/70 border border-blue-200 dark:border-sky-800 text-blue-800 dark:text-sky-300 text-xs font-semibold">
            Decision support only
          </span>
        </div>
      </div>

      {/* Dispatch Alert Toast */}
      {dispatchAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{dispatchAlert}</span>
        </div>
      )}

      {/* Main Workspace: Dominant Map + Right Response Deck */}
      <div className={`grid gap-4 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport (MapLibre Map completely preserved) */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[650px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-command-border`}>
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
          <div className="lg:col-span-4 flex flex-col h-[650px] space-y-3">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl p-1 text-xs shrink-0 shadow-xs">
              <button
                onClick={() => setSideTab('DIRECTIVE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'DIRECTIVE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Directive
              </button>
              <button
                onClick={() => setSideTab('ZONES')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'ZONES'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Priority Zones ({zones.length})
              </button>
              <button
                onClick={() => setSideTab('UNITS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'UNITS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Relief Units ({stagedUnits.length})
              </button>
            </div>

            {/* Tab 1: Selected Directive */}
            {sideTab === 'DIRECTIVE' && (
              <div className="flex-1 overflow-y-auto">
                <ResponseDetailsPanel
                  zone={selectedZone}
                  onFocusZone={handleFocusZone}
                  onApproveActionDirective={handleApproveActionDirective}
                />
              </div>
            )}

            {/* Tab 2: All Priority Zones */}
            {sideTab === 'ZONES' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {zones.map((zone) => (
                  <PriorityZoneCard
                    key={zone.id}
                    zone={zone}
                    isSelected={zone.id === selectedZone.id}
                    onSelectZone={handleSelectZone}
                  />
                ))}
              </div>
            )}

            {/* Tab 3: Staged Relief Units */}
            {sideTab === 'UNITS' && (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs mb-2 leading-relaxed">
                  <strong>Notice:</strong> Staged units represent simulated demonstration assets for coordination training.
                </div>
                {stagedUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-command-text flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>{unit.name}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {unit.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Base: {unit.baseLocation} • Agency: {unit.agency}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Role: {unit.role} • Contact: {unit.contactFrequency}
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
