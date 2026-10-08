import React from 'react';
import type { PriorityActionItem } from '../../types';
import { PriorityList } from '../../components/tactical/PriorityList';
import { 
  ShieldAlert, 
  UserCheck, 
  Radio, 
  Truck, 
  AlertTriangle
} from 'lucide-react';

interface ResponseViewProps {
  priorityItems: PriorityActionItem[];
  onApproveAction: (id: string) => void;
}

export const ResponseView: React.FC<ResponseViewProps> = ({
  priorityItems,
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

      {/* Main Grid: Priority Action Queue & Unit Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Full Priority Queue */}
        <div className="lg:col-span-7">
          <PriorityList
            items={priorityItems}
            onApproveAction={onApproveAction}
          />
        </div>

        {/* Right 5 Cols: Relief Units & Audit Trail */}
        <div className="lg:col-span-5 space-y-4">
          {/* Staged Units */}
          <div className="bg-command-card border border-command-border rounded-lg p-4">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-command-border/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-command-accent-glow" />
                <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
                  RESPONDING AGENCIES & UNITS
                </h3>
              </div>
              <span className="text-[10px] text-command-dim">3 ACTIVE UNITS</span>
            </div>

            <div className="space-y-2.5">
              {reliefUnits.map((unit) => (
                <div key={unit.callsign} className="p-2.5 rounded bg-command-panel border border-command-border text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-command-text">{unit.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow font-bold">
                      {unit.callsign}
                    </span>
                  </div>
                  <div className="text-[11px] text-command-muted mb-1">Role: {unit.role}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{unit.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Support Guardrail */}
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-4 text-xs text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>DECISION-SUPPORT POLICY NOTE</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/90">
              HIMALAYA-SHIELD computes severity ranking and exposure vectors. Final dispatch authorization and risk mitigation mandates remain strictly under the authority of the designated EOC Incident Commander.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
