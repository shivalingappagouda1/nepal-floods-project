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
  Eye, 
  EyeOff,
  Compass,
  Tag,
  Info
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
  showLabels?: boolean;
  onToggleLabels?: () => void;
  realRasterUrls?: {
    pre: string;
    post: string;
    mask: string;
  } | null;
  isRealImagery?: boolean;
}

export const SatelliteComparisonViewer: React.FC<SatelliteComparisonViewerProps> = ({
  scenePair,
  comparisonMode,
  onChangeMode,
  showChangeOverlay,
  onToggleChangeOverlay,
  opacity: _opacity,
  onChangeOpacity: _onChangeOpacity,
  selectedBand,
  onChangeBand,
  showLabels = true,
  onToggleLabels,
  realRasterUrls,
  isRealImagery = false,
}) => {
  const [splitPos, setSplitPos] = useState(50); // 0 to 100%
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeSingleView, setActiveSingleView] = useState<'BEFORE' | 'AFTER'>('AFTER');
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [internalShowLabels, setInternalShowLabels] = useState(showLabels);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSplit(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setSplitPos(50);
  };

  const labelsVisible = onToggleLabels ? showLabels : internalShowLabels;
  const toggleLabels = onToggleLabels || (() => setInternalShowLabels((prev) => !prev));

  // Natural, accessible topographic rendering of PRE-DISASTER scene
  const renderPreSceneGraphic = () => {
    if (isRealImagery && realRasterUrls?.pre) {
      return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={realRasterUrls.pre}
            alt="Copernicus Sentinel-2 Pre-Event Scene"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <svg className="w-full h-full select-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Valley Forest Terrain Gradient */}
          <linearGradient id="preValleyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Steep Ridge Slope Gradient */}
          <linearGradient id="preSlopeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3f6212" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#1e3a1e" />
          </linearGradient>

          {/* River Water Gradient */}
          <linearGradient id="preRiverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* Base Himalayan Terrain Contours */}
        <rect width="800" height="500" fill="#14532d" />

        {/* West Valley Mountain Slopes (Left Bank) */}
        <path
          d="M0,0 L330,0 L290,170 L230,310 L190,500 L0,500 Z"
          fill="url(#preSlopeGrad)"
          opacity="0.95"
        />

        {/* Mountain Contour Texture Lines */}
        <path d="M0,80 Q140,70 270,120" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        <path d="M0,200 Q120,180 230,240" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        <path d="M0,340 Q100,320 180,380" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />

        {/* East Valley Mountain Slopes (Right Bank) */}
        <path
          d="M510,0 L800,0 L800,500 L450,500 L430,350 L470,180 Z"
          fill="url(#preSlopeGrad)"
          opacity="0.95"
        />
        <path d="M540,110 Q660,90 800,100" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        <path d="M490,260 Q620,230 800,270" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
        <path d="M470,410 Q610,380 800,430" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />

        {/* Valley Floor / Terraced Land */}
        <path
          d="M330,0 L510,0 L470,180 L430,350 L450,500 L190,500 L230,310 L290,170 Z"
          fill="#4d7c0f"
          opacity="0.85"
        />

        {/* Pre-Disaster Natural River Channel (Bhote Koshi Normal Flow) */}
        <path
          d="M390,0 Q370,120 350,220 T310,380 T290,500"
          fill="none"
          stroke="url(#preRiverGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Natural Sand/Gravel River Banks */}
        <path
          d="M390,0 Q370,120 350,220 T310,380 T290,500"
          fill="none"
          stroke="#ca8a04"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.25"
        />

        {/* Araniko Highway (NH03) Intact Road Alignment */}
        <path
          d="M425,0 Q405,120 385,220 T345,380 T325,500"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Miteri Bridge Border Checkpoint (Intact) */}
        <line x1="380" y1="45" x2="415" y2="45" stroke="#ffffff" strokeWidth="4" />
        <circle cx="398" cy="45" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />

        {/* Tatopani Village Settlement Houses (Baseline Intact) */}
        <g fill="#f8fafc" stroke="#475569" strokeWidth="1">
          <rect x="365" y="210" width="12" height="9" rx="1.5" />
          <rect x="382" y="218" width="14" height="10" rx="1.5" />
          <rect x="360" y="226" width="10" height="8" rx="1.5" />
          <rect x="390" y="235" width="12" height="9" rx="1.5" />
          <rect x="345" y="290" width="12" height="8" rx="1.5" />
          <rect x="360" y="300" width="14" height="9" rx="1.5" />
        </g>

        {/* Interactive Plain-Language Labels */}
        {labelsVisible && (
          <g className="font-sans text-[11px] font-semibold pointer-events-none">
            {/* River Label */}
            <rect x="235" y="145" width="115" height="20" rx="4" fill="rgba(255,255,255,0.92)" stroke="#93c5fd" />
            <text x="242" y="159" fill="#0369a1">💧 Bhote Koshi River</text>

            {/* Highway Label */}
            <rect x="420" y="110" width="120" height="20" rx="4" fill="rgba(255,255,255,0.92)" stroke="#fcd34d" />
            <text x="427" y="124" fill="#b45309">🛣️ Araniko Highway</text>

            {/* Village Label */}
            <rect x="405" y="215" width="105" height="20" rx="4" fill="rgba(255,255,255,0.92)" stroke="#cbd5e1" />
            <text x="412" y="229" fill="#1e293b">🏠 Tatopani Village</text>

            {/* Bridge Label */}
            <rect x="425" y="35" width="125" height="20" rx="4" fill="rgba(255,255,255,0.92)" stroke="#93c5fd" />
            <text x="432" y="49" fill="#1d4ed8">🌉 Miteri Border Bridge</text>
          </g>
        )}
      </svg>
    );
  };

  // Natural, accessible topographic rendering of POST-DISASTER scene
  const renderPostSceneGraphic = () => {
    if (isRealImagery && realRasterUrls?.post) {
      return (
        <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
          <img
            src={realRasterUrls.post}
            alt="Copernicus Sentinel-2 Post-Event Scene"
            className="w-full h-full object-cover"
          />
          {showChangeOverlay && realRasterUrls.mask && (
            <img
              src={realRasterUrls.mask}
              alt="Detected Candidate Surface Changes Overlay"
              className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 pointer-events-none"
            />
          )}
        </div>
      );
    }

    return (
      <svg className="w-full h-full select-none" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Valley Forest Terrain Gradient */}
          <linearGradient id="postValleyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* River Flood Surge Gradient (Muddy High Flow) */}
          <linearGradient id="postFloodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>

          {/* Landslide Scarp Soil Gradient */}
          <linearGradient id="postScarpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>
        </defs>

        {/* Base Himalayan Terrain Contours */}
        <rect width="800" height="500" fill="#14532d" />

        {/* West Valley Mountain Slopes (Left Bank Scoured) */}
        <path
          d="M0,0 L310,0 L270,170 L200,310 L170,500 L0,500 Z"
          fill="#166534"
          opacity="0.95"
        />

        {/* East Valley Mountain Slopes */}
        <path
          d="M530,0 L800,0 L800,500 L480,500 L460,350 L490,180 Z"
          fill="#166534"
          opacity="0.95"
        />

        {/* Valley Floor / Scoured Bank */}
        <path
          d="M310,0 L530,0 L490,180 L460,350 L480,500 L170,500 L200,310 L270,170 Z"
          fill="#3f6212"
          opacity="0.8"
        />

        {/* Prominent Landslide Scarp & Rockfall Zone (West Slope Failure) */}
        <path
          d="M250,160 Q290,190 325,250 T285,340 T215,320 Q235,230 250,160 Z"
          fill="url(#postScarpGrad)"
          stroke="#7c2d12"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Post-Disaster Widened Flood Inundation & Sediment Corridor */}
        <path
          d="M410,0 Q395,120 380,220 T350,380 T340,500 L260,500 Q280,380 310,220 T340,120 T360,0 Z"
          fill="url(#postFloodGrad)"
          opacity="0.9"
        />

        {/* Active Turbid Surge Centerline */}
        <path
          d="M390,0 Q375,120 355,220 T325,380 T305,500"
          fill="none"
          stroke="#78716c"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Severed Araniko Highway (NH03 Break Points) */}
        {/* Intact Northern Section */}
        <path
          d="M425,0 Q415,60 410,95"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Washed-Out Breach Section (Highway blocked by debris & flood) */}
        <path
          d="M410,95 Q400,160 385,220"
          fill="none"
          stroke="#dc2626"
          strokeWidth="3.5"
          strokeDasharray="4 3"
        />
        <circle cx="408" cy="115" r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />

        {/* Southern Section */}
        <path
          d="M355,275 Q345,380 325,500"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Damaged / Submerged Village Buildings */}
        <g stroke="#475569" strokeWidth="1">
          {/* Flooded / Damaged Houses */}
          <rect x="365" y="210" width="12" height="9" fill="#dc2626" rx="1.5" />
          <rect x="382" y="218" width="14" height="10" fill="#ea580c" rx="1.5" />
          <rect x="360" y="226" width="10" height="8" fill="#dc2626" rx="1.5" />
          {/* Intact Upper Houses */}
          <rect x="390" y="235" width="12" height="9" fill="#f8fafc" rx="1.5" />
          <rect x="345" y="290" width="12" height="8" fill="#ea580c" rx="1.5" />
          <rect x="360" y="300" width="14" height="9" fill="#f8fafc" rx="1.5" />
        </g>

        {/* Change Detection Overlay (Toggled) */}
        {showChangeOverlay && (
          <g>
            {/* Flooded Corridor Outline Highlight */}
            <path
              d="M410,0 Q395,120 380,220 T350,380 T340,500 L260,500 Q280,380 310,220 T340,120 T360,0 Z"
              fill="rgba(6, 182, 212, 0.25)"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />
            {/* Landslide Polygon Outline Highlight */}
            <path
              d="M250,160 Q290,190 325,250 T285,340 T215,320 Q235,230 250,160 Z"
              fill="rgba(239, 68, 68, 0.3)"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Interactive Plain-Language Labels */}
        {labelsVisible && (
          <g className="font-sans text-[11px] font-semibold pointer-events-none">
            {/* Flooded Water Label */}
            <rect x="220" y="80" width="145" height="20" rx="4" fill="rgba(255,255,255,0.95)" stroke="#06b6d4" />
            <text x="227" y="94" fill="#0891b2">🌊 Widened Flood Corridor</text>

            {/* Landslide Scar Label */}
            <rect x="140" y="235" width="145" height="20" rx="4" fill="rgba(255,255,255,0.95)" stroke="#ef4444" />
            <text x="147" y="249" fill="#b91c1c">⚠️ Hillside Landslide Scar</text>

            {/* Road Severance Label */}
            <rect x="420" y="110" width="155" height="20" rx="4" fill="rgba(255,255,255,0.95)" stroke="#dc2626" />
            <text x="427" y="124" fill="#dc2626">⛔ Road Severed (Debris)</text>

            {/* Village Inundation Label */}
            <rect x="405" y="215" width="135" height="20" rx="4" fill="rgba(255,255,255,0.95)" stroke="#ea580c" />
            <text x="412" y="229" fill="#c2410c">🏠 Damaged Structures</text>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl overflow-hidden flex flex-col font-sans shadow-md">
      {/* Top Banner: Unmistakable Prototype Imagery Notice OR Real EO Imagery Badge */}
      {isRealImagery ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/70 border-b border-emerald-200 dark:border-emerald-800/80 px-4 py-2 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">
              Genuine Earth Observation Imagery:
            </span>
            <span className="text-emerald-800 dark:text-emerald-300 hidden sm:inline">
              Copernicus Sentinel-2A L2A (ESA / Element84 AWS Open Data, Tile 45RUL).
            </span>
          </div>
          <span className="font-semibold text-[11px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
            Real Pipeline Connected
          </span>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-950/70 border-b border-amber-200 dark:border-amber-800/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold">
              Prototype imagery preview:
            </span>
            <span className="hidden sm:inline text-amber-800 dark:text-amber-300">
              Illustrative rendering based on Sentinel-1 SAR radar and Sentinel-2 optical catalog specifications.
            </span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shrink-0">
            Synthetic illustration
          </span>
        </div>
      )}

      {/* Main Controls Toolbar */}
      <div className="p-3 bg-slate-50 dark:bg-command-panel/90 border-b border-slate-200 dark:border-command-border flex flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Comparison Mode Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-command-surface p-1 rounded-xl border border-slate-200 dark:border-command-border shadow-xs">
          <button
            onClick={() => onChangeMode('SWIPE_SPLIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              comparisonMode === 'SWIPE_SPLIT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-command-muted hover:text-slate-900 dark:hover:text-command-text'
            }`}
            title="Drag slider divider to compare before and after"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Slide Divider</span>
          </button>

          <button
            onClick={() => onChangeMode('SIDE_BY_SIDE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              comparisonMode === 'SIDE_BY_SIDE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-command-muted hover:text-slate-900 dark:hover:text-command-text'
            }`}
            title="Display both images side-by-side"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => onChangeMode('OPACITY_BLEND')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              comparisonMode === 'OPACITY_BLEND'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-command-muted hover:text-slate-900 dark:hover:text-command-text'
            }`}
            title="Toggle directly between Before and After scenes"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Before / After</span>
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Change Overlay Toggle */}
          <button
            onClick={onToggleChangeOverlay}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showChangeOverlay
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-command-surface border-slate-200 dark:border-command-border text-slate-600 dark:text-command-muted hover:text-slate-900'
            }`}
            title="Toggle detected water and landslide boundaries"
          >
            {showChangeOverlay ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showChangeOverlay ? 'Detected Changes: Shown' : 'Changes: Hidden'}</span>
          </button>

          {/* Labels & Boundaries Toggle */}
          <button
            onClick={toggleLabels}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              labelsVisible
                ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-command-surface border-slate-200 dark:border-command-border text-slate-600 dark:text-command-muted hover:text-slate-900'
            }`}
            title="Show or hide place names and features on the image"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{labelsVisible ? 'Labels: On' : 'Labels: Off'}</span>
          </button>

          {/* Zoom & Reset Controls */}
          <div className="flex items-center gap-1 bg-white dark:bg-command-surface p-1 rounded-lg border border-slate-200 dark:border-command-border">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-command-panel rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-command-panel rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 hover:bg-slate-100 dark:hover:bg-command-panel rounded text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-command-border text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white dark:text-command-muted dark:hover:bg-command-surface transition-all cursor-pointer"
          >
            {showAdvanced ? 'Hide Advanced' : 'Advanced options'}
          </button>
        </div>
      </div>

      {/* Expandable Advanced Options Bar */}
      {showAdvanced && (
        <div className="p-3 bg-white dark:bg-command-surface border-b border-slate-200 dark:border-command-border text-xs space-y-2 animate-in slide-in-from-top-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-command-text">Spectral Sensor Preset:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {scenePair.preScene.bandPresets.map((band) => (
                  <button
                    key={band}
                    onClick={() => onChangeBand(band)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                      selectedBand === band
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/40 dark:border-blue-400 dark:text-blue-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-command-panel dark:border-command-border dark:text-command-muted'
                    }`}
                  >
                    {band.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-command-dim">
              Sensor: <strong className="text-slate-700 dark:text-command-text">{scenePair.preScene.sensor.replace(/_/g, ' ')}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Central Comparison Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full h-[480px] sm:h-[540px] bg-slate-900 overflow-hidden cursor-default select-none"
      >
        {/* 1. SWIPE / SPLIT MODE */}
        {comparisonMode === 'SWIPE_SPLIT' && (
          <div className="relative w-full h-full" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}>
            {/* Base Layer: Post-Event Scene (Right / Background) */}
            <div className="absolute inset-0 w-full h-full">
              {renderPostSceneGraphic()}
            </div>

            {/* Split Top Layer: Pre-Event Scene (Left clipped with clipPath) */}
            <div
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
            >
              <div className="w-full h-full">
                {renderPreSceneGraphic()}
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              onMouseDown={handleMouseDownSplit}
              className="absolute top-0 bottom-0 z-30 cursor-ew-resize group"
              style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
            >
              {/* Vertical line */}
              <div className="w-1 h-full bg-white shadow-xl relative flex items-center justify-center">
                {/* Center Grab Handle */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 text-blue-600 shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Panel Labels: Before and After */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-command-card/95 backdrop-blur-md border border-slate-200 dark:border-command-border shadow-md">
                <span className="block text-xs font-bold text-slate-800 dark:text-command-text">
                  Before the event
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-command-dim">
                  Date: {scenePair.preScene.acquisitionDate}
                </span>
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-command-card/95 backdrop-blur-md border border-slate-200 dark:border-command-border shadow-md text-right">
                <span className="block text-xs font-bold text-rose-600 dark:text-rose-400">
                  After the event
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-command-dim">
                  Date: {scenePair.postScene.acquisitionDate}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. SIDE-BY-SIDE MODE */}
        {comparisonMode === 'SIDE_BY_SIDE' && (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300">
            {/* Left Panel: Before */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-command-card/95 backdrop-blur-md border border-slate-200 shadow-md">
                <span className="block text-xs font-bold text-slate-800 dark:text-command-text">Before the event</span>
                <span className="block text-[11px] text-slate-500">Date: {scenePair.preScene.acquisitionDate}</span>
              </div>
              <div className="w-full h-full" style={{ transform: `scale(${zoomLevel})` }}>
                {renderPreSceneGraphic()}
              </div>
            </div>

            {/* Right Panel: After */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-command-card/95 backdrop-blur-md border border-slate-200 shadow-md text-right">
                <span className="block text-xs font-bold text-rose-600">After the event</span>
                <span className="block text-[11px] text-slate-500">Date: {scenePair.postScene.acquisitionDate}</span>
              </div>
              <div className="w-full h-full" style={{ transform: `scale(${zoomLevel})` }}>
                {renderPostSceneGraphic()}
              </div>
            </div>
          </div>
        )}

        {/* 3. BEFORE / AFTER TOGGLE MODE */}
        {comparisonMode === 'OPACITY_BLEND' && (
          <div className="relative w-full h-full" style={{ transform: `scale(${zoomLevel})` }}>
            {activeSingleView === 'BEFORE' ? renderPreSceneGraphic() : renderPostSceneGraphic()}

            {/* Toggle Pill at Top Center */}
            <div className="absolute top-4 inset-x-0 mx-auto w-fit z-20 flex items-center bg-white/95 dark:bg-command-card/95 p-1 rounded-xl border border-slate-200 shadow-lg">
              <button
                onClick={() => setActiveSingleView('BEFORE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSingleView === 'BEFORE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Before ({scenePair.preScene.acquisitionDate.split(' ')[0]})
              </button>
              <button
                onClick={() => setActiveSingleView('AFTER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSingleView === 'AFTER'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                After ({scenePair.postScene.acquisitionDate.split(' ')[0]})
              </button>
            </div>
          </div>
        )}

        {/* Static Bottom Legend & Scale Bar */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-white/90 dark:bg-command-card/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-command-border text-xs shadow-md">
          <span className="font-semibold text-slate-700 dark:text-command-text">Legend:</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Normal River</span>
          <span className="flex items-center gap-1 text-[11px] text-cyan-700"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Flooded Area</span>
          <span className="flex items-center gap-1 text-[11px] text-red-700"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Landslide Scar</span>
          <span className="flex items-center gap-1 text-[11px] text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Highway Road</span>
        </div>

        {/* Orientation Compass */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-white/90 dark:bg-command-card/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold shadow-md">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>North ↑</span>
        </div>
      </div>
    </div>
  );
};
