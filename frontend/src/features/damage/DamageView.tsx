import React, { useState } from 'react';
import type { MapLayerConfig } from '../../types';
import type { 
  DamageFeature, 
} from '../../types/damage';
import { 
  MOCK_DAMAGE_FEATURES 
} from '../../services/DamageAssessmentService';
import { DamageLegend } from './DamageLegend';
import { DamageDetailsPanel } from './DamageDetailsPanel';
import { DamageFeatureList } from './DamageFeatureList';
import { MapPanel } from '../../components/tactical/MapPanel';
import { 
  Building2, 
} from 'lucide-react';

interface DamageViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  isMapFocused?: boolean;
}

export const DamageView: React.FC<DamageViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  isMapFocused = false,
}) => {
  const features: DamageFeature[] = MOCK_DAMAGE_FEATURES;
  const [selectedFeature, setSelectedFeature] = useState<DamageFeature | null>(MOCK_DAMAGE_FEATURES[0]);
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [sideTab, setSideTab] = useState<'FEATURE' | 'CATALOG' | 'LEGEND'>('FEATURE');

  const handleSelectFeature = (feature: DamageFeature) => {
    setSelectedFeature(feature);
    setFocusedWaypoint(feature.coordinates);
    setSideTab('FEATURE');
  };

  const handleFocusFeature = (coords: [number, number]) => {
    setFocusedWaypoint(coords);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Header Strip */}
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-command-text">
              Damage Check
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-command-muted">
            See places that may need inspection, including bridges, blocked roads, and riverside buildings.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold">
            Prototype inspection queue
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-600 dark:text-command-dim text-xs">
            Field check recommended
          </span>
        </div>
      </div>

      {/* Main Workspace: Dominant Map + Right Inspection Deck */}
      <div className={`grid gap-4 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport (MapLibre completely preserved) */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[650px] rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-command-border`}>
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Araniko Corridor / Damage Sectors"
            coordinates={selectedFeature ? selectedFeature.coordinates : [27.9520, 85.9410]}
            focusedWaypoint={focusedWaypoint}
          />
        </div>

        {/* Right Inspection & Legend Deck */}
        {!isMapFocused && (
          <div className="lg:col-span-4 flex flex-col h-[650px] space-y-3">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl p-1 text-xs shrink-0 shadow-xs">
              <button
                onClick={() => setSideTab('FEATURE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'FEATURE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Inspection
              </button>
              <button
                onClick={() => setSideTab('CATALOG')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'CATALOG'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Places ({features.length})
              </button>
              <button
                onClick={() => setSideTab('LEGEND')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'LEGEND'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                Legend
              </button>
            </div>

            {/* Tab 1: Selected Feature Inspection */}
            {sideTab === 'FEATURE' && (
              <div className="flex-1 overflow-y-auto">
                {selectedFeature ? (
                  <DamageDetailsPanel
                    feature={selectedFeature}
                    onFocusFeature={handleFocusFeature}
                  />
                ) : (
                  <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-6 text-center text-xs text-slate-500 shadow-xs">
                    Select a location from the map or list to inspect details.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Feature Catalog */}
            {sideTab === 'CATALOG' && (
              <div className="flex-1 overflow-y-auto">
                <DamageFeatureList
                  features={features}
                  selectedFeatureId={selectedFeature?.id || null}
                  onSelectFeature={handleSelectFeature}
                  selectedCategory="ALL"
                />
              </div>
            )}

            {/* Tab 3: Damage Categories Legend & Summary */}
            {sideTab === 'LEGEND' && (
              <div className="flex-1 overflow-y-auto space-y-3">
                <DamageLegend />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
