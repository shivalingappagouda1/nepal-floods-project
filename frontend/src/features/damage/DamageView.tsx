import React, { useState, useEffect } from 'react';
import type { MapLayerConfig } from '../../types';
import type { 
  DamageFeature, 
  DamageCategory, 
  DamageSummaryStats 
} from '../../types/damage';
import { 
  damageAssessmentService, 
  MOCK_DAMAGE_FEATURES 
} from '../../services/DamageAssessmentService';
import { DamageSummary } from './DamageSummary';
import { DamageLegend } from './DamageLegend';
import { DamageDetailsPanel } from './DamageDetailsPanel';
import { DamageFeatureList } from './DamageFeatureList';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Building2, 
  CheckCircle2 
} from 'lucide-react';

interface DamageViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const DamageView: React.FC<DamageViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
}) => {
  const features: DamageFeature[] = MOCK_DAMAGE_FEATURES;
  const [selectedCategory, setSelectedCategory] = useState<DamageCategory | 'ALL'>('ALL');
  const [selectedFeature, setSelectedFeature] = useState<DamageFeature | null>(MOCK_DAMAGE_FEATURES[0]);
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [summaryStats, setSummaryStats] = useState<DamageSummaryStats | null>(null);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  // Load summary stats on mount
  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      const stats = await damageAssessmentService.getDamageSummary();
      if (isMounted) {
        setSummaryStats(stats);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectFeature = (feature: DamageFeature) => {
    setSelectedFeature(feature);
    setFocusedWaypoint(feature.coordinates);
  };

  const handleFocusFeature = (coords: [number, number]) => {
    setFocusedWaypoint(coords);
  };

  const handleAssignFieldInspection = (featureId: string) => {
    setDispatchNotice(`Asset ${featureId} queued for emergency on-site ground inspection.`);
    setTimeout(() => {
      setDispatchNotice(null);
    }, 4000);
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-orange-950/80 border border-orange-700 text-orange-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              IMAGE & GIS DAMAGE EVIDENCE
            </span>
            <h2 className="text-sm font-bold text-command-text font-mono uppercase tracking-wider">
              INFRASTRUCTURE DAMAGE & ACCESSIBILITY ASSESSMENT
            </h2>
          </div>
          <p className="text-xs text-command-muted font-mono max-w-2xl">
            Multi-sensor optical/SAR spatial analysis isolating severed road arteries, bridge approach scour, and flooded settlements along the Bhote Koshi corridor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge
            provenance={{
              tier: 'AI_COMPUTED',
              source: 'Sentinel-2 MSI Tile T45RWQ + Sentinel-1A SAR Pipeline',
              timestamp: '2026-08-28T05:14:01Z',
              algorithm: 'Differential MNDWI & Coherence Delta',
              confidence: 0.91,
            }}
            showDetails
          />
        </div>
      </div>

      {/* Dispatch Notification Alert */}
      {dispatchNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs flex items-center justify-between shadow-tactical-glow animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{dispatchNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">EOC QUEUE UPDATED</span>
        </div>
      )}

      {/* Damage Summary Statistics Cards */}
      {summaryStats && (
        <DamageSummary
          stats={summaryStats}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Standardized 5-Level Damage Evidence Legend */}
      <DamageLegend />

      {/* Main Grid: Catalog List (Left 4 cols) + Map & Details (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Evaluated Assets List */}
        <div className="lg:col-span-4 h-[640px]">
          <DamageFeatureList
            features={features}
            selectedFeatureId={selectedFeature ? selectedFeature.id : null}
            onSelectFeature={handleSelectFeature}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Right Column: Interactive Map Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="h-[400px] w-full rounded-lg overflow-hidden border border-command-border">
            <InteractiveMap
              layers={layers}
              onToggleLayer={onToggleLayer}
              onOpacityChange={onOpacityChange}
              activeAoiName="Bhote Koshi Transboundary Damage Assessment AOI"
              coordinates={[27.9520, 85.9410]}
              heightClass="h-[400px]"
              focusedWaypoint={focusedWaypoint}
            />
          </div>

          {/* Detailed Feature Inspector */}
          {selectedFeature && (
            <DamageDetailsPanel
              feature={selectedFeature}
              onFocusFeature={handleFocusFeature}
              onAssignFieldInspection={handleAssignFieldInspection}
            />
          )}
        </div>
      </div>
    </div>
  );
};
