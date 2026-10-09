import React from 'react';
import type { PriorityActionItem } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
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
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800';
      case 'SEARCH_RESCUE':
        return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/80 dark:text-orange-300 dark:border-orange-800';
      case 'ROUTE_CLEARANCE':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800';
      case 'MEDICAL_AIRLIFT':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800';
      case 'STRUCTURAL_SURVEY':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800';
    }
  };

  const getStatusBadge = (status: PriorityActionItem['status']) => {
    switch (status) {
      case 'PENDING_HUMAN_REVIEW':
        return {
          label: 'Requires Human Officer Review',
          class: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/80',
          icon: Clock,
        };
      case 'APPROVED_FOR_DISPATCH':
        return {
          label: 'Human Review Completed',
          class: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/80',
          icon: UserCheck,
        };
      case 'DEPLOYED':
        return {
          label: 'Field Units Active',
          class: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-sky-950/50 dark:text-sky-400 dark:border-sky-800/80',
          icon: Radio,
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          class: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700/80',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 flex flex-col h-full font-sans shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-command-border/60">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-command-text">
              Emergency Action Priorities (Human Review Required)
            </h3>
            <span className="text-xs text-slate-500 dark:text-command-dim">
              System proposes advisory directives; no resources dispatched automatically
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-command-surface text-slate-700 dark:text-command-dim">
          {items.length} items
        </span>
      </div>

      {/* Item List */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const statusInfo = getStatusBadge(item.status);
          const StatusIcon = statusInfo.icon;
          const isPending = item.status === 'PENDING_HUMAN_REVIEW';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                item.severity === 'CRITICAL'
                  ? 'bg-rose-50/40 border-rose-200 dark:bg-command-panel/80 dark:border-rose-900/50'
                  : 'bg-slate-50 dark:bg-command-panel/50 border-slate-200 dark:border-command-border'
              }`}
            >
              {/* Metadata row */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(item.category)}`}>
                    {item.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-command-accent-glow">
                    {item.zone}
                  </span>
                </div>

                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${statusInfo.class}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              {/* Action Description */}
              <p className="text-xs sm:text-sm text-slate-800 dark:text-command-text mb-2.5 leading-relaxed">
                {item.title}
              </p>

              {/* Justification & Human Review CTA */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-command-border/60 flex items-center justify-between gap-2 flex-wrap text-xs">
                <DataSourceBadge provenance={item.provenance} />

                {isPending && onApproveAction && (
                  <button
                    onClick={() => onApproveAction(item.id)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm Review
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
