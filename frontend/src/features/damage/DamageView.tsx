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
    <div className="space-y-3 font-mono">
      {/* Top Header Strip */}
      <div className="bg-command-card/90 border border-command-border rounded-lg px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-orange-950/80 border border-orange-700 text-orange-300 text-[10px] font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              GIS EVIDENCE
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-command-text">
              INFRASTRUCTURE DAMAGE & ACCESSIBILITY ASSESSMENT
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800 text-amber-300 font-bold">
            PRECOMPUTED ANALYSIS
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-command-surface border border-command-border text-command-dim">
            CONFIDENCE: Not available
          </span>
        </div>
      </div>

      {/* Main Workspace: Dominant Map (65-70%) + Right Inspection / Catalog Deck (30-35%) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[640px]`}>
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
          <div className="lg:col-span-4 flex flex-col h-[640px] space-y-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-lg p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('FEATURE')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'FEATURE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                ASSET INSPECTION
              </button>
              <button
                onClick={() => setSideTab('CATALOG')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'CATALOG'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                CATALOG ({features.length})
              </button>
              <button
                onClick={() => setSideTab('LEGEND')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'LEGEND'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                LEGEND
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
                  <div className="bg-command-card border border-command-border rounded-lg p-6 text-center text-xs text-command-dim">
                    Select a feature from the map or catalog to inspect GIS evidence.
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
