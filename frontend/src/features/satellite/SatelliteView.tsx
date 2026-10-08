import React, { useState } from 'react';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Satellite, 
  Layers, 
  Sparkles, 
  Info
} from 'lucide-react';

export const SatelliteView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<'RGB' | 'MNDWI' | 'NDVI' | 'DIFF_MASK'>('MNDWI');
  const [threshold, setThreshold] = useState(0.35);

  const spectralIndices = [
    {
      id: 'RGB',
      name: 'True Color (B4-B3-B2)',
      description: 'Standard optical natural color visualization (10m GSD).',
      formula: 'Red / Green / Blue',
      status: 'VERIFIED',
    },
    {
      id: 'MNDWI',
      name: 'Modified Normalized Difference Water Index',
      description: 'Suppresses built-up land noise to accurately extract flood water bodies.',
      formula: '(Green - SWIR) / (Green + SWIR)',
      status: 'AI_COMPUTED',
    },
    {
      id: 'NDVI',
      name: 'Normalized Difference Vegetation Index',
      description: 'Highlights scoured slopes, destroyed farmland, and landslide scars.',
      formula: '(NIR - Red) / (NIR + Red)',
      status: 'AI_COMPUTED',
    },
    {
      id: 'DIFF_MASK',
      name: 'Differential Change Detection Mask',
      description: 'Calculates delta indices between pre- and post-disaster passes.',
      formula: 'ΔMNDWI > θ_flood AND ΔNDVI < θ_scarp',
      status: 'AI_COMPUTED',
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
              SATELLITE CHANGE DETECTION & SPECTRAL ANALYSIS
            </h2>
          </div>
          <p className="text-xs text-command-muted">
            Multi-temporal Sentinel-2 MSI analysis across the Bhote Koshi / Tatopani gorge corridor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DataSourceBadge 
            provenance={{
              tier: 'VERIFIED',
              source: 'ESA Copernicus Sentinel-2 L2A (Tile: T45RWQ)',
              timestamp: '2026-08-27T04:45:00Z',
              sensor: 'MSI (MultiSpectral Instrument)'
            }}
            showDetails
          />
        </div>
      </div>

      {/* Main Grid: Analysis Controls & Sensor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Spectral Indices Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-command-card border border-command-border rounded-lg p-4">
            <h3 className="text-xs font-bold text-command-text uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
              Spectral Index Selection
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
                Higher values restrict flood detection to deep turbid water channels.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sensor Passes & Spectral Viewport */}
        <div className="lg:col-span-8 space-y-3">
          {/* Dual Pass Comparison Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-command-card border border-command-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-command-text">PRE-DISASTER PASS</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  BASELINE
                </span>
              </div>
              <div className="space-y-1 text-xs text-command-muted">
                <div>Acquisition: <strong className="text-command-text">10 August 2026, 04:42 UTC</strong></div>
                <div>Cloud Cover: <strong className="text-command-text">4.2% (Clear Valley)</strong></div>
                <div>Sun Elevation: <strong className="text-command-text">64.8°</strong></div>
                <div>Sensor: <strong className="text-command-text">Sentinel-2A MSI L2A</strong></div>
              </div>
            </div>

            <div className="bg-command-card border border-rose-900/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-300">POST-DISASTER PASS</span>
                <span className="text-[10px] text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                  EVENT TRIGGERED
                </span>
              </div>
              <div className="space-y-1 text-xs text-command-muted">
                <div>Acquisition: <strong className="text-command-text">27 August 2026, 04:48 UTC</strong></div>
                <div>Cloud Cover: <strong className="text-command-text">8.1% (Corridor Clear)</strong></div>
                <div>Processing: <strong className="text-command-text">Atmospherically Corrected (BOA)</strong></div>
                <div>Sensor: <strong className="text-command-text">Sentinel-2B MSI L2A</strong></div>
              </div>
            </div>
          </div>

          {/* Raster Visualization Container Placeholder */}
          <div className="bg-command-card border border-command-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[340px] text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-command-panel border border-command-accent/40 flex items-center justify-center mb-4 text-command-accent-glow">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-command-text uppercase tracking-wider mb-1">
              Active Spectral Mode: {selectedProduct}
            </h4>
            <p className="text-xs text-command-muted max-w-md mb-4 leading-relaxed">
              Raster processing pipeline connected. MapLibre GL JS will render the tile array in Step 3 upon map initialization.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-command-panel border border-command-border text-xs text-command-dim">
              <Info className="w-3.5 h-3.5 text-command-accent-glow" />
              <span>Calculated Spatial Resolution: 10m / pixel (B2, B3, B4, B8)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
