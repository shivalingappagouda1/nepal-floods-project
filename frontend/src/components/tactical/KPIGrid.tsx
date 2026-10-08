import React from 'react';
import type { KPICardData } from '../../types';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIGridProps {
  cards: KPICardData[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const isCritical = card.severity === 'CRITICAL';
        const isHigh = card.severity === 'HIGH';

        return (
          <div
            key={card.id}
            className={`bg-command-card border rounded-lg p-3.5 flex flex-col justify-between transition-all ${
              isCritical
                ? 'border-rose-900/60 shadow-tactical-critical/10'
                : isHigh
                ? 'border-amber-900/60'
                : 'border-command-border'
            }`}
          >
            {/* Header: Label & Trend */}
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-[11px] font-semibold text-command-muted uppercase tracking-wider line-clamp-1">
                {card.label}
              </span>
              {card.trend && (
                <span className="inline-flex items-center text-[10px] font-mono text-command-dim">
                  {card.trend === 'up' && <TrendingUp className="w-3 h-3 text-rose-400 mr-0.5" />}
                  {card.trend === 'down' && <TrendingDown className="w-3 h-3 text-emerald-400 mr-0.5" />}
                  {card.trend === 'stable' && <Minus className="w-3 h-3 text-command-dim mr-0.5" />}
                  {card.statusLabel}
                </span>
              )}
            </div>

            {/* Metric Value */}
            <div className="my-2.5 flex items-baseline gap-1.5">
              <span
                className={`font-mono text-2xl font-bold tracking-tight ${
                  card.value === '—' || card.value.includes('Awaiting')
                    ? 'text-command-dim text-lg italic'
                    : isCritical
                    ? 'text-rose-400'
                    : isHigh
                    ? 'text-amber-400'
                    : 'text-command-text'
                }`}
              >
                {card.value}
              </span>
              {card.unit && (
                <span className="font-mono text-xs text-command-dim">
                  {card.unit}
                </span>
              )}
            </div>

            {/* Footer: Provenance & Confidence */}
            <div className="pt-2 border-t border-command-border/60 flex items-center justify-between gap-2 mt-auto">
              <DataSourceBadge provenance={card.provenance} />
              <ConfidenceBadge confidence={card.provenance.confidence} size="sm" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
