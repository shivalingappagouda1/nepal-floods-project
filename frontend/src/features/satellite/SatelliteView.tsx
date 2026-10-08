import React, { useState, useEffect } from 'react';
import type { MapLayerConfig } from '../../types';
import type { 
  ComparisonMode, 
  BandCombination, 
  AnalysisMethod, 
  ChangeDetectionResult 
} from '../../types/satellite';
import { 
  satelliteAnalysisService, 
  MOCK_SCENE_PAIRS 
} from '../../services/SatelliteAnalysisService';
import { SatelliteComparisonViewer } from './SatelliteComparisonViewer';
import { DetectionResultsPanel } from './DetectionResultsPanel';
import { 
  Satellite, 
  Play, 
  Radar, 
  Sun, 
  Eye, 
  EyeOff,
} from 'lucide-react';

interface SatelliteViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  isMapFocused?: boolean;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({
  isMapFocused = false,
}) => {
  const scenePairs = MOCK_SCENE_PAIRS;
  const [selectedPairId, setSelectedPairId] = useState<string>(MOCK_SCENE_PAIRS[0].id);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('SWIPE_SPLIT');
  const [selectedBand, setSelectedBand] = useState<BandCombination>('SAR_VV_VH');
  const [analysisMethod, setAnalysisMethod] = useState<AnalysisMethod>('SAR_BACKSCATTER_RATIO');
  const [threshold, setThreshold] = useState<number>(0.35);
  const [opacity, setOpacity] = useState<number>(0.85);
  const [showChangeOverlay, setShowChangeOverlay] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<ChangeDetectionResult | null>(null);

  const selectedPair = scenePairs.find((p) => p.id === selectedPairId) || scenePairs[0];

  useEffect(() => {
    let isMounted = true;
    const loadInitialResult = async () => {
      try {
        const result = await satelliteAnalysisService.detectChange(
          selectedPair,
          threshold,
          analysisMethod
        );
        if (isMounted) {
          setDetectionResult(result);
        }
      } catch {
        // Fallback gracefully on mock pair
      }
    };
    loadInitialResult();
    return () => {
      isMounted = false;
    };
  }, [selectedPairId, selectedPair, threshold, analysisMethod]);

  const handleSelectPair = (pairId: string) => {
    setSelectedPairId(pairId);
    const targetPair = scenePairs.find((p) => p.id === pairId) || scenePairs[0];
    setSelectedBand(targetPair.preScene.bandPresets[0]);
    setAnalysisMethod(targetPair.defaultMethod);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const result = await satelliteAnalysisService.detectChange(
        selectedPair,
        threshold,
        analysisMethod
      );
      setDetectionResult(result);
      setShowChangeOverlay(true);
    } catch {
      // Keep existing detection result on transient error
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Header Strip */}
      <div className="bg-command-card/90 border border-command-border rounded-lg px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 text-[10px] font-bold flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" />
              SATELLITE CHANGE DETECTION
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-command-text">
              SENTINEL-1 SAR & SENTINEL-2 OPTICAL COMPARISON
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

      {/* 3-Column Disaster Command Workspace: Left Controls (3 cols), Center Viewer (6 cols), Right Results (3 cols) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left Column: Scene Selector & View Controls */}
        {!isMapFocused && (
          <div className="lg:col-span-3 space-y-3 h-[640px] overflow-y-auto pr-1">
            {/* Scene Selector */}
            <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-command-border">
                <span className="text-xs font-bold text-command-text uppercase">
                  SENSOR MODALITY
                </span>
                <span className="text-[10px] text-command-dim">
                  PROTOTYPE IMAGERY
                </span>
              </div>

              <div className="space-y-2">
                {scenePairs.map((pair) => {
                  const isSar = pair.preScene.sensor === 'SENTINEL_1_SAR';
                  const isSelected = selectedPairId === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => handleSelectPair(pair.id)}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-command-surface border-command-accent text-command-text shadow-tactical-glow'
                          : 'bg-command-panel/60 border-command-border text-command-muted hover:border-command-border-light'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          {isSar ? <Radar className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-emerald-400" />}
                          <span className={isSelected ? 'text-command-accent-glow' : 'text-command-text'}>
                            {isSar ? 'Sentinel-1 SAR' : 'Sentinel-2 Optical'}
                          </span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-card border border-command-border text-command-dim">
                          {isSar ? 'C-BAND' : 'MSI'}
                        </span>
                      </div>
                      <p className="text-[10px] text-command-dim leading-tight">
                        {isSar ? 'All-weather cloud penetration • Coherence delta' : '10m Multispectral • False-color IR water mask'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick View Controls */}
            <div className="bg-command-card border border-command-border rounded-lg p-3 space-y-2.5">
              <div className="text-xs font-bold text-command-text uppercase pb-1.5 border-b border-command-border">
                COMPARISON CONTROLS
              </div>

              {/* View Mode Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setComparisonMode('SWIPE_SPLIT')}
                  className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all text-center ${
                    comparisonMode === 'SWIPE_SPLIT'
                      ? 'bg-command-accent text-white border-sky-400 shadow-sm'
                      : 'bg-command-panel border-command-border text-command-muted hover:text-command-text'
                  }`}
                >
                  SWIPE SLIDER
                </button>
                <button
                  onClick={() => setComparisonMode('SIDE_BY_SIDE')}
                  className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-all text-center ${
                    comparisonMode === 'SIDE_BY_SIDE'
                      ? 'bg-command-accent text-white border-sky-400 shadow-sm'
                      : 'bg-command-panel border-command-border text-command-muted hover:text-command-text'
                  }`}
                >
                  SIDE-BY-SIDE
                </button>
              </div>

              {/* Change Overlay Toggle */}
              <button
                onClick={() => setShowChangeOverlay(!showChangeOverlay)}
                className={`w-full px-2.5 py-1.5 rounded text-[11px] font-bold border flex items-center justify-between transition-all ${
                  showChangeOverlay
                    ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                    : 'bg-command-panel border-command-border text-command-muted'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {showChangeOverlay ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>CHANGE MASK OVERLAY</span>
                </div>
                <span className="text-[9px] font-mono">{showChangeOverlay ? 'ON' : 'OFF'}</span>
              </button>

              {/* Band / Method Preset */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-command-dim block font-bold">BAND PRESET</span>
                <select
                  value={selectedBand}
                  onChange={(e) => setSelectedBand(e.target.value as BandCombination)}
                  className="w-full bg-command-panel border border-command-border rounded p-1.5 text-xs text-command-text focus:outline-none focus:border-command-accent"
                >
                  {selectedPair.preScene.bandPresets.map((b) => (
                    <option key={b} value={b}>
                      {b.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Threshold Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-command-dim">
                  <span>SPECTRAL THRESHOLD (θ)</span>
                  <span className="font-bold text-command-accent-glow">{threshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-command-panel rounded-lg appearance-none cursor-pointer accent-command-accent"
                />
              </div>

              {/* Re-calculate Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2 rounded-lg bg-command-surface hover:bg-command-border border border-command-border text-xs font-bold text-command-accent-glow flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'PROCESSING...' : 'UPDATE THRESHOLD'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Center Column: Large Satellite Comparison Viewer */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-6'} flex flex-col h-[640px]`}>
          <SatelliteComparisonViewer
            scenePair={selectedPair}
            comparisonMode={comparisonMode}
            onChangeMode={setComparisonMode}
            showChangeOverlay={showChangeOverlay}
            onToggleChangeOverlay={() => setShowChangeOverlay(!showChangeOverlay)}
            opacity={opacity}
            onChangeOpacity={setOpacity}
            selectedBand={selectedBand}
            onChangeBand={setSelectedBand}
          />
        </div>

        {/* Right Column: Compact Change Detection & Analytics Panel */}
        {!isMapFocused && (
          <div className="lg:col-span-3 space-y-3 h-[640px] overflow-y-auto pr-1">
            {detectionResult ? (
              <DetectionResultsPanel
                result={detectionResult}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              <div className="bg-command-card border border-command-border rounded-lg p-4 text-center text-xs text-command-dim">
                Loading satellite change detection metrics...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
