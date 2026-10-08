import React from 'react';
import type { PriorityActionItem, MapLayerConfig } from '../../types';
import { PriorityList } from '../../components/tactical/PriorityList';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { 
  ShieldAlert, 
  UserCheck, 
  Radio, 
  Truck 
} from 'lucide-react';

interface ResponseViewProps {
  priorityItems: PriorityActionItem[];
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onApproveAction: (id: string) => void;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  priorityItems,
  layers,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
}) => {
  const reliefUnits = [
    {
      name: 'Nepal Army Disaster Management Directorate',
      role: 'Heavy Engineering & River Clearance',
      status: 'STANDBY / STAGED AT BHRABISE',
      callsign: 'NA-ENG-101',
    },
    {
      name: 'Armed Police Force (APF) Disaster Response Unit',
      role: 'Swift Water Rescue & High-Line Evacuation',
      status: 'EN ROUTE / SECTOR TATOPANI',
      callsign: 'APF-RESCUE-4',
    },
    {
      name: 'Nepal Red Cross Society (NRCS) Emergency Team',
      role: 'Emergency Shelter & First Aid Relief',
      status: 'ESTABLISHING STAGING AREA',
      callsign: 'NRCS-RELIEF-A',
    },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-command-text uppercase tracking-wider">
              EMERGENCY OPERATIONS CENTER (EOC) RESPONSE COMMAND
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Human-in-the-loop triage and multi-agency tactical resource coordination.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-950/60 border border-sky-800 text-sky-300 text-xs">
            <UserCheck className="w-4 h-4 text-command-accent-glow" />
            <span>HITL MANDATORY: DISPATCH REQUIRES COMMAND SIGN-OFF</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Queue (Left 5 Cols) + Interactive Tactical Map (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Priority Directives & Units */}
        <div className="lg:col-span-5 space-y-4">
          <PriorityList
            items={priorityItems}
            onApproveAction={onApproveAction}
          />

          {/* Staged Units */}
          <div className="bg-command-card border border-command-border rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-command-accent-glow" />
                <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
                  RESPONDING AGENCIES & UNITS
                </h3>
              </div>
              <span className="text-[10px] text-command-dim">3 ACTIVE UNITS</span>
            </div>

            <div className="space-y-2">
              {reliefUnits.map((unit) => (
                <div key={unit.callsign} className="p-2 rounded bg-command-panel border border-command-border text-xs">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-command-text text-[11px]">{unit.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow font-bold">
                      {unit.callsign}
                    </span>
                  </div>
                  <div className="text-[10px] text-command-muted mb-1">Role: {unit.role}</div>
                  <div className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{unit.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Map with Priority Points */}
        <div className="lg:col-span-7 h-[680px]">
          <InteractiveMap
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="EOC Dispatch Operational Grid"
            heightClass="h-[680px]"
          />
        </div>
      </div>
    </div>
  );
};
