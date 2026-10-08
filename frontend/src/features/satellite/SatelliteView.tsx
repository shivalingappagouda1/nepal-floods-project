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
import { SensorModalitiesExplainer } from './SensorModalitiesExplainer';
import { ErrorState } from '../../components/common/ErrorState';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Satellite, 
  Sliders, 
  Play, 
  Radar, 
  Sun, 
  Layers 
} from 'lucide-react';

interface SatelliteViewProps {
  layers: MapLayerConfig[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
}

export const SatelliteView: React.FC<SatelliteViewProps> = () => {
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPair = scenePairs.find((p) => p.id === selectedPairId) || scenePairs[0];

  // Initial load of detection result
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
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to initialize satellite scene.');
        }
      }
    };
    loadInitialResult();
    return () => {
      isMounted = false;
    };
  }, [selectedPairId, selectedPair, threshold, analysisMethod]);

  // Update selected band when scene pair changes
  const handleSelectPair = (pairId: string) => {
    setSelectedPairId(pairId);
    const targetPair = scenePairs.find((p) => p.id === pairId) || scenePairs[0];
    setSelectedBand(targetPair.preScene.bandPresets[0]);
    setAnalysisMethod(targetPair.defaultMethod);
  };

  // Run change detection calculation (Precomputed Analysis trigger)
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const result = await satelliteAnalysisService.detectChange(
        selectedPair,
        threshold,
        analysisMethod
      );
      setDetectionResult(result);
      setShowChangeOverlay(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing satellite change detection pipeline.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Incident & Satellite Header */}
      <div className="bg-command-card border border-command-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-700 text-sky-300 font-mono text-[10px] font-bold flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" />
              SATELLITE INTELLIGENCE
            </span>
            <h2 className="text-sm font-bold text-command-text font-mono">
              EARTH OBSERVATION & MULTI-TEMPORAL CHANGE DETECTION
            </h2>
          </div>
          <p className="text-xs text-command-muted font-mono max-w-2xl">
            Multi-sensor before/after analysis for the 26 August 2026 transboundary surge corridor. Supports Sentinel-1 SAR, Sentinel-2 Optical MSI, and Landsat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DataSourceBadge provenance={selectedPair.postScene.provenance} showDetails />
        </div>
      </div>

      {/* Sensor Modal Explanation Panel (Sentinel-1 vs Sentinel-2 Physics) */}
      <SensorModalitiesExplainer />

      {/* Main Analysis Workflow: Controls (Left 4 cols) + Imagery Viewport & Results (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Scene Selector & Pipeline Configuration */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Scene Catalog Selector */}
          <div className="bg-command-card border border-command-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-command-border">
              <h3 className="text-xs font-bold text-command-text uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
                <span>1. SATELLITE SCENE PAIR</span>
              </h3>
              <span className="text-[10px] text-command-dim">
                {scenePairs.length} DATASETS
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
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-command-surface border-command-accent text-command-text shadow-tactical-glow'
                        : 'bg-command-panel/60 border-command-border text-command-muted hover:border-command-border-light hover:text-command-text'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {isSar ? (
                          <Radar className="w-3.5 h-3.5 text-sky-400" />
                        ) : (
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{pair.name}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-command-dim mb-2 leading-relaxed">
                      {pair.description}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-command-muted pt-1.5 border-t border-command-border/40">
                      <span>Pre: {pair.preScene.acquisitionDate.split('T')[0]}</span>
                      <span className="text-command-accent-glow">Post: {pair.postScene.acquisitionDate.split('T')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Analysis Algorithm & Threshold Controls */}
          <div className="bg-command-card border border-command-border rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-command-text uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-command-border">
              <Sliders className="w-3.5 h-3.5 text-command-accent-glow" />
              <span>2. ALGORITHM & SENSITIVITY</span>
            </h3>

            {/* Analysis Method Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-command-dim block uppercase font-bold">
                Change Detection Method:
              </label>
              <select
                value={analysisMethod}
                onChange={(e) => setAnalysisMethod(e.target.value as AnalysisMethod)}
                className="w-full bg-command-panel border border-command-border rounded p-2 text-xs text-command-text focus:outline-none focus:border-command-accent"
              >
                <option value="SAR_BACKSCATTER_RATIO">SAR Radar Amplitude Ratio (Δσ₀ &lt; -4 dB)</option>
                <option value="DIFF_MNDWI">Differential MNDWI (Water Extraction)</option>
                <option value="DIFF_NDVI">Differential NDVI (Scarp & Vegetation Loss)</option>
                <option value="HYBRID_AI_CHANGE">Hybrid Multi-Spectral + Radar Fusion</option>
              </select>
            </div>

            {/* Threshold Slider */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-command-muted text-[11px]">Detection Threshold (θ):</span>
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
              <div className="flex justify-between text-[9px] text-command-dim">
                <span>Conservative (0.10)</span>
                <span>Balanced (0.35)</span>
                <span>Aggressive (0.80)</span>
              </div>
            </div>

            {/* Action Button: ANALYZE CHANGE */}
            <div className="pt-3">
              <button
                onClick={() => handleRunAnalysis()}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 rounded-lg bg-command-accent hover:bg-sky-500 text-white font-bold text-xs shadow-tactical-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>EVALUATING PIPELINE...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>ANALYZE CHANGE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Viewer & Detection Results */}
        <div className="lg:col-span-8 space-y-4">
          {/* Comparative Satellite Viewer */}
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

          {/* Detection Results Metrics Panel */}
          {detectionResult && (
            <DetectionResultsPanel
              result={detectionResult}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* Error Display */}
          {errorMessage && (
            <ErrorState
              title="SATELLITE PROCESSING ERROR"
              error={errorMessage}
              onRetry={() => handleRunAnalysis()}
            />
          )}
        </div>
      </div>
    </div>
  );
};
