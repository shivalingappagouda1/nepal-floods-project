import React, { useState } from 'react';
import type { MapLayerConfig } from '../../types';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { 
  Satellite, 
  Layers
} from 'lucide-react';

interface SatelliteViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<'RGB' | 'MNDWI' | 'NDVI' | 'DIFF_MASK'>('MNDWI');
  const [threshold, setThreshold] = useState(0.35);

  const spectralIndices = [
    {
      id: 'RGB',
      name: 'True Color (B4-B3-B2) [DEMO / Prototype]',
      description: 'Standard optical natural color visualization format (Step 5 Ingestion).',
      formula: 'Red / Green / Blue',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'MNDWI',
      name: 'Modified Normalized Difference Water Index (MNDWI)',
      description: 'Algorithm configured for Step 5 differential water body extraction.',
      formula: '(Green - SWIR) / (Green + SWIR)',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'NDVI',
      name: 'Normalized Difference Vegetation Index (NDVI)',
      description: 'Algorithm configured for Step 5 scarp & vegetation loss detection.',
      formula: '(NIR - Red) / (NIR + Red)',
      status: 'DEMO_VALUE' as const,
    },
    {
      id: 'DIFF_MASK',
      name: 'Differential Change Detection Mask (Pipeline Preset)',
      description: 'Computes delta indices between pre- and post-disaster passes in Step 5.',
      formula: 'ΔMNDWI > θ_flood AND ΔNDVI < θ_scarp',
      status: 'DEMO_VALUE' as const,
    },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Top Header Card */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Satellite className="w-4 h-4 text-command-accent-glow" />
            <h2 className="text-sm font-bold text-command-text uppercase tracking-wider">
              SATELLITE CHANGE DETECTION INTERFACE (STEP 3 FOUNDATION)
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Map viewport and spectral controls prepared. Live multi-spectral Sentinel-2 ingestion will connect in Step 5.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge 
            provenance={{
              tier: 'DEMO_VALUE',
              source: 'Visual Basemap Prototype (Awaiting Step 5 Real Data)',
              timestamp: '2026-08-27T00:00:00Z',
              sensor: 'Prototype Tile Layer'
            }}
            showDetails
          />
        </div>
      </div>

      {/* Main Grid: Controls + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Spectral Indices Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-command-card border border-command-border rounded-lg p-4">
            <h3 className="text-xs font-bold text-command-text uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
              Spectral Index Controls (Step 5 Preset)
            </h3>

            <div className="space-y-2">
              {spectralIndices.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedProduct(item.id as any)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedProduct === item.id
                      ? 'bg-command-accent/20 border-command-accent text-command-text shadow-tactical-glow'
                      : 'bg-command-panel/60 border-command-border text-command-muted hover:border-command-border-light'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs">{item.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-[10px] text-command-dim mb-1.5 leading-snug">
                    {item.description}
                  </p>
                  <div className="text-[9px] text-command-muted bg-command-surface/80 px-2 py-0.5 rounded border border-command-border/40 inline-block">
                    {item.formula}
                  </div>
                </button>
              ))}
            </div>

            {/* Threshold Slider for Change Detection */}
            <div className="mt-4 pt-3 border-t border-command-border">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-command-muted">Index Threshold (θ):</span>
                <span className="text-command-accent-glow font-bold">{threshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-command-surface rounded-lg appearance-none cursor-pointer accent-command-accent"
              />
              <span className="text-[9px] text-command-dim block mt-1">
                Threshold parameter ready for Step 5 spectral calculations.
              </span>
            </div>
          </div>

          {/* Pass Information */}
          <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2">
            <div className="text-xs font-bold text-command-text">SATELLITE INGEST STATUS</div>
            <div className="text-[11px] text-command-muted space-y-1">
              <div>Status: <strong className="text-amber-300">Awaiting Step 5 Real Data</strong></div>
              <div>Current Map: <strong className="text-command-text">MapLibre GL Basemap (DEMO)</strong></div>
            </div>
          </div>
        </div>

        {/* Right: Full Interactive Map */}
        <div className="lg:col-span-8 h-[600px]">
          <InteractiveMap
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Map initial viewport — DEMO / navigation reference"
            heightClass="h-[600px]"
          />
        </div>
      </div>
    </div>
  );
};
