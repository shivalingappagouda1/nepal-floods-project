import React, { useState } from 'react';
import type { MapLayerConfig } from '../../types';
import { SeverityLegend } from './SeverityLegend';
import { 
  Layers, 
  Compass, 
  Eye, 
  EyeOff, 
  Split, 
  Crosshair, 
  Sliders
} from 'lucide-react';

interface MapPanelProps {
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  activeAoiName: string;
  coordinates: [number, number];
}

export const MapPanel: React.FC<MapPanelProps> = ({
  layers,
  onToggleLayer,
  onOpacityChange,
  activeAoiName,
  coordinates,
}) => {
  const [showLayerDrawer, setShowLayerDrawer] = useState(true);
  const [showLegend] = useState(true);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [splitPosition] = useState(50); // 0 to 100 percentage

  return (
    <div className="relative w-full h-full min-h-[500px] bg-command-bg rounded-lg border border-command-border overflow-hidden flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* AOI Coordinate Telemetry */}
        <div className="pointer-events-auto bg-command-panel/90 backdrop-blur-md border border-command-border px-3 py-1.5 rounded-lg flex items-center gap-3 text-xs font-mono shadow-lg">
          <div className="flex items-center gap-1.5 text-command-accent-glow">
            <Crosshair className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">{activeAoiName}</span>
          </div>
          <span className="text-command-dim">|</span>
          <span className="text-command-muted">
            {coordinates[0].toFixed(4)}° N, {coordinates[1].toFixed(4)}° E
          </span>
          <span className="text-command-dim">|</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded font-bold">
            EPSG:32645 (UTM 45N)
          </span>
        </div>

        {/* Tactical Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setIsSplitMode(!isSplitMode)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all backdrop-blur-md ${
              isSplitMode
                ? 'bg-command-accent text-white border-command-accent-glow shadow-tactical-glow'
                : 'bg-command-panel/90 text-command-muted border-command-border hover:text-white'
            }`}
            title="Toggle Pre- vs Post-Disaster Satellite Swipe Mode"
          >
            <Split className="w-3.5 h-3.5" />
            <span>SWIPE COMPARISON</span>
          </button>

          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-1.5 transition-all backdrop-blur-md ${
              showLayerDrawer
                ? 'bg-command-surface text-command-accent-glow border-command-accent/50'
                : 'bg-command-panel/90 text-command-muted border-command-border hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>LAYERS ({layers.filter((l) => l.enabled).length})</span>
          </button>
        </div>
      </div>

      {/* Main Map Visualization Canvas / WebGL Simulation Container */}
      <div className="relative flex-1 w-full h-full bg-[#070b12] flex items-center justify-center overflow-hidden">
        {/* Subtle Himalayan Topographic Contour Grid Simulation */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
              linear-gradient(to right, #1f2d47 1px, transparent 1px),
              linear-gradient(to bottom, #1f2d47 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px'
          }}
        />

        {/* Center Target Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border border-command-border/40 rounded-full border-dashed animate-spin-slow opacity-30" />
          <div className="w-32 h-32 border border-command-accent/30 rounded-full opacity-40" />
          <div className="w-2 h-2 bg-tactical-cyan rounded-full animate-ping" />
        </div>

        {/* Split View Divider (when enabled) */}
        {isSplitMode && (
          <div 
            className="absolute inset-y-0 z-10 w-1 bg-command-accent-glow shadow-tactical-glow cursor-ew-resize flex items-center justify-center"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-command-panel border border-command-accent-glow flex items-center justify-center shadow-lg">
              <Split className="w-3.5 h-3.5 text-command-accent-glow" />
            </div>
            {/* Labels */}
            <div className="absolute top-16 -left-32 px-2 py-1 rounded bg-command-panel/90 border border-command-border text-[10px] font-mono text-command-muted whitespace-nowrap">
              PRE-DISASTER (AUG 10, 2026)
            </div>
            <div className="absolute top-16 left-4 px-2 py-1 rounded bg-command-panel/90 border border-rose-900/80 text-[10px] font-mono text-rose-300 whitespace-nowrap">
              POST-DISASTER (AUG 27, 2026)
            </div>
          </div>
        )}

        {/* Center Tactical Viewport Label & Status */}
        <div className="z-0 text-center max-w-md p-6 bg-command-panel/80 backdrop-blur-sm border border-command-border rounded-xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-command-surface border border-command-border text-command-accent-glow font-mono text-[11px] mb-3">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            <span>MAPLIBRE GL JS ENGINE CONTAINER</span>
          </div>
          <h3 className="font-mono text-sm font-bold text-command-text uppercase tracking-wider mb-1">
            Bhote Koshi / Tatopani Transboundary Corridor
          </h3>
          <p className="text-xs font-mono text-command-muted leading-relaxed">
            Geospatial viewport ready. Basemap layers, Sentinel-2 spectral indices, and OpenStreetMap baseline vectors configured for step-wise data binding.
          </p>
          <div className="mt-4 pt-3 border-t border-command-border/60 flex items-center justify-center gap-4 text-[10px] font-mono text-command-dim">
            <span>ZOOM: 13.5</span>
            <span>BEARING: 0.0°</span>
            <span>PITCH: 45.0° (3D TERRAIN)</span>
          </div>
        </div>

        {/* Bottom Left Severity Legend */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm">
            <SeverityLegend />
          </div>
        )}

        {/* Right Layer Control Drawer */}
        {showLayerDrawer && (
          <div className="absolute top-14 right-3 bottom-4 z-20 w-80 bg-command-panel/95 backdrop-blur-md border border-command-border rounded-lg p-3 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-command-border/80">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-command-accent-glow" />
                <h4 className="font-mono text-xs font-bold text-command-text uppercase tracking-wider">
                  TACTICAL MAP LAYERS
                </h4>
              </div>
              <span className="text-[10px] font-mono text-command-dim">
                8 LAYERS
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {layers.map((layer) => {
                return (
                  <div
                    key={layer.id}
                    className={`p-2.5 rounded border transition-all ${
                      layer.enabled
                        ? 'bg-command-surface/70 border-command-accent/40'
                        : 'bg-command-card/40 border-command-border/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <button
                        onClick={() => onToggleLayer(layer.id)}
                        className="flex items-center gap-2 text-left font-mono text-xs font-semibold text-command-text hover:text-command-accent-glow"
                      >
                        {layer.enabled ? (
                          <Eye className="w-3.5 h-3.5 text-command-accent-glow" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-command-dim" />
                        )}
                        <span>{layer.label}</span>
                      </button>

                      {/* Explicit Badge for Availability / Data Tier */}
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase font-bold ${
                          layer.badge === 'VERIFIED'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : layer.badge === 'AI_COMPUTED'
                            ? 'bg-sky-950 text-sky-400 border-sky-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}
                      >
                        {layer.badge === 'DEMO_VALUE' ? 'DEMO' : layer.badge}
                      </span>
                    </div>

                    <p className="text-[10px] text-command-dim font-mono leading-tight mb-2">
                      {layer.description}
                    </p>

                    {/* Opacity Slider */}
                    {layer.enabled && (
                      <div className="flex items-center gap-2 pt-1 border-t border-command-border/40">
                        <span className="text-[9px] font-mono text-command-dim">OPACITY:</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={layer.opacity * 100}
                          onChange={(e) => onOpacityChange(layer.id, Number(e.target.value) / 100)}
                          className="w-full h-1 bg-command-border rounded-lg appearance-none cursor-pointer accent-command-accent"
                        />
                        <span className="text-[9px] font-mono text-command-muted w-6 text-right">
                          {Math.round(layer.opacity * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 mt-2 border-t border-command-border text-[9px] font-mono text-command-dim text-center">
              * Placeholders clearly tagged. Real GIS bindings in Step 3.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
