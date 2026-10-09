import React, { useState } from 'react';
import type { DamageFeature, DamageCategory } from '../../types/damage';
import { DAMAGE_CATEGORY_CONFIGS } from '../../data/damageConfigs';
import { 
  Search, 
  ChevronRight, 
  Filter 
} from 'lucide-react';

interface DamageFeatureListProps {
  features: DamageFeature[];
  selectedFeatureId: string | null;
  onSelectFeature: (feature: DamageFeature) => void;
  selectedCategory: DamageCategory | 'ALL';
}

export const DamageFeatureList: React.FC<DamageFeatureListProps> = ({
  features,
  selectedFeatureId,
  onSelectFeature,
  selectedCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = features.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch = 
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 font-sans shadow-xs flex flex-col h-full space-y-3">
      {/* Header & Search */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-command-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-command-text">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Inspection List</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-command-dim">
            {filteredFeatures.length} places
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bridges, roads, settlements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-command-text placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Feature Items List */}
      <div className="space-y-2 overflow-y-auto pr-1 flex-1">
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No matching locations found
          </div>
        ) : (
          filteredFeatures.map((f) => {
            const isSelected = f.id === selectedFeatureId;
            const categoryConfig = DAMAGE_CATEGORY_CONFIGS[f.category];

            return (
              <button
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs dark:bg-blue-950/40'
                    : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200 dark:bg-command-panel/60 dark:border-command-border'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-command-dim">
                      {f.id}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryConfig.badgeClass}`}>
                      {f.categoryLabel}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-command-text truncate">
                    {f.name}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-command-muted truncate">
                    {f.affectedDimension}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                }`} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
