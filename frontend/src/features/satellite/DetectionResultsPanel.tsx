import React from 'react';
import type { ChangeDetectionResult } from '../../types/satellite';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { ConfidenceBadge } from '../../components/common/ConfidenceBadge';
import { 
  Waves, 
  Mountain, 
  Activity, 
  AlertTriangle, 
  Cpu 
} from 'lucide-react';

interface DetectionResultsPanelProps {
  result: ChangeDetectionResult;
  isAnalyzing?: boolean;
}

export const DetectionResultsPanel: React.FC<DetectionResultsPanelProps> = ({
  result,
  isAnalyzing = false,
}) => {
  return (
    <div className={`bg-command-card border rounded-lg p-4 font-mono shadow-2xl space-y-4 transition-all ${
      isAnalyzing ? 'border-sky-500/80 shadow-[0_0_15px_rgba(56,189,248,0.2)]' : 'border-command-border'
    }`}>
      {/* Header with Processing Badge & Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                result.processingMode === 'AI inference'
                  ? 'bg-sky-950/80 border-sky-700 text-sky-300'
                  : 'bg-amber-950/80 border-amber-700 text-amber-300'
              }`}
            >
              {result.processingMode}
            </span>
            <span className="text-[10px] text-command-dim">
              METHOD: {result.method.replace(/_/g, ' ')}
            </span>
          </div>
          <h3 className="text-sm font-bold text-command-text uppercase tracking-wider">
            SATELLITE CHANGE DETECTION & EXPOSURE METRICS
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-command-dim block">SPECTRAL THRESHOLD (θ)</span>
            <span className="text-xs font-bold text-command-accent-glow">{result.threshold.toFixed(2)}</span>
          </div>
          <ConfidenceBadge confidence={result.confidence} method={result.method} size="md" />
        </div>
      </div>

      {/* Primary Analytical Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Flood Inundation Area */}
        <div className="p-3 rounded-lg bg-command-panel/80 border border-command-border space-y-1">
          <div className="flex items-center justify-between text-command-dim text-[10px]">
            <span>FLOOD EXTENT</span>
            <Waves className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-sky-300 font-mono">
            {result.metrics.floodExtentKm2} <span className="text-xs text-command-dim font-normal">km²</span>
          </div>
          <div className="text-[10px] text-sky-200/70">
            {result.metrics.floodExtentHectares} hectares
          </div>
        </div>

        {/* Metric 2: Scarp & Debris Modification */}
        <div className="p-3 rounded-lg bg-command-panel/80 border border-command-border space-y-1">
          <div className="flex items-center justify-between text-command-dim text-[10px]">
            <span>DEBRIS / SCARP</span>
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">
            {result.metrics.scarpDebrisExtentKm2} <span className="text-xs text-command-dim font-normal">km²</span>
          </div>
          <div className="text-[10px] text-amber-200/70">
            {result.metrics.scarpDebrisExtentHectares} hectares
          </div>
        </div>

        {/* Metric 3: Active Surge Corridor */}
        <div className="p-3 rounded-lg bg-command-panel/80 border border-command-border space-y-1">
          <div className="flex items-center justify-between text-command-dim text-[10px]">
            <span>SURGE REACH</span>
            <Activity className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-300 font-mono">
            {result.metrics.riverCorridorLengthKm} <span className="text-xs text-command-dim font-normal">km</span>
          </div>
          <div className="text-[10px] text-command-dim">
            Bhote Koshi mainstem
          </div>
        </div>

        {/* Metric 4: Anomaly Severity Score */}
        <div className="p-3 rounded-lg bg-command-panel/80 border border-command-border space-y-1">
          <div className="flex items-center justify-between text-command-dim text-[10px]">
            <span>ANOMALY INDEX</span>
            <Cpu className="w-3.5 h-3.5 text-command-accent-glow" />
          </div>
          <div className="text-lg font-bold text-command-accent-glow font-mono">
            {result.metrics.anomalyScore} <span className="text-xs text-command-dim font-normal">/ 100</span>
          </div>
          <div className="text-[10px] text-emerald-400">
            {result.detectedPolygonsCount} anomaly polygons
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-3 rounded bg-command-panel border border-command-border text-xs space-y-1">
        <span className="text-[10px] font-bold text-command-dim uppercase tracking-wider block">
          Analytical Interpretation:
        </span>
        <p className="text-command-text text-[11px] leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Provenance & Sensor Attribution Strip */}
      <div className="p-3 rounded bg-command-surface/60 border border-command-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-3">
          <DataSourceBadge provenance={result.sensorProvenance} showDetails />
        </div>

        <div className="flex items-center gap-4 text-command-dim text-[10px]">
          <div>
            <span>SOURCE TILE: </span>
            <strong className="text-command-text font-mono">T45RWQ / IW_GRD</strong>
          </div>
          <div>
            <span>EVALUATED AT: </span>
            <strong className="text-command-text font-mono">{result.timestamp.replace('T', ' ').substring(0, 19)} UTC</strong>
          </div>
        </div>
      </div>

      {/* Caveats & Physical Reality Alerts */}
      <div className="space-y-1.5 pt-1">
        {result.caveats.map((caveat, idx) => (
          <div key={idx} className="flex items-start gap-2 text-[10px] text-amber-200/80 bg-amber-950/20 border border-amber-800/40 p-2 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{caveat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
