import React, { useState, useEffect, useMemo } from 'react';
import type { MapLayerConfig, PriorityActionItem } from '../../types';
import type { 
  PriorityZone, 
  ResponsePriorityTier, 
  StagedReliefUnit 
} from '../../types/response';
import { 
  responsePriorityService, 
  INITIAL_PRIORITY_ZONES, 
  DEMO_STAGED_UNITS 
} from '../../services/ResponsePriorityService';
import { PriorityZoneCard } from './PriorityZoneCard';
import { ResponseDetailsPanel } from './ResponseDetailsPanel';
import { ResponseMapOverlay } from './ResponseMapOverlay';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  ShieldAlert, 
  UserCheck, 
  Radio, 
  Truck, 
  CheckCircle2
} from 'lucide-react';

interface ResponseViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  priorityItems?: PriorityActionItem[];
  onApproveAction?: (id: string) => void;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
}) => {
  const [selectedTier, setSelectedTier] = useState<ResponsePriorityTier | 'ALL'>('ALL');
  const [zones, setZones] = useState<PriorityZone[]>(INITIAL_PRIORITY_ZONES);
  const [selectedZone, setSelectedZone] = useState<PriorityZone>(INITIAL_PRIORITY_ZONES[0]);
  const [stagedUnits, setStagedUnits] = useState<StagedReliefUnit[]>(DEMO_STAGED_UNITS);
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [dispatchAlert, setDispatchAlert] = useState<string | null>(null);

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

  const filteredZones = useMemo(() => {
    if (selectedTier === 'ALL') return zones;
    return zones.filter((z) => z.priorityTier === selectedTier);
  }, [zones, selectedTier]);

  const zoneCounts: Record<ResponsePriorityTier, number> = useMemo(() => {
    const counts: Record<ResponsePriorityTier, number> = {
      PRIORITY_1: 0,
      PRIORITY_2: 0,
      PRIORITY_3: 0,
    };
    zones.forEach((z) => {
      counts[z.priorityTier] = (counts[z.priorityTier] || 0) + 1;
    });
    return counts;
  }, [zones]);

  const handleSelectZone = (zone: PriorityZone) => {
    setSelectedZone(zone);
    setFocusedWaypoint(zone.coordinates);
  };

  const handleFocusZone = (coords: [number, number]) => {
    setFocusedWaypoint(coords);
  };

  const handleApproveActionDirective = (zoneId: string, _actionText: string) => {
    setDispatchAlert(`Advisory directive for ${zoneId} submitted to Incident Commander approval queue.`);
    onApproveAction?.(zoneId);
    setTimeout(() => {
      setDispatchAlert(null);
    }, 4500);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-700 text-rose-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              DECISION SUPPORT
            </span>
            <h2 className="text-sm font-bold text-command-text font-mono uppercase tracking-wider">
              EMERGENCY RESPONSE & TACTICAL TRIAGE
            </h2>
          </div>
          <p className="text-xs text-command-muted font-mono max-w-2xl">
            Human-in-the-loop prioritization transforming hazard risk, detected structural damage, population exposure, and road connectivity into actionable response directives.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 text-xs">
            <UserCheck className="w-4 h-4 text-command-accent-glow" />
            <span>HUMAN COMMAND SIGN-OFF MANDATORY</span>
          </div>

          <DataSourceBadge
            provenance={{
              tier: 'DEMO_VALUE',
              source: 'Multi-Factor Emergency Priority Engine (Prototype decision-support run)',
              timestamp: 'Dynamic runtime calculation',
              algorithm: 'Multi-Criteria Response Urgency Weighting',
            }}
            showDetails
          />
        </div>
      </div>

      {/* Dispatch Action Notification Alert */}
      {dispatchAlert && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between shadow-tactical-glow animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{dispatchAlert}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">EOC QUEUE UPDATED</span>
        </div>
      )}

      {/* Priority Tiers Filter Bar */}
      <ResponseMapOverlay
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        zoneCounts={zoneCounts}
      />

      {/* Main Grid: Priority List (Left 5 cols) + Map & Details (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Priority Queue & Staged Relief Units */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2 shadow-xl">
            <div className="flex items-center justify-between pb-1.5 border-b border-command-border/60">
              <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
                TRIAGE QUEUE ({filteredZones.length})
              </h3>
              <span className="text-[10px] text-command-dim">RANKED BY URGENCY</span>
            </div>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredZones.map((zone) => (
                <PriorityZoneCard
                  key={zone.id}
                  zone={zone}
                  isSelected={selectedZone.id === zone.id}
                  onSelectZone={handleSelectZone}
                />
              ))}
            </div>
          </div>

          {/* Staged Relief Units Card */}
          <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between pb-1.5 border-b border-command-border/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-command-accent-glow" />
                <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
                  DEMO ASSET ROSTER ({stagedUnits.length})
                </h3>
              </div>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800">
                ILLUSTRATIVE TEMPLATE
              </span>
            </div>

            <div className="space-y-2">
              {stagedUnits.map((unit) => (
                <div key={unit.id} className="p-2.5 rounded bg-command-panel border border-command-border text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-command-text text-[11px]">{unit.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow font-bold">
                      {unit.callsign}
                    </span>
                  </div>
                  <div className="text-[10px] text-command-muted">Role: {unit.role}</div>
                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-command-border/40">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>{unit.statusLabel}</span>
                    </span>
                    <span className="text-command-dim">{unit.contactFrequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Map Viewport & Deep Priority Details */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Tactical Map Viewport */}
          <div className="h-[380px] w-full rounded-lg overflow-hidden border border-command-border">
            <InteractiveMap
              layers={layers}
              onToggleLayer={onToggleLayer}
              onOpacityChange={onOpacityChange}
              activeAoiName={`PROTOTYPE RESPONSE PRIORITY: ${selectedZone.name}`}
              coordinates={selectedZone.coordinates}
              heightClass="h-[380px]"
              focusedWaypoint={focusedWaypoint}
            />
          </div>

          {/* Detailed Response Inspector */}
          <ResponseDetailsPanel
            zone={selectedZone}
            onFocusZone={handleFocusZone}
            onApproveActionDirective={handleApproveActionDirective}
          />
        </div>
      </div>
    </div>
  );
};
