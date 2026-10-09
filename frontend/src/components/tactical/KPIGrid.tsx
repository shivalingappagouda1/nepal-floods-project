import React from 'react';
import type { KPICardData } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIGridProps {
  cards: KPICardData[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      {cards.map((card) => {
        const isCritical = card.severity === 'CRITICAL';
        const isHigh = card.severity === 'HIGH';

        return (
          <div
            key={card.id}
            className={`bg-white dark:bg-command-card border rounded-2xl p-4 flex flex-col justify-between transition-all shadow-xs ${
              isCritical
                ? 'border-rose-300 dark:border-rose-900/60'
                : isHigh
                ? 'border-amber-300 dark:border-amber-900/60'
                : 'border-slate-200 dark:border-command-border'
            }`}
          >
            {/* Header: Label & Trend */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-command-muted line-clamp-1">
                {card.label}
              </span>
              {card.trend && (
                <span className="inline-flex items-center text-[11px] text-slate-500 dark:text-command-dim">
                  {card.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-rose-600 mr-0.5" />}
                  {card.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />}
                  {card.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-slate-400 mr-0.5" />}
                  {card.statusLabel}
                </span>
              )}
            </div>

            {/* Metric Value */}
            <div className="my-2.5 flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  card.value === '—' || card.value.includes('Awaiting')
                    ? 'text-slate-400 text-lg italic'
                    : isCritical
                    ? 'text-rose-600 dark:text-rose-400'
                    : isHigh
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-900 dark:text-command-text'
                }`}
              >
                {card.value}
              </span>
              {card.unit && (
                <span className="text-xs text-slate-500 dark:text-command-dim font-medium">
                  {card.unit}
                </span>
              )}
            </div>

            {/* Footer: Provenance */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-command-border/60 flex items-center justify-between gap-2 mt-auto">
              <DataSourceBadge provenance={card.provenance} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
