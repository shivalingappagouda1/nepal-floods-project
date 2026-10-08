import React from 'react';
import type { PriorityActionItem } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  MapPin, 
  Radio
} from 'lucide-react';

interface PriorityListProps {
  items: PriorityActionItem[];
  onApproveAction?: (id: string) => void;
}

export const PriorityList: React.FC<PriorityListProps> = ({ 
  items, 
  onApproveAction 
}) => {
  const getCategoryColor = (category: PriorityActionItem['category']) => {
    switch (category) {
      case 'EVACUATION':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'SEARCH_RESCUE':
        return 'bg-orange-950/80 text-orange-300 border-orange-800';
      case 'ROUTE_CLEARANCE':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'MEDICAL_AIRLIFT':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'STRUCTURAL_SURVEY':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
    }
  };

  const getStatusBadge = (status: PriorityActionItem['status']) => {
    switch (status) {
      case 'PENDING_HUMAN_REVIEW':
        return {
          label: 'PENDING HUMAN REVIEW',
          class: 'bg-amber-950/50 text-amber-400 border-amber-800/80',
          icon: Clock,
        };
      case 'APPROVED_FOR_DISPATCH':
        return {
          label: 'HUMAN REVIEW COMPLETE',
          class: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80',
          icon: UserCheck,
        };
      case 'DEPLOYED':
        return {
          label: 'FIELD UNITS ACTIVE',
          class: 'bg-sky-950/50 text-sky-400 border-sky-800/80',
          icon: Radio,
        };
      case 'RESOLVED':
        return {
          label: 'RESOLVED',
          class: 'bg-slate-900/50 text-slate-400 border-slate-700/80',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 flex flex-col h-full font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-command-border/60">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-tactical-amber" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-command-text">
            DECISION-SUPPORT QUEUE (HUMAN-IN-THE-LOOP)
          </h3>
        </div>
        <span className="text-[10px] text-command-dim">
          {items.length} DIRECTIVES
        </span>
      </div>

      {/* Item List */}
      <div className="space-y-2.5 overflow-y-auto pr-1">
        {items.map((item) => {
          const statusInfo = getStatusBadge(item.status);
          const StatusIcon = statusInfo.icon;
          const isPending = item.status === 'PENDING_HUMAN_REVIEW';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all ${
                item.severity === 'CRITICAL'
                  ? 'bg-command-panel/80 border-rose-900/50'
                  : 'bg-command-panel/50 border-command-border'
              }`}
            >
              {/* Top metadata line */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-command-surface text-command-accent-glow border border-command-border">
                    P{item.rank}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-command-dim">
                    <MapPin className="w-3 h-3 text-command-muted" />
                    {item.zone}
                  </span>
                </div>

                <div className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border ${statusInfo.class}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              {/* Title & description */}
              <h4 className="text-xs font-semibold text-command-text mb-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-command-muted mb-2">
                Est. Exposed: <span className="text-command-text font-bold">{item.affectedPopulationEstimate}</span> | Unit Target: <span className="text-command-text">{item.assignedUnit || 'Unassigned'}</span>
              </p>

              {/* Provenance & Action Row */}
              <div className="pt-2 border-t border-command-border/40 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <DataSourceBadge provenance={item.provenance} />
                  <ConfidenceBadge confidence={item.confidence} size="sm" />
                </div>

                {isPending && onApproveAction && (
                  <button
                    onClick={() => onApproveAction(item.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 rounded transition-colors"
                  >
                    <UserCheck className="w-3 h-3" />
                    REVIEW DIRECTIVE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
