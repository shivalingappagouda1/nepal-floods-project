import React, { useState } from 'react';
import { 
  Radar, 
  Sun, 
  AlertTriangle, 
  Info, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const SensorModalitiesExplainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-4 font-mono shadow-xl relative">
      {/* Header Toggle */}
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-command-accent-glow" />
          <h3 className="text-xs font-bold text-command-text uppercase tracking-wider">
            Satellite Sensor Physics & Operational Limitations
          </h3>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-muted">
            SCIENTIFIC STANDARD
          </span>
        </div>

        <button 
          className="text-command-dim hover:text-command-text p-1"
          aria-label="Toggle sensor explanation"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-command-border/70 space-y-3 text-xs">
          {/* 2-Column Sensor Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Sentinel-1 SAR Radar */}
            <div className="p-3 rounded bg-sky-950/20 border border-sky-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sky-300 font-bold">
                  <Radar className="w-4 h-4 text-sky-400" />
                  <span>Sentinel-1 SAR (C-Band Active Radar)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  ALL-WEATHER
                </span>
              </div>
              <ul className="space-y-1 text-[10px] text-sky-100/80 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold">✓</span>
                  <span><strong>Cloud Penetration:</strong> 5.405 GHz microwave signals pass directly through monsoon cloud decks, fog, smoke, and nighttime darkness.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-sky-400 font-bold">✓</span>
                  <span><strong>Water Signature:</strong> Standing flood waters act as specular reflectors, scattering radar pulses away and appearing as distinct dark/low-backscatter regions (Δσ₀ &lt; -4 dB).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">!</span>
                  <span><strong>Terrain Layover:</strong> Extreme Himalayan gorge topography can cause radar shadow and geometric distortion in narrow canyon slopes.</span>
                </li>
              </ul>
            </div>

            {/* Sentinel-2 / Landsat Optical */}
            <div className="p-3 rounded bg-amber-950/20 border border-amber-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Sentinel-2 MSI (Multi-Spectral Optical)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  DAYLIGHT / CLEAR SKY
                </span>
              </div>
              <ul className="space-y-1 text-[10px] text-amber-100/80 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Cloud Limitation:</strong> <strong className="text-rose-300">DO NOT claim that optical imagery works through clouds.</strong> Monsoon cloud cover obstructs optical sensors; clear-sky passes are required.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Spectral Indexing:</strong> High spatial resolution (10m) multi-spectral bands enable precise MNDWI (Water) and NDVI (Vegetation scarp) differentiation.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">!</span>
                  <span><strong>Sediment Sensitivity:</strong> High sediment-laden flood waters alter spectral reflectance, requiring SWIR band indexing (B11/B12).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Critical Operational Disclaimers */}
          <div className="p-2.5 rounded bg-command-panel border border-command-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-command-muted">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>STRUCTURAL INTEGRITY NOTICE:</span>
            </div>
            <p className="flex-1 leading-snug">
              Satellite imagery provides macro surface change & inundation boundaries. It does <strong>NOT</strong> prove building structural safety, foundation stability, or underground cavern integrity. On-site structural engineering verification is mandatory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
