import React, { useState, useRef } from 'react';
import type { 
  ScenePair, 
  ComparisonMode, 
  BandCombination 
} from '../../types/satellite';
import { 
  Columns2, 
  Layers, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  Crosshair, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface SatelliteComparisonViewerProps {
  scenePair: ScenePair;
  comparisonMode: ComparisonMode;
  onChangeMode: (mode: ComparisonMode) => void;
  showChangeOverlay: boolean;
  onToggleChangeOverlay: () => void;
  opacity: number;
  onChangeOpacity: (val: number) => void;
  selectedBand: BandCombination;
  onChangeBand: (band: BandCombination) => void;
}

export const SatelliteComparisonViewer: React.FC<SatelliteComparisonViewerProps> = ({
  scenePair,
  comparisonMode,
  onChangeMode,
  showChangeOverlay,
  onToggleChangeOverlay,
  opacity,
  onChangeOpacity,
  selectedBand,
  onChangeBand,
}) => {
  const [splitPos, setSplitPos] = useState(50); // 0 to 100%
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Split Slider Dragging
  const handleMouseDownSplit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSplit && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
      setSplitPos(pct);
    } else if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSplit(false);
    setIsPanning(false);
  };

  const handleStartPan = (e: React.MouseEvent) => {
    if (e.button === 0 && !isDraggingSplit) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSplitPos(50);
  };

  // High-fidelity vector graphic rendering of the pre-disaster scene
  const renderPreSceneGraphic = (band: BandCombination) => {
    const isSar = band.startsWith('SAR');
    const isMndwi = band === 'MNDWI_WATER';
    const isFalseColor = band === 'FALSE_COLOR_IR';

    const mountainColor = isSar ? '#3f3f46' : isFalseColor ? '#9f1239' : '#14532d';
    const riverColor = isSar ? '#18181b' : isMndwi ? '#38bdf8' : '#0284c7';
    const roadColor = isSar ? '#71717a' : '#fbbf24';

    return (
      <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="preMountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mountainColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
          </linearGradient>
          <filter id="preElevationShade">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2" result="light">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" />
          </filter>
        </defs>

        {/* Base Himalayan Terrain Contour */}
        <rect width="800" height="500" fill="#06090e" />
        
        {/* Mountain Ridgelines (Left Gorge Bank) */}
        <path
          d="M0,0 L320,0 L280,180 L220,320 L180,500 L0,500 Z"
          fill="url(#preMountainGrad)"
          filter="url(#preElevationShade)"
          opacity="0.9"
        />

        {/* Mountain Ridgelines (Right Gorge Bank) */}
        <path
          d="M520,0 L800,0 L800,500 L460,500 L440,360 L480,190 Z"
          fill="url(#preMountainGrad)"
          filter="url(#preElevationShade)"
          opacity="0.9"
        />

        {/* Pre-Disaster Narrow River Channel (Bhote Koshi Baseline Flow) */}
        <path
          d="M390,0 Q370,120 350,220 T310,380 T290,500"
          fill="none"
          stroke={riverColor}
          strokeWidth={isMndwi ? "14" : "10"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Araniko Highway (NH03) Intact Road Alignment */}
        <path
          d="M420,0 Q400,120 380,220 T340,380 T320,500"
          fill="none"
          stroke={roadColor}
          strokeWidth="2.5"
          strokeDasharray={isSar ? "4 2" : "none"}
          opacity="0.85"
        />

        {/* Tatopani Settlement Baseline Footprints */}
        <rect x="360" y="210" width="12" height="8" fill={isFalseColor ? "#cbd5e1" : "#94a3b8"} rx="1" />
        <rect x="375" y="215" width="14" height="10" fill={isFalseColor ? "#cbd5e1" : "#94a3b8"} rx="1" />
        <rect x="355" y="228" width="10" height="7" fill={isFalseColor ? "#cbd5e1" : "#94a3b8"} rx="1" />

        {/* Miteri Bridge Border Checkpoint */}
        <line x1="382" y1="40" x2="408" y2="40" stroke="#f8fafc" strokeWidth="3" />
        <circle cx="395" cy="40" r="3" fill="#38bdf8" />
      </svg>
    );
  };

  // High-fidelity vector graphic rendering of the post-disaster scene
  const renderPostSceneGraphic = (band: BandCombination) => {
    const isSar = band.startsWith('SAR');
    const isMndwi = band === 'MNDWI_WATER';
    const isFalseColor = band === 'FALSE_COLOR_IR';

    const mountainColor = isSar ? '#3f3f46' : isFalseColor ? '#881337' : '#154024';
    const floodColor = isSar ? '#09090b' : isMndwi ? '#0284c7' : '#0369a1';
    const sedimentPlumeColor = isSar ? '#27272a' : isMndwi ? '#38bdf8' : '#78716c';
    const scarpColor = isSar ? '#52525b' : isFalseColor ? '#4c0519' : '#c2410c';

    return (
      <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="postMountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={mountainColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#05080e" stopOpacity="0.95" />
          </linearGradient>
          <filter id="postElevationShade">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2" result="light">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" />
          </filter>
        </defs>

        {/* Base Himalayan Terrain */}
        <rect width="800" height="500" fill="#04060a" />

        {/* Mountain Ridgelines (Left Bank Scoured) */}
        <path
          d="M0,0 L300,0 L260,180 L190,320 L160,500 L0,500 Z"
          fill="url(#postMountainGrad)"
          filter="url(#postElevationShade)"
          opacity="0.9"
        />

        {/* Mountain Ridgelines (Right Bank Scoured) */}
        <path
          d="M540,0 L800,0 L800,500 L490,500 L470,360 L500,190 Z"
          fill="url(#postMountainGrad)"
          filter="url(#postElevationShade)"
          opacity="0.9"
        />

        {/* Landslide Scarp & Debris Scarring Zone (Gorge Slope Failure) */}
        <path
          d="M260,170 Q300,200 330,260 T290,350 T220,330 Q240,240 260,170 Z"
          fill={scarpColor}
          opacity="0.75"
        />
        <path
          d="M480,180 Q450,220 420,290 T470,360 Q500,270 480,180 Z"
          fill={scarpColor}
          opacity="0.7"
        />

        {/* Post-Disaster Widened Flood Inundation & Debris Surge Corridor */}
        <path
          d="M410,0 Q395,120 380,220 T350,380 T340,500 L260,500 Q280,380 310,220 T340,120 T360,0 Z"
          fill={floodColor}
          opacity={isSar ? "0.95" : "0.85"}
        />

        {/* Turbid Sediment Plumes / Surge Core */}
        <path
          d="M390,0 Q375,120 355,220 T325,380 T305,500"
          fill="none"
          stroke={sedimentPlumeColor}
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Severed Araniko Highway (NH03 Bridge & Road Breach Points) */}
        {/* Intact Upper Segment */}
        <path
          d="M420,0 Q410,60 405,100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
        />
        {/* Severed Breach Gap (Debris Washed Out) */}
        <circle cx="402" cy="120" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
        {/* Lower Road Segment */}
        <path
          d="M355,280 Q340,380 320,500"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />

        {/* Tatopani Submerged / Damaged Footprints */}
        <rect x="360" y="210" width="12" height="8" fill="#ef4444" rx="1" opacity="0.8" />
        <rect x="375" y="215" width="14" height="10" fill="#f97316" rx="1" opacity="0.9" />

        {/* Detected Change Highlight Overlay (Optional Layer) */}
        {showChangeOverlay && (
          <g className="animate-pulse">
            {/* Flood Inundation Polygon Outline */}
            <path
              d="M410,0 Q395,120 380,220 T350,380 T340,500 L260,500 Q280,380 310,220 T340,120 T360,0 Z"
              fill="rgba(56, 189, 248, 0.4)"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />
            {/* Scarp Failure Outline */}
            <path
              d="M260,170 Q300,200 330,260 T290,350 T220,330 Q240,240 260,170 Z"
              fill="rgba(239, 68, 68, 0.4)"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-command-bg border border-command-border rounded-lg overflow-hidden flex flex-col font-mono shadow-2xl relative">
      {/* Top Interactive Toolbar */}
      <div className="p-3 bg-command-panel/90 border-b border-command-border flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-command-surface/80 p-1 rounded-lg border border-command-border">
          <button
            onClick={() => onChangeMode('SWIPE_SPLIT')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              comparisonMode === 'SWIPE_SPLIT'
                ? 'bg-command-accent text-white shadow-tactical-glow'
                : 'text-command-muted hover:text-command-text'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SWIPE / SPLIT</span>
          </button>

          <button
            onClick={() => onChangeMode('SIDE_BY_SIDE')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              comparisonMode === 'SIDE_BY_SIDE'
                ? 'bg-command-accent text-white shadow-tactical-glow'
                : 'text-command-muted hover:text-command-text'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>SIDE-BY-SIDE</span>
          </button>

          <button
            onClick={() => onChangeMode('OPACITY_BLEND')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
              comparisonMode === 'OPACITY_BLEND'
                ? 'bg-command-accent text-white shadow-tactical-glow'
                : 'text-command-muted hover:text-command-text'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>OPACITY BLEND</span>
          </button>
        </div>

        {/* Center: Band Preset Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-command-dim">SPECTRAL BAND:</span>
          {scenePair.preScene.bandPresets.map((band) => (
            <button
              key={band}
              onClick={() => onChangeBand(band)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors whitespace-nowrap ${
                selectedBand === band
                  ? 'bg-command-surface text-command-accent-glow border-command-accent'
                  : 'bg-command-panel/60 text-command-muted border-command-border hover:text-command-text'
              }`}
            >
              {band.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Right: Zoom & Overlay Controls */}
        <div className="flex items-center gap-2">
          {/* Change Overlay Toggle */}
          <button
            onClick={onToggleChangeOverlay}
            className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1.5 transition-colors ${
              showChangeOverlay
                ? 'bg-rose-950/80 text-rose-300 border-rose-700 shadow-tactical-glow'
                : 'bg-command-panel/80 text-command-muted border-command-border hover:text-command-text'
            }`}
            title="Toggle detected change vector overlay mask"
          >
            {showChangeOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>CHANGE MASK</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-command-surface rounded-lg border border-command-border">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-command-muted hover:text-command-text border-r border-command-border"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1.5 text-command-muted hover:text-command-text border-r border-command-border"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 text-command-muted hover:text-command-text"
              title="Reset Viewport"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Opacity Slider Control (Visible in OPACITY_BLEND mode) */}
      {comparisonMode === 'OPACITY_BLEND' && (
        <div className="bg-command-panel/80 px-4 py-2 border-b border-command-border flex items-center gap-3 text-xs">
          <span className="text-command-muted text-[11px]">POST-DISASTER OVERLAY OPACITY:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity * 100}
            onChange={(e) => onChangeOpacity(Number(e.target.value) / 100)}
            className="flex-1 h-1.5 bg-command-surface rounded-lg appearance-none cursor-pointer accent-command-accent"
          />
          <span className="font-bold text-command-accent-glow w-10 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

      {/* Main Imagery Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleStartPan}
        className="relative w-full h-[520px] bg-[#03060a] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        {/* Transforming Layer Container for Pan/Zoom */}
        <div
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* MODE 1: SWIPE / SPLIT COMPARISON */}
          {comparisonMode === 'SWIPE_SPLIT' && (
            <div className="relative w-full h-full">
              {/* Bottom Layer: Pre-Disaster */}
              <div className="absolute inset-0">
                {renderPreSceneGraphic(selectedBand)}
              </div>

              {/* Top Layer: Post-Disaster (Clipped by splitPos) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `polygon(${splitPos}% 0%, 100% 0%, 100% 100%, ${splitPos}% 100%)`,
                }}
              >
                {renderPostSceneGraphic(selectedBand)}
              </div>

              {/* Interactive Draggable Split Divider Line */}
              <div
                onMouseDown={handleMouseDownSplit}
                className="absolute top-0 bottom-0 w-1 bg-command-accent-glow cursor-ew-resize z-30 shadow-[0_0_12px_rgba(56,189,248,0.8)]"
                style={{ left: `${splitPos}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-command-panel border-2 border-command-accent-glow shadow-2xl flex items-center justify-center text-command-accent-glow">
                  <Move className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: SIDE-BY-SIDE COMPARISON */}
          {comparisonMode === 'SIDE_BY_SIDE' && (
            <div className="grid grid-cols-2 w-full h-full divide-x divide-command-border">
              {/* Left: Pre-Disaster */}
              <div className="relative w-full h-full bg-[#05080e]">
                {renderPreSceneGraphic(selectedBand)}
                <div className="absolute top-3 left-3 bg-command-panel/90 border border-command-border px-2.5 py-1 rounded text-[10px] font-bold text-emerald-400">
                  PRE-DISASTER ({scenePair.preScene.platform})
                </div>
              </div>

              {/* Right: Post-Disaster */}
              <div className="relative w-full h-full bg-[#05080e]">
                {renderPostSceneGraphic(selectedBand)}
                <div className="absolute top-3 left-3 bg-command-panel/90 border border-command-border px-2.5 py-1 rounded text-[10px] font-bold text-rose-400">
                  POST-DISASTER ({scenePair.postScene.platform})
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: OPACITY BLEND OVERLAY */}
          {comparisonMode === 'OPACITY_BLEND' && (
            <div className="relative w-full h-full">
              {/* Base Layer: Pre-Disaster */}
              <div className="absolute inset-0">
                {renderPreSceneGraphic(selectedBand)}
              </div>
              {/* Blended Layer: Post-Disaster */}
              <div
                className="absolute inset-0 transition-opacity"
                style={{ opacity }}
              >
                {renderPostSceneGraphic(selectedBand)}
              </div>
            </div>
          )}
        </div>

        {/* HUD Coordinate & Target Crosshair */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-command-panel/90 backdrop-blur-md border border-command-border px-3 py-1.5 rounded text-[10px] text-command-muted flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-command-accent-glow font-bold">
            <Crosshair className="w-3 h-3 animate-pulse" />
            <span>27.9575° N, 85.9461° E</span>
          </div>
          <span className="text-command-dim">|</span>
          <span>AOI: {scenePair.aoiRegion}</span>
          <span className="text-command-dim">|</span>
          <span className="text-emerald-400 font-bold">GSD: 10m/px</span>
        </div>

        {/* Pre vs Post Date Banner Badges */}
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex items-center justify-between">
          <div className="pointer-events-auto bg-command-panel/90 backdrop-blur-md border border-command-border px-3 py-1 rounded text-[10px]">
            <span className="text-command-dim">PRE-PASS: </span>
            <strong className="text-command-text">{scenePair.preScene.acquisitionDate.replace('T', ' ').replace('Z', ' UTC')}</strong>
            <span className="ml-1 text-[9px] text-emerald-400">({scenePair.preScene.platform})</span>
          </div>

          <div className="pointer-events-auto bg-command-panel/90 backdrop-blur-md border border-command-border px-3 py-1 rounded text-[10px]">
            <span className="text-command-dim">POST-PASS: </span>
            <strong className="text-rose-400">{scenePair.postScene.acquisitionDate.replace('T', ' ').replace('Z', ' UTC')}</strong>
            <span className="ml-1 text-[9px] text-rose-300">({scenePair.postScene.platform})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
