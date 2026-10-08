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
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 font-mono shadow-xl flex flex-col h-full space-y-3">
      {/* Header & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-command-border/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-command-text">
            <Filter className="w-3.5 h-3.5 text-command-accent-glow" />
            <span className="uppercase">EVALUATED ASSETS CATALOG</span>
          </div>
          <span className="text-[10px] text-command-dim">
            {filteredFeatures.length} / {features.length} ASSETS
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-command-dim" />
          <input
            type="text"
            placeholder="Search feature ID, name, or bridge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-command-panel border border-command-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-command-text placeholder-command-dim focus:outline-none focus:border-command-accent"
          />
        </div>
      </div>

      {/* Scrollable Feature Cards List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[540px]">
        {filteredFeatures.length === 0 ? (
          <div className="p-4 text-center text-xs text-command-dim border border-dashed border-command-border rounded-lg">
            No assets match current category or search filter.
          </div>
        ) : (
          filteredFeatures.map((f) => {
            const config = DAMAGE_CATEGORY_CONFIGS[f.category];
            const isSelected = selectedFeatureId === f.id;

            return (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-command-surface border-command-accent shadow-tactical-glow'
                    : 'bg-command-panel/70 border-command-border hover:border-command-border-light'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-command-text">
                      {f.id}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${config.badgeClass}`}>
                      {f.categoryLabel}
                    </span>
                  </div>

                  {f.confidence !== undefined ? (
                    <span className="text-[10px] text-command-accent-glow font-bold">
                      {Math.round(f.confidence * 100)}%
                    </span>
                  ) : (
                    <span className="text-[9px] text-amber-300 font-mono px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/80">
                      PRECOMPUTED
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-command-text leading-tight mb-1">
                  {f.name}
                </div>

                <p className="text-[10px] text-command-dim leading-snug line-clamp-2 mb-2">
                  {f.evidence.description}
                </p>

                <div className="flex items-center justify-between text-[9px] text-command-dim pt-1.5 border-t border-command-border/40">
                  <span>{f.coordinates[1].toFixed(4)}°N, {f.coordinates[0].toFixed(4)}°E</span>
                  <span className="text-command-accent-glow flex items-center gap-0.5">
                    <span>INSPECT</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
