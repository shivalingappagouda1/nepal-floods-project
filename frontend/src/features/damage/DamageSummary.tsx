import React from 'react';
import type { DamageCategory, DamageSummaryStats } from '../../types/damage';
import { 
  Building2, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  HelpCircle, 
  Clock 
} from 'lucide-react';

interface DamageSummaryProps {
  stats: DamageSummaryStats;
  selectedCategory: DamageCategory | 'ALL';
  onSelectCategory: (cat: DamageCategory | 'ALL') => void;
}

export const DamageSummary: React.FC<DamageSummaryProps> = ({
  stats,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-xl space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-command-border">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Building2 className="w-3.5 h-3.5 text-command-accent-glow" />
            <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
              INFRASTRUCTURE EXPOSURE & DAMAGE SUMMARY
            </h3>
          </div>
          <p className="text-[10px] text-command-dim">
            Evaluated via Multi-Sensor Optical (MNDWI/NDVI) & C-Band SAR amplitude tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-command-dim">
          <Clock className="w-3 h-3 text-command-accent-glow" />
          <span>SYNC: {stats.lastAnalysisSync.replace('T', ' ').substring(0, 19)} UTC</span>
        </div>
      </div>

      {/* Metric Cards & Category Filter Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Total Inspected */}
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-command-accent/20 border-command-accent shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-command-border-light'
          }`}
        >
          <div className="text-[9px] text-command-dim uppercase font-bold">ALL ASSETS</div>
          <div className="text-base font-bold text-command-text">{stats.totalFeaturesEvaluated}</div>
          <div className="text-[9px] text-command-accent-glow">View full catalog</div>
        </button>

        {/* Destroyed / Inaccessible */}
        <button
          onClick={() => onSelectCategory('DESTROYED_INACCESSIBLE')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'DESTROYED_INACCESSIBLE'
              ? 'bg-purple-950/40 border-purple-600 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-purple-800'
          }`}
        >
          <div className="text-[9px] text-purple-400 uppercase font-bold flex items-center gap-1">
            <XCircle className="w-2.5 h-2.5" />
            <span>DESTROYED</span>
          </div>
          <div className="text-base font-bold text-purple-300">
            {stats.byCategory.DESTROYED_INACCESSIBLE || 0}
          </div>
          <div className="text-[9px] text-purple-200/70">Critical breach</div>
        </button>

        {/* Severe Damage */}
        <button
          onClick={() => onSelectCategory('SEVERE_DAMAGE')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'SEVERE_DAMAGE'
              ? 'bg-rose-950/40 border-rose-600 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-rose-800'
          }`}
        >
          <div className="text-[9px] text-rose-400 uppercase font-bold flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>SEVERE</span>
          </div>
          <div className="text-base font-bold text-rose-300">
            {stats.byCategory.SEVERE_DAMAGE || 0}
          </div>
          <div className="text-[9px] text-rose-200/70">Approach severed</div>
        </button>

        {/* Moderate Damage */}
        <button
          onClick={() => onSelectCategory('MODERATE_DAMAGE')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'MODERATE_DAMAGE'
              ? 'bg-orange-950/40 border-orange-600 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-orange-800'
          }`}
        >
          <div className="text-[9px] text-orange-400 uppercase font-bold">MODERATE</div>
          <div className="text-base font-bold text-orange-300">
            {stats.byCategory.MODERATE_DAMAGE || 0}
          </div>
          <div className="text-[9px] text-orange-200/70">Silt / Bank erosion</div>
        </button>

        {/* Possible Damage */}
        <button
          onClick={() => onSelectCategory('POSSIBLE_DAMAGE')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'POSSIBLE_DAMAGE'
              ? 'bg-amber-950/40 border-amber-600 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-amber-800'
          }`}
        >
          <div className="text-[9px] text-amber-400 uppercase font-bold flex items-center gap-1">
            <HelpCircle className="w-2.5 h-2.5" />
            <span>POSSIBLE</span>
          </div>
          <div className="text-base font-bold text-amber-300">
            {stats.byCategory.POSSIBLE_DAMAGE || 0}
          </div>
          <div className="text-[9px] text-amber-200/70">Drone check req.</div>
        </button>

        {/* No Significant Change */}
        <button
          onClick={() => onSelectCategory('NO_SIGNIFICANT_CHANGE')}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            selectedCategory === 'NO_SIGNIFICANT_CHANGE'
              ? 'bg-emerald-950/40 border-emerald-600 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border hover:border-emerald-800'
          }`}
        >
          <div className="text-[9px] text-emerald-400 uppercase font-bold flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>INTACT</span>
          </div>
          <div className="text-base font-bold text-emerald-300">
            {stats.byCategory.NO_SIGNIFICANT_CHANGE || 0}
          </div>
          <div className="text-[9px] text-emerald-200/70">Baseline stable</div>
        </button>
      </div>
    </div>
  );
};
